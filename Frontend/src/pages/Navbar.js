import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart, FaShoppingCart, FaSearch, FaTimes, FaBars,
  FaSignOutAlt, FaThLarge
} from "react-icons/fa";
import { AuthContext }     from "../context/AuthContext";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./../components/Navbar.css";

const HIDE = [];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [drawer,     setDrawer]     = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q,          setQ]          = useState("");

  const { user, logout }    = useContext(AuthContext);
  const { cartCount }       = useContext(CartContext);
  const { wishlistCount }   = useContext(WishlistContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const userRef   = useRef(null);
  const searchRef = useRef(null);

  // All hooks must run before any conditional return
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (userRef.current   && !userRef.current.contains(e.target))   setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setUserOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  if (HIDE.includes(location.pathname)) return null;

  const solid = true;

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/book-shop?search=${encodeURIComponent(q.trim())}`);
    setQ(""); setSearchOpen(false); setDrawer(false);
  };

  const signOut = () => { logout(); navigate("/"); setUserOpen(false); };

  const on = (to) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const LINKS = [
    { to: "/",               label: "Home"     },
    { to: "/book-shop",      label: "Shop"     },
    { to: "/about",          label: "About"    },
    { to: "/libraryservice", label: "Services" },
    { to: "/contact",        label: "Contact"  },
  ];

  return (
    <>
      <nav className={`nav ${solid ? "nav--solid" : "nav--clear"} ${scrolled ? "nav--shadow" : ""}`}>
        <div className="nav__wrap">

          {/* Logo */}
          <Link to="/" className="nav__logo">
            <span className="nav__logo-word">Epoch</span>
            <em className="nav__logo-sub">of Books</em>
          </Link>

          {/* Desktop links */}
          <ul className="nav__links">
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={`nav__a ${on(l.to) ? "nav__a--on" : ""}`}>
                  {l.label}
                  {on(l.to) && <span className="nav__dot" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="nav__right">

            {/* Search */}
            <div className={`nav__search-box ${searchOpen ? "nav__search-box--open" : ""}`} ref={searchRef}>
              <form onSubmit={search} className="nav__search-form">
                <FaSearch size={12} className="nav__search-ico" />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search…"
                  autoFocus={searchOpen}
                />
                {q && <button type="button" className="nav__search-clear" onClick={() => setQ("")}><FaTimes size={10}/></button>}
              </form>
              <button
                className={`nav__search-toggle ${solid ? "" : "nav__search-toggle--clear"}`}
                onClick={() => setSearchOpen(o => !o)}
                aria-label="Search"
              >
                {searchOpen ? <FaTimes size={14}/> : <FaSearch size={14}/>}
              </button>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className={`nav__btn ${solid ? "" : "nav__btn--clear"}`} aria-label="Wishlist">
              <FaHeart size={14}/>
              {wishlistCount > 0 && <span className="nav__badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className={`nav__btn ${solid ? "" : "nav__btn--clear"}`} aria-label="Cart">
              <FaShoppingCart size={15}/>
              {cartCount > 0 && <span className="nav__badge">{cartCount}</span>}
            </Link>

            <div className="nav__sep" />

            {/* Auth */}
            {user ? (
              <div className="nav__user" ref={userRef}>
                <button
                  className="nav__user-trigger"
                  onClick={() => setUserOpen(o => !o)}
                >
                  <span className="nav__initial">{user.name?.[0]?.toUpperCase() || "U"}</span>
                  <span className={`nav__uname ${solid ? "" : "nav__uname--clear"}`}>
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                {userOpen && (
                  <div className="nav__pop">
                    <div className="nav__pop-top">
                      <span className="nav__pop-initial">{user.name?.[0]?.toUpperCase()}</span>
                      <div>
                        <p className="nav__pop-name">{user.name}</p>
                        <p className="nav__pop-email">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/dashboard" className="nav__pop-item" onClick={() => setUserOpen(false)}>
                      <FaThLarge size={11}/> Dashboard
                    </Link>
                    <button className="nav__pop-item nav__pop-item--out" onClick={signOut}>
                      <FaSignOutAlt size={11}/> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={`nav__signin ${solid ? "nav__signin--solid" : "nav__signin--clear"}`}>
                Sign in
              </Link>
            )}

            {/* Burger */}
            <button
              className={`nav__burger ${solid ? "" : "nav__burger--clear"}`}
              onClick={() => setDrawer(o => !o)}
              aria-label="Menu"
            >
              {drawer ? <FaTimes size={16}/> : <FaBars size={16}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div className={`nav__drawer ${drawer ? "nav__drawer--open" : ""}`}>
        <div className="nav__drawer-links">
          {LINKS.map(l => (
            <Link
              key={l.to} to={l.to}
              className={`nav__drawer-a ${on(l.to) ? "nav__drawer-a--on" : ""}`}
              onClick={() => setDrawer(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <form onSubmit={search} className="nav__drawer-search">
          <FaSearch size={12}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search books…"/>
          <button type="submit">Go</button>
        </form>

        <div className="nav__drawer-row">
          <Link to="/wishlist" className="nav__drawer-chip" onClick={() => setDrawer(false)}>
            <FaHeart size={12}/> Wishlist
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </Link>
          <Link to="/cart" className="nav__drawer-chip" onClick={() => setDrawer(false)}>
            <FaShoppingCart size={12}/> Cart
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
        </div>

        {user ? (
          <div className="nav__drawer-user">
            <span className="nav__drawer-who">{user.name}</span>
            <Link to="/dashboard" className="nav__drawer-chip" onClick={() => setDrawer(false)}>
              <FaThLarge size={12}/> Dashboard
            </Link>
            <button className="nav__drawer-chip nav__drawer-chip--out" onClick={signOut}>
              <FaSignOutAlt size={12}/> Sign out
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav__drawer-signin" onClick={() => setDrawer(false)}>
            Sign in
          </Link>
        )}
      </div>
      {drawer && <div className="nav__veil" onClick={() => setDrawer(false)}/>}
    </>
  );
}