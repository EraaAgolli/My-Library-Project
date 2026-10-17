import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import api from "../api/axios";
import "../components/UserDashboard.css";

const TABS = ["Overview", "My Orders", "Wishlist", "Profile"];

const STATUS_CLS = {
  PENDING:"pending", PAID:"paid", CONFIRMED:"paid",
  SHIPPED:"shipped", CANCELLED:"cancelled", REFUNDED:"refunded"
};
const Badge = ({ s }) => <span className={`ud-badge ud-badge-${STATUS_CLS[s] || "pending"}`}>{s}</span>;
const Spin  = () => <div className="ud-spinner"><div className="ud-spin-ring" /></div>;

const UserDashboard = () => {
  const { user, logout }                 = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const [tab,          setTab]          = useState("Overview");
  const [orders,       setOrders]       = useState([]);
  const [busy,         setBusy]         = useState(false);
  const [fetched,      setFetched]      = useState(false);
  const [expanded,     setExpanded]     = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery,  setSearchQuery]  = useState("");

  /* ── Apply dark class to body so navbar/footer pick up dashboard theme ── */
  useEffect(() => {
    document.body.classList.add("dashboard-page");
    return () => document.body.classList.remove("dashboard-page");
  }, []);

  useEffect(() => { if (!fetched) fetchOrders(); }, []);

  const fetchOrders = async () => {
    setBusy(true);
    try {
      const r = await api.get("/orders");
      setOrders(r.data);
      setFetched(true);
    } catch {}
    finally { setBusy(false); }
  };

  const totalSpent = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((s, o) => s + (o.amountTotal || 0), 0);

  const borrowedCount = orders
    .flatMap(o => o.items || [])
    .filter(it => it.isBorrow).length;

  const purchasedCount = orders
    .flatMap(o => o.items || [])
    .filter(it => !it.isBorrow).length;

  const purchaseSpend = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .flatMap(o => o.items || [])
    .filter(it => !it.isBorrow)
    .reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  const borrowSpend = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .flatMap(o => o.items || [])
    .filter(it => it.isBorrow)
    .reduce((s, it) => s + (it.borrowPrice || 0) * (it.quantity || 1), 0);

  /* ── Monthly spend data ── */
  const monthlyData = (() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return { label: d.toLocaleDateString("en-US", { month: "short" }), year: d.getFullYear(), month: d.getMonth(), buy: 0, borrow: 0 };
    });
    orders
      .filter(o => o.status !== "CANCELLED" && o.status !== "REFUNDED" && o.createdAt)
      .forEach(o => {
        const d = new Date(o.createdAt);
        const slot = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
        if (!slot) return;
        (o.items || []).forEach(it => {
          if (it.isBorrow) slot.borrow += (it.borrowPrice || 0) * (it.quantity || 1);
          else             slot.buy    += (it.price      || 0) * (it.quantity || 1);
        });
      });
    return months;
  })();

  const maxBar = Math.max(...monthlyData.map(m => m.buy + m.borrow), 1);

  /* ── Activity feed derived from orders ── */
  const activityItems = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map(o => {
      const isCancelled = o.status === "CANCELLED" || o.status === "REFUNDED";
      const bookName = o.items?.[0]?.title || "a book";
      const extra    = o.items?.length > 1 ? ` +${o.items.length - 1} more` : "";
      const dot      = isCancelled ? "red" : o.items?.some(it => it.isBorrow) ? "green" : "gold";
      const verb     = isCancelled ? "Cancelled order for" : o.items?.some(it => it.isBorrow) ? "Borrowed" : "Purchased";
      return {
        id: o.id,
        desc: `${verb} "${bookName}"${extra}`,
        time: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
        amt: isCancelled ? null : `$${o.amountTotal?.toFixed(2) ?? "—"}`,
        dot,
      };
    });

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchSearch = searchQuery === "" ||
      String(o.id).includes(searchQuery) ||
      o.items?.some(it => it.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const initials  = user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U";
  const firstName = user?.name?.split(" ")[0] || user?.username || "Reader";

  return (
    <div className="ud-root">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="ud-sidebar">
        <div className="ud-sidebar-top">
          <div className="ud-user-hero">
            <div className="ud-avatar-lg">{initials}</div>
            <h2 className="ud-user-name">{user?.name || user?.username}</h2>
            <p className="ud-user-email">{user?.email}</p>
            <span className="ud-role-chip">{user?.role || "Member"}</span>
          </div>

          <nav className="ud-nav">
            {TABS.map(t => (
              <button
                key={t}
                className="ud-nav-btn"
                style={{
                  color: tab === t ? "#d4a843" : "#8b95a5",
                  fontWeight: tab === t ? "600" : "500",
                  background: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setTab(t)}
              >
                <span className="ud-nav-icon">
                  {t==="Overview"?"◈":t==="My Orders"?"▤":t==="Wishlist"?"♡":"◉"}
                </span>
                <span className="ud-nav-label">{t}</span>
                {t === "My Orders" && orders.length > 0 && (
                  <span className="ud-nav-count">{orders.length}</span>
                )}
                {t === "Wishlist" && wishlist?.length > 0 && (
                  <span className="ud-nav-count">{wishlist.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="ud-sidebar-bottom">
          <div className="ud-sidebar-stat">
            <span className="ud-sidebar-stat-label">Total Spent</span>
            <span className="ud-sidebar-stat-value">${totalSpent.toFixed(2)}</span>
          </div>
          <button className="ud-logout" onClick={logout}>
            <span>→</span> Sign out
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="ud-main">

        <div className="ud-topbar">
          <div className="ud-topbar-left">
            <p className="ud-page-eyebrow">
              {tab === "Overview" ? `Welcome back, ${firstName}` : "Dashboard"}
            </p>
            <h1 className="ud-page-title">{tab}</h1>
          </div>
          {tab === "Overview" && (
            <Link to="/book-shop" className="ud-cta-btn">Browse Books →</Link>
          )}
          {tab === "My Orders" && (
            <div className="ud-toolbar">
              <input
                className="ud-search"
                placeholder="Search orders…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <select
                className="ud-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Shipped</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          )}
        </div>

        {/* ══ OVERVIEW ══ */}
        {tab === "Overview" && (
          <div className="ud-panel">

            {/* KPI row */}
            <div className="ud-kpi-row">
              <div className="ud-kpi">
                <p className="ud-kpi-value">{orders.length}</p>
                <p className="ud-kpi-label">Total Orders</p>
                <div className="ud-kpi-bar" style={{width:"100%"}} />
              </div>
              <div className="ud-kpi">
                <p className="ud-kpi-value">${totalSpent.toFixed(0)}</p>
                <p className="ud-kpi-label">Total Spent</p>
                <div className="ud-kpi-bar" style={{width:"80%"}} />
              </div>
              <div className="ud-kpi">
                <p className="ud-kpi-value">{purchasedCount}</p>
                <p className="ud-kpi-label">Purchased</p>
                <div className="ud-kpi-bar" style={{width:"60%"}} />
              </div>
              <div className="ud-kpi">
                <p className="ud-kpi-value">{borrowedCount}</p>
                <p className="ud-kpi-label">Borrowed</p>
                <div className="ud-kpi-bar" style={{width:"40%"}} />
              </div>
            </div>

            {/* Quick actions */}
            <div className="ud-quick-actions">
              <Link to="/book-shop" className="ud-qa-btn">
                <div className="ud-qa-icon gold">🛒</div>
                <div className="ud-qa-text">
                  <span className="ud-qa-label">Browse Shop</span>
                  <span className="ud-qa-sub">Discover new books</span>
                </div>
              </Link>
              <Link to="/wishlist" className="ud-qa-btn">
                <div className="ud-qa-icon green">♡</div>
                <div className="ud-qa-text">
                  <span className="ud-qa-label">My Wishlist</span>
                  <span className="ud-qa-sub">{wishlist?.length || 0} saved books</span>
                </div>
              </Link>
              <button className="ud-qa-btn" onClick={() => setTab("My Orders")}>
                <div className="ud-qa-icon blue">▤</div>
                <div className="ud-qa-text">
                  <span className="ud-qa-label">Order History</span>
                  <span className="ud-qa-sub">{orders.length} total orders</span>
                </div>
              </button>
            </div>

            {/* Spending breakdown + donut */}
            <div className="ud-overview-split">
              <div className="ud-breakdown">
                <p className="ud-breakdown-eyebrow">Spending breakdown</p>
                <p className="ud-breakdown-total">${totalSpent.toFixed(2)}</p>
                <div className="ud-breakdown-rows">
                  <div className="ud-breakdown-row">
                    <span className="ud-dot gold" />
                    <span className="ud-breakdown-lbl">Purchases</span>
                    <span className="ud-breakdown-val">${purchaseSpend.toFixed(2)}</span>
                  </div>
                  <div className="ud-breakdown-track">
                    <div className="ud-breakdown-fill gold" style={{width: totalSpent > 0 ? `${(purchaseSpend/totalSpent)*100}%` : "0%"}} />
                  </div>
                  <div className="ud-breakdown-row" style={{marginTop:"14px"}}>
                    <span className="ud-dot green" />
                    <span className="ud-breakdown-lbl">Borrows</span>
                    <span className="ud-breakdown-val">${borrowSpend.toFixed(2)}</span>
                  </div>
                  <div className="ud-breakdown-track">
                    <div className="ud-breakdown-fill green" style={{width: totalSpent > 0 ? `${(borrowSpend/totalSpent)*100}%` : "0%"}} />
                  </div>
                </div>
              </div>

              <div className="ud-donut-card">
                <p className="ud-breakdown-eyebrow">Reading mix</p>
                <div className="ud-donut-wrap">
                  <DonutChart purchased={purchasedCount} borrowed={borrowedCount} />
                  <div className="ud-donut-legend">
                    <div className="ud-dl-item">
                      <span className="ud-dot gold" />
                      <span className="ud-dl-label">Purchased</span>
                      <span className="ud-dl-val">{purchasedCount}</span>
                    </div>
                    <div className="ud-dl-item">
                      <span className="ud-dot green" />
                      <span className="ud-dl-label">Borrowed</span>
                      <span className="ud-dl-val">{borrowedCount}</span>
                    </div>
                    <div className="ud-dl-item">
                      <span className="ud-dot dim" />
                      <span className="ud-dl-label">Total</span>
                      <span className="ud-dl-val">{purchasedCount + borrowedCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div className="ud-chart-card">
              <div className="ud-chart-header">
                <p className="ud-breakdown-eyebrow">Monthly spending — last 6 months</p>
                <div className="ud-chart-legend">
                  <span className="ud-cl-item"><span className="ud-cl-dot gold"/>Purchases</span>
                  <span className="ud-cl-item"><span className="ud-cl-dot green"/>Borrows</span>
                </div>
              </div>
              <div className="ud-bar-chart">
                {monthlyData.map((m, i) => {
                  const buyH = ((m.buy    / maxBar) * 100).toFixed(1);
                  const borH = ((m.borrow / maxBar) * 100).toFixed(1);
                  return (
                    <div key={i} className="ud-bar-col">
                      <div className="ud-bar-stack">
                        <div className="ud-bar-seg green" style={{height:`${borH}%`}} title={`Borrow $${m.borrow.toFixed(2)}`} />
                        <div className="ud-bar-seg gold"  style={{height:`${buyH}%`}} title={`Buy $${m.buy.toFixed(2)}`} />
                      </div>
                      <span className="ud-bar-label">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="ud-section-hd">
                <p className="ud-section-title">Recent Orders</p>
                {orders.length > 4 && (
                  <button className="ud-section-more" onClick={() => setTab("My Orders")}>
                    View all {orders.length} →
                  </button>
                )}
              </div>
              {busy ? <Spin /> : orders.length === 0 ? (
                <EmptyState icon="📦" title="No orders yet" sub="Start shopping to see your orders here." cta="Browse Books" href="/book-shop" />
              ) : (
                <div className="ud-order-list">
                  {orders.slice(0, 4).map(o => (
                    <OrderRow key={o.id} o={o} expanded={expanded} setExpanded={setExpanded} />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div>
              <div className="ud-section-hd">
                <p className="ud-section-title">Recent Activity</p>
              </div>
              <div className="ud-activity">
                <div className="ud-activity-list">
                  {activityItems.length === 0 ? (
                    <div className="ud-activity-empty">No activity yet.</div>
                  ) : activityItems.map(a => (
                    <div key={a.id} className="ud-activity-item">
                      <div className="ud-activity-dot-wrap">
                        <div className={`ud-activity-dot-inner ${a.dot}`} />
                      </div>
                      <div className="ud-activity-info">
                        <div className="ud-activity-desc">{a.desc}</div>
                        <div className="ud-activity-time">{a.time}</div>
                      </div>
                      {a.amt && <div className="ud-activity-amt">{a.amt}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wishlist preview */}
            {wishlist?.length > 0 && (
              <div>
                <div className="ud-section-hd">
                  <p className="ud-section-title">Wishlist</p>
                  {wishlist.length > 4 && (
                    <button className="ud-section-more" onClick={() => setTab("Wishlist")}>
                      View all {wishlist.length} →
                    </button>
                  )}
                </div>
                <div className="ud-wish-grid">
                  {wishlist.slice(0, 4).map(item => (
                    <WishCard key={item.id} item={item} onRemove={removeFromWishlist} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ══ MY ORDERS ══ */}
        {tab === "My Orders" && (
          <div className="ud-panel">
            {busy ? <Spin /> : filteredOrders.length === 0 ? (
              <EmptyState
                icon="🛍️"
                title={orders.length === 0 ? "No orders yet" : "No results"}
                sub={orders.length === 0 ? "Your order history will appear here." : "Try a different search or filter."}
                cta={orders.length === 0 ? "Browse Books" : null}
                href="/book-shop"
              />
            ) : (
              <>
                <p className="ud-results-meta">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</p>
                <div className="ud-order-list">
                  {filteredOrders.map(o => (
                    <OrderRow key={o.id} o={o} expanded={expanded} setExpanded={setExpanded} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ WISHLIST ══ */}
        {tab === "Wishlist" && (
          <div className="ud-panel">
            {!wishlist || wishlist.length === 0 ? (
              <EmptyState icon="♡" title="Wishlist is empty" sub="Save books you want to read later." cta="Browse Books" href="/book-shop" />
            ) : (
              <div className="ud-wish-grid">
                {wishlist.map(item => (
                  <WishCard key={item.id} item={item} onRemove={removeFromWishlist} showPrice />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PROFILE ══ */}
        {tab === "Profile" && (
          <div className="ud-panel">
            <div className="ud-profile-wrap">
              <div className="ud-info-grid">
                {[
                  ["Full Name",  user?.name     || "—"],
                  ["Username",   user?.username  || "—"],
                  ["Email",      user?.email     || "—"],
                  ["Role",       user?.role      || "Member"],
                ].map(([label, value]) => (
                  <div key={label} className="ud-info-cell">
                    <p className="ud-info-label">{label}</p>
                    <p className="ud-info-value">{value}</p>
                  </div>
                ))}
              </div>
              <div className="ud-profile-stats">
                {[
                  ["Orders",    orders.length],
                  ["Spent",     `$${totalSpent.toFixed(0)}`],
                  ["Purchased", purchasedCount],
                  ["Borrowed",  borrowedCount],
                  ["Wishlist",  wishlist?.length || 0],
                ].map(([label, value]) => (
                  <div key={label} className="ud-ps-item">
                    <span className="ud-ps-value">{value}</span>
                    <span className="ud-ps-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

/* ── Donut Chart ── */
const DonutChart = ({ purchased, borrowed }) => {
  const total = purchased + borrowed;
  if (total === 0) {
    return (
      <svg viewBox="0 0 120 120" className="ud-donut-svg">
        <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
        <text x="60" y="65" textAnchor="middle" fill="#7d8590" fontSize="11" fontFamily="Inter,sans-serif">No data</text>
      </svg>
    );
  }
  const r = 44, circ = 2 * Math.PI * r;
  const buyRatio = purchased / total;
  const buyDash  = buyRatio * circ;
  const borDash  = circ - buyDash;
  const gap = 3;
  return (
    <svg viewBox="0 0 120 120" className="ud-donut-svg">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
      {borrowed > 0 && (
        <circle cx="60" cy="60" r={r} fill="none" stroke="#3fb950" strokeWidth="16"
          strokeDasharray={`${borDash - gap} ${circ - (borDash - gap)}`}
          strokeDashoffset={circ * 0.25} strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.6s ease"}} />
      )}
      {purchased > 0 && (
        <circle cx="60" cy="60" r={r} fill="none" stroke="#d4a843" strokeWidth="16"
          strokeDasharray={`${buyDash - gap} ${circ - (buyDash - gap)}`}
          strokeDashoffset={circ * 0.25 - borDash + gap} strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.6s ease"}} />
      )}
      <text x="60" y="56" textAnchor="middle" fill="#e6edf3" fontSize="18" fontWeight="700" fontFamily="serif">{total}</text>
      <text x="60" y="70" textAnchor="middle" fill="#7d8590" fontSize="8.5" fontFamily="Inter,sans-serif" letterSpacing="1">BOOKS</text>
    </svg>
  );
};

/* ── Order Row ── */
const OrderRow = ({ o, expanded, setExpanded }) => (
  <div className="ud-order-row">
    <div className="ud-order-summary" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
      <div className="ud-order-meta">
        <span className="ud-order-num">#{o.id}</span>
        <span className="ud-order-date">
          {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—"}
        </span>
      </div>
      <div className="ud-order-center">
        {o.items?.slice(0,2).map((it,i) => (
          <span key={i} className="ud-order-book-tag">{it.title}</span>
        ))}
        {o.items?.length > 2 && <span className="ud-order-book-more">+{o.items.length-2}</span>}
      </div>
      <div className="ud-order-end">
        <span className="ud-order-amt">${o.amountTotal?.toFixed(2) ?? "—"}</span>
        <Badge s={o.status} />
        <span className="ud-chevron">{expanded === o.id ? "▲" : "▼"}</span>
      </div>
    </div>
    {expanded === o.id && (
      <div className="ud-order-detail">
        {o.items?.map((it, i) => {
          const price = it.isBorrow ? it.borrowPrice : it.price;
          return (
            <div key={i} className="ud-detail-row">
              <div className="ud-detail-cover">
                {it.imageUrl
                  ? <img src={it.imageUrl} alt="" onError={e=>{e.target.onerror=null;e.target.style.display="none";}} />
                  : "📖"
                }
              </div>
              <div className="ud-detail-info">
                <span className="ud-detail-title">{it.title}</span>
                <span className={`ud-detail-type ${it.isBorrow?"borrow":"buy"}`}>
                  {it.isBorrow ? "Borrow" : "Purchase"}
                </span>
              </div>
              <div className="ud-detail-price">×{it.quantity} · ${price?.toFixed(2) ?? "—"}</div>
            </div>
          );
        })}
        <div className="ud-detail-total">
          <span>Order Total</span>
          <strong>${o.amountTotal?.toFixed(2) ?? "—"}</strong>
        </div>
      </div>
    )}
  </div>
);

/* ── Wish Card ── */
const WishCard = ({ item, onRemove, showPrice }) => (
  <div className="ud-wc">
    <Link to={`/books/${item.bookId}`} className="ud-wc-cover-link">
      {item.imageUrl
        ? <img src={item.imageUrl} alt={item.title} className="ud-wc-img" onError={e=>{e.target.onerror=null;e.target.style.display="none";}} />
        : <div className="ud-wc-ph">📖</div>
      }
    </Link>
    <div className="ud-wc-body">
      <p className="ud-wc-title">{item.title}</p>
      <p className="ud-wc-author">{item.author}</p>
      {showPrice && <p className="ud-wc-price">${item.price?.toFixed(2)}</p>}
      <div className="ud-wc-actions">
        <Link to={`/books/${item.bookId}`} className="ud-wc-view">View</Link>
        <button className="ud-wc-remove" onClick={() => onRemove(item.bookId)}>✕</button>
      </div>
    </div>
  </div>
);

/* ── Empty State ── */
const EmptyState = ({ icon, title, sub, cta, href }) => (
  <div className="ud-empty">
    <div className="ud-empty-icon">{icon}</div>
    <h3 className="ud-empty-title">{title}</h3>
    <p className="ud-empty-sub">{sub}</p>
    {cta && <Link to={href} className="ud-cta-btn">{cta} →</Link>}
  </div>
);

export default UserDashboard;