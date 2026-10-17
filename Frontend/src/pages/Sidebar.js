import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import api from "../api/axios";

const Sidebar = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.get("/books/categories")
      .then(res => setCategories(res.data ?? []))
      .catch(() => setCategories(["Fiction", "Classic", "Fantasy", "History", "Self-Help", "Science", "Children", "Memoir"]));
  }, []);

  const hasActiveFilters = filters.search || filters.category || filters.maxPrice || filters.minRating;
  const visibleCats = showAll ? categories : categories.slice(0, 6);

  const clearAll = () => {
    setFilters("search", "");
    setFilters("category", "");
    setFilters("maxPrice", "");
    setFilters("minRating", "");
  };

  return (
    <div className="sb-root">

      {/* ── Header ── */}
      <div className="sb-header">
        <span className="sb-header-title">Filters</span>
        {hasActiveFilters && (
          <button className="sb-clear-all" onClick={clearAll}>
            <FaTimes /> Clear all
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="sb-section">
        <div className="sb-section-label">Search</div>
        <div className="sb-search-wrap">
          <FaSearch className="sb-search-icon" />
          <input
            type="text"
            placeholder="Title or author…"
            value={filters.search || ""}
            onChange={e => setFilters("search", e.target.value)}
            className="sb-search-input"
          />
          {filters.search && (
            <button className="sb-search-clear" onClick={() => setFilters("search", "")}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* ── Category ── */}
      <div className="sb-section">
        <div className="sb-section-label">Category</div>
        <div className="sb-cat-list">
          <button
            className={`sb-cat-btn ${!filters.category ? "sb-cat-active" : ""}`}
            onClick={() => setFilters("category", "")}
          >
            All Books
            {!filters.category && <span className="sb-cat-dot" />}
          </button>
          {visibleCats.map(cat => (
            <button
              key={cat}
              className={`sb-cat-btn ${filters.category === cat ? "sb-cat-active" : ""}`}
              onClick={() => setFilters("category", cat)}
            >
              {cat}
              {filters.category === cat && <span className="sb-cat-dot" />}
            </button>
          ))}
        </div>
        {categories.length > 6 && (
          <button className="sb-show-more" onClick={() => setShowAll(v => !v)}>
            {showAll ? "Show less ↑" : `+${categories.length - 6} more ↓`}
          </button>
        )}
      </div>

      {/* ── Max Price ── */}
      <div className="sb-section">
        <div className="sb-section-label">
          Max Price
          <span className="sb-filter-val">{filters.maxPrice ? `$${filters.maxPrice}` : "Any"}</span>
        </div>
        <input
          type="range" min="0" max="100" step="5"
          value={filters.maxPrice || 100}
          onChange={e => setFilters("maxPrice", e.target.value === "100" ? "" : e.target.value)}
          className="sb-range"
        />
        <div className="sb-range-labels"><span>$0</span><span>$100</span></div>
      </div>

      {/* ── Min Rating ── */}
      <div className="sb-section">
        <div className="sb-section-label">
          Min Rating
          <span className="sb-filter-val">{filters.minRating ? `${filters.minRating}★+` : "Any"}</span>
        </div>
        <div className="sb-rating-list">
          {["", "1", "2", "3", "4"].map(val => (
            <button
              key={val}
              className={`sb-rating-btn ${filters.minRating === val ? "sb-rating-active" : ""}`}
              onClick={() => setFilters("minRating", val)}
            >
              {val ? (
                <>
                  <span className="sb-stars-row">
                    {"★".repeat(Number(val))}
                    <span className="sb-stars-empty">{"★".repeat(5 - Number(val))}</span>
                  </span>
                  <span className="sb-rating-label">& up</span>
                </>
              ) : "Any rating"}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;