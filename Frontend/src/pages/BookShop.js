// src/pages/BookShop.js
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBook, FaFilter, FaTimes } from "react-icons/fa";
import api from "../api/axios";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext }     from "../context/AuthContext";
import Sidebar from "./Sidebar";
import "./../components/Shop.css";

const TOAST_DURATION = 2500;

function BookShop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books,       setBooks]       = useState([]);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalItems,  setTotalItems]  = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast,       setToast]       = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search:    searchParams.get("search")    || "",
    category:  searchParams.get("category") || "",
    maxPrice:  searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    page:      parseInt(searchParams.get("page") || "0", 10),
    size:      12,
    sort:      searchParams.get("sort") || "title,asc",
  });

  const { user }                         = useContext(AuthContext);
  const { addToCart }                    = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const fetchBooks = useCallback(async () => {
    setPageLoading(true);
    try {
      const params = { page: filters.page, size: filters.size, sort: filters.sort };
      if (filters.search)    params.search    = filters.search;
      if (filters.category)  params.category  = filters.category;
      if (filters.maxPrice)  params.maxPrice  = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      const res  = await api.get("/books", { params });
      const data = res.data;
      setBooks(data.content ?? data);
      setTotalPages(data.totalPages ?? 1);
      setTotalItems(data.totalElements ?? (data.content?.length ?? 0));
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setPageLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  useEffect(() => {
    const p = {};
    if (filters.search)    p.search    = filters.search;
    if (filters.category)  p.category  = filters.category;
    if (filters.maxPrice)  p.maxPrice  = filters.maxPrice;
    if (filters.minRating) p.minRating = filters.minRating;
    if (filters.page > 0)  p.page      = filters.page;
    if (filters.sort !== "title,asc") p.sort = filters.sort;
    setSearchParams(p, { replace: true });
  }, [filters, setSearchParams]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), TOAST_DURATION);
  };

  const handleAddToCart = async (e, book, isBorrow = false) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { showToast("Please sign in to add items to cart.", "error"); return; }
    if (user.role === "ADMIN") { showToast("You're an admin — admins can't buy books.", "error"); return; }
    const ok = await addToCart(book.id, 1, isBorrow);
    if (ok) showToast(isBorrow ? `"${book.title}" added for borrowing!` : `"${book.title}" added to cart!`);
  };

  const handleWishlist = async (e, book) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { showToast("Please sign in to use your wishlist.", "error"); return; }
    if (user.role === "ADMIN") { showToast("You're an admin — admins can't use the wishlist.", "error"); return; }
    await toggleWishlist(book.id);
    showToast(isInWishlist(book.id) ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleFilterChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value, page: 0 }));

  const resetFilters = () =>
    setFilters({ search: "", category: "", maxPrice: "", minRating: "", page: 0, size: 12, sort: "title,asc" });

  const canBorrow = book =>
    book.availableForBorrow === true && book.borrowPrice != null && Number(book.borrowPrice) > 0;

  const renderStars = rating =>
    [1,2,3,4,5].map(i => (
      <span key={i} className={`sh-star ${i <= Math.round(rating) ? "sh-star-on" : ""}`}>★</span>
    ));

  const activeFilterCount = [filters.search, filters.category, filters.maxPrice, filters.minRating].filter(Boolean).length;

  return (
    <div className="sh-root">
      {toast && <div className={`sh-toast ${toast.type === "error" ? "sh-toast-err" : ""}`}>{toast.msg}</div>}

      {sidebarOpen && <div className="sh-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="sh-layout">

        <aside className={`sh-sidebar ${sidebarOpen ? "sh-sidebar-open" : ""}`}>
          <Sidebar filters={filters} setFilters={handleFilterChange} />
        </aside>

        <div className="sh-main">

          <div className="sh-topbar">
            <div className="sh-topbar-left">
              <button className="sh-filter-toggle" onClick={() => setSidebarOpen(v => !v)}>
                <FaFilter />
                Filters
                {activeFilterCount > 0 && <span className="sh-filter-badge">{activeFilterCount}</span>}
              </button>
              <div>
                <h2 className="sh-page-title">{filters.category || "All Books"}</h2>
                {totalItems > 0 && <p className="sh-page-sub">{totalItems} titles found</p>}
              </div>
            </div>
            <div className="sh-sort">
              <span className="sh-sort-label">Sort by</span>
              <select
                value={filters.sort}
                onChange={e => handleFilterChange("sort", e.target.value)}
                className="sh-sort-select"
              >
                <option value="title,asc">Title A–Z</option>
                <option value="title,desc">Title Z–A</option>
                <option value="price,asc">Price: Low → High</option>
                <option value="price,desc">Price: High → Low</option>
                <option value="rating,desc">Highest Rated</option>
                <option value="id,desc">Newest First</option>
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="sh-chips">
              {filters.category  && <span className="sh-chip">{filters.category}<button onClick={() => handleFilterChange("category", "")}>×</button></span>}
              {filters.maxPrice  && <span className="sh-chip">Max ${filters.maxPrice}<button onClick={() => handleFilterChange("maxPrice", "")}>×</button></span>}
              {filters.minRating && <span className="sh-chip">{filters.minRating}★+<button onClick={() => handleFilterChange("minRating", "")}>×</button></span>}
              {filters.search    && <span className="sh-chip">"{filters.search}"<button onClick={() => handleFilterChange("search", "")}>×</button></span>}
              <button className="sh-chip-clear" onClick={resetFilters}><FaTimes /> Clear all</button>
            </div>
          )}

          {pageLoading ? (
            <div className="sh-grid">
              {[...Array(12)].map((_, i) => <div key={i} className="sh-skeleton" />)}
            </div>
          ) : books.length === 0 ? (
            <div className="sh-empty">
              <div className="sh-empty-icon">📖</div>
              <h3 className="sh-empty-title">No books found</h3>
              <p className="sh-empty-sub">Try adjusting your filters or search term.</p>
              <button className="sh-empty-btn" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="sh-grid">
              {books.map(book => {
                const borrowable = canBorrow(book);
                const wishlisted = isInWishlist(book.id);
                return (
                  <Link to={`/books/${book.id}`} key={book.id} className="sh-card-link">
                    <div className="sh-card">
                      <div className="sh-cover">
                        {book.imageUrl
                          ? <img src={book.imageUrl} alt={book.title} loading="lazy" />
                          : <div className="sh-cover-ph">📖</div>
                        }
                        {book.category && <span className="sh-cat-chip">{book.category}</span>}
                        {borrowable    && <span className="sh-borrow-chip">Borrowable</span>}
                        <button
                          className={`sh-heart ${wishlisted ? "sh-heart-on" : ""}`}
                          onClick={e => handleWishlist(e, book)}
                          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <FaHeart />
                        </button>
                      </div>
                      <div className="sh-info">
                        <p className="sh-author">{book.author}</p>
                        <h3 className="sh-title">{book.title}</h3>
                        <div className="sh-stars">{renderStars(book.rating || 0)}</div>
                        <div className="sh-pricing">
                          <div className="sh-prices">
                            <strong className="sh-buy-price">${book.price?.toFixed(2)}</strong>
                            {borrowable && <span className="sh-borrow-price">Borrow ${Number(book.borrowPrice).toFixed(2)}</span>}
                          </div>
                          <div className="sh-actions">
                            <button className="sh-btn-buy" onClick={e => handleAddToCart(e, book, false)} title="Add to cart">
                              <FaShoppingCart />
                            </button>
                            {borrowable && (
                              <button className="sh-btn-borrow" onClick={e => handleAddToCart(e, book, true)} title="Borrow">
                                <FaBook />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="sh-pagination">
              <button
                className="sh-page-btn"
                disabled={filters.page === 0}
                onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
              >← Prev</button>

              {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                const n = totalPages <= 7 ? i
                  : filters.page <= 3 ? i
                  : filters.page >= totalPages - 4 ? totalPages - 7 + i
                  : filters.page - 3 + i;
                return (
                  <button
                    key={n}
                    className={`sh-page-btn ${filters.page === n ? "sh-page-active" : ""}`}
                    onClick={() => setFilters(p => ({ ...p, page: n }))}
                  >{n + 1}</button>
                );
              })}

              <button
                className="sh-page-btn"
                disabled={filters.page === totalPages - 1}
                onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
              >Next →</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookShop;