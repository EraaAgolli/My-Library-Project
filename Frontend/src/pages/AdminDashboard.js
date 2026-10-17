// src/pages/AdminDashboard.js
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "../components/AdminDashboard.css";

const TABS = ["Overview", "Orders", "Users", "Books"];
const STATUS_OPTS = ["PENDING", "CONFIRMED", "PAID", "COMPLETED", "EXPIRED", "CANCELLED"];
const STATUS_STYLES = {
  PENDING:   { background: "rgba(198,151,63,0.12)", color: "#c6973f" },
  CONFIRMED: { background: "rgba(26,58,107,0.12)",  color: "#1a3a6b" },
  PAID:      { background: "rgba(39,103,73,0.12)",  color: "#276749" },
  COMPLETED: { background: "rgba(39,103,73,0.12)",  color: "#276749" },
  EXPIRED:   { background: "rgba(160,174,192,0.15)",color: "#5a6a7a" },
  CANCELLED: { background: "rgba(197,48,48,0.12)",  color: "#c53030" },
};

const Badge = ({ s }) => (
  <span className="ad-badge" style={STATUS_STYLES[s] || STATUS_STYLES.EXPIRED}>{s}</span>
);
const Spin = () => <div className="ad-spinner" />;
const Avatar = ({ name }) => (
  <span className="ad-avatar">{name?.[0]?.toUpperCase() || "?"}</span>
);

const BOOK_FIELDS = [
  ["Title",        "title",       "text"],
  ["Author",       "author",      "text"],
  ["ISBN",         "isbn",        "text"],
  ["Publisher",    "publisher",   "text"],
  ["Category",     "category",   "text"],
  ["Language",     "language",   "text"],
  ["Audience",     "audience",   "text"],
  ["Price ($)",    "price",      "number"],
  ["Borrow Price", "borrowPrice","number"],
  ["Stock",        "stock",      "number"],
  ["Pages",        "pages",      "number"],
  ["Rating",       "rating",     "number"],
];

const EMPTY_BOOK = {
  title:"", author:"", isbn:"", publisher:"", category:"",
  language:"", audience:"", price:"", borrowPrice:"",
  availableForBorrow:false, stock:"", description:"",
  pages:"", rating:"", imageUrl:""
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [tab,      setTab]      = useState("Overview");
  const [stats,    setStats]    = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [users,    setUsers]    = useState([]);
  const [books,    setBooks]    = useState([]);
  const [busy,     setBusy]     = useState(false);
  const [expanded, setExpanded] = useState(null);

  const [oQ, setOQ] = useState("");
  const [uQ, setUQ] = useState("");
  const [bQ, setBQ] = useState("");

  const [modal,   setModal]   = useState(null);
  const [bForm,   setBForm]   = useState({});
  const [bSaving, setBSaving] = useState(false);
  const [bErr,    setBErr]    = useState("");

  useEffect(() => {
    document.body.classList.add("dashboard-page");
    return () => document.body.classList.remove("dashboard-page");
  }, []);

  useEffect(() => {
    api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/admin/orders").then(r => setOrders(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "Users" && !users.length) {
      setBusy(true);
      api.get("/admin/users").then(r => setUsers(r.data)).catch(() => {}).finally(() => setBusy(false));
    }
    if (tab === "Books" && !books.length) {
      setBusy(true);
      api.get("/books").then(r => setBooks(r.data?.content || r.data)).catch(() => {}).finally(() => setBusy(false));
    }
  }, [tab]);

  const patchStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
    } catch {}
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/books/${id}`);
      setBooks(p => p.filter(b => b.id !== id));
    } catch {}
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This will also delete all their orders. This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(p => p.filter(u => u.id !== id));
    } catch {}
  };

  const openModal = (book = null) => {
    setBErr("");
    setBForm(book ? { ...book } : { ...EMPTY_BOOK });
    setModal(book ? "edit" : "add");
  };

  const saveBook = async () => {
    setBSaving(true); setBErr("");
    try {
      if (modal === "add") {
        const r = await api.post("/books", bForm);
        setBooks(p => [r.data, ...p]);
      } else {
        const r = await api.put(`/books/${bForm.id}`, bForm);
        setBooks(p => p.map(b => b.id === bForm.id ? r.data : b));
      }
      setModal(null);
    } catch (e) {
      setBErr(e.response?.data?.message || "Failed to save. Please check the fields.");
    } finally {
      setBSaving(false);
    }
  };

  const fOrders = orders.filter(o =>
    `${o.userName} ${o.userEmail} ${o.sessionId}`.toLowerCase().includes(oQ.toLowerCase()));
  const fUsers = users.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(uQ.toLowerCase()));
  const fBooks = books.filter(b =>
    `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(bQ.toLowerCase()));

  const initials = user?.name?.[0]?.toUpperCase() || "A";
  const displayName = user?.name || "Admin";

  return (
    <div className="ad-root">

      <aside className="ad-sidebar">
        <Link to="/" className="ad-sidebar-logo">Epoch <em>of Books</em></Link>
        <p className="ad-sidebar-section">Admin Panel</p>
        <nav className="ad-nav">
          {TABS.map(t => (
            <button
              key={t}
              className={`ad-nav-item ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              <span className="ad-nav-icon">
                {t==="Overview"?"◈":t==="Orders"?"◎":t==="Users"?"◉":"◍"}
              </span>
              {t}
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <div className="ad-user-chip">
            <span className="ad-user-avatar">{initials}</span>
            <div>
              <p className="ad-user-name">{displayName}</p>
              <p className="ad-user-role">Administrator</p>
            </div>
          </div>
          <button className="ad-logout-btn" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="ad-main">

        <div className="ad-topbar">
          <div>
            <p className="ad-topbar-eyebrow">Admin Dashboard</p>
            <h1 className="ad-topbar-title">{tab}</h1>
          </div>
          {tab === "Books" && (
            <button className="ad-btn-primary" onClick={() => openModal()}>+ Add Book</button>
          )}
        </div>

        {tab === "Overview" && (
          <div className="ad-overview">
            {!stats ? <Spin /> : (
              <div className="ad-stats-grid">
                {[
                  ["Total Books",    stats.totalBooks,    "#c6973f"],
                  ["Total Users",    stats.totalUsers,    "#1a3a6b"],
                  ["Total Orders",   stats.totalOrders,   "#276749"],
                  ["Pending",        stats.pendingOrders, "#c6973f"],
                  ["Revenue (Paid)", `$${Number(stats.revenue).toFixed(2)}`, "#276749"],
                ].map(([l, v, a]) => (
                  <div key={l} className="ad-stat-card" style={{"--accent": a}}>
                    <p className="ad-stat-label">{l}</p>
                    <p className="ad-stat-value">{v}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="ad-recent-section">
              <h3 className="ad-section-title">Recent Orders</h3>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
                  </tr></thead>
                  <tbody>
                    {orders.slice(0, 8).map(o => (
                      <tr key={o.id}>
                        <td>
                          <strong>{o.userName}</strong>
                          <span className="ad-muted"> — {o.userEmail}</span>
                        </td>
                        <td><strong>${o.amountTotal?.toFixed(2) ?? "—"}</strong></td>
                        <td><Badge s={o.status} /></td>
                        <td className="ad-muted">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "Orders" && (
          <div className="ad-tab-content">
            <div className="ad-toolbar">
              <input
                className="ad-search"
                placeholder="Search by name, email, session ID…"
                value={oQ}
                onChange={e => setOQ(e.target.value)}
              />
              <span className="ad-count">{fOrders.length} orders</span>
            </div>
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr>
                  <th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th><th>Update Status</th>
                </tr></thead>
                <tbody>
                  {fOrders.map(o => (
                    <React.Fragment key={o.id}>
                      <tr
                        className="ad-order-row"
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      >
                        <td>
                          <strong>{o.userName}</strong><br/>
                          <span className="ad-muted">{o.userEmail}</span>
                        </td>
                        <td>{o.itemCount} item{o.itemCount !== 1 ? "s" : ""}</td>
                        <td><strong>${o.amountTotal?.toFixed(2) ?? "—"}</strong></td>
                        <td><Badge s={o.status} /></td>
                        <td className="ad-muted">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <select
                            className="ad-status-select"
                            value={o.status}
                            onChange={e => patchStatus(o.id, e.target.value)}
                          >
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                      {expanded === o.id && (
                        <tr className="ad-order-expand">
                          <td colSpan={6}>
                            <div className="ad-order-items">
                              {o.items?.map((it, i) => (
                                <div key={i} className="ad-order-item">
                                  <span className={`ad-item-type ${it.isBorrow ? "borrow" : "buy"}`}>
                                    {it.isBorrow ? "Borrow" : "Buy"}
                                  </span>
                                  <span className="ad-item-title">{it.title} × {it.quantity}</span>
                                  <span className="ad-item-price">${it.price?.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Users" && (
          <div className="ad-tab-content">
            <div className="ad-toolbar">
              <input
                className="ad-search"
                placeholder="Search by name or email…"
                value={uQ}
                onChange={e => setUQ(e.target.value)}
              />
              <span className="ad-count">{fUsers.length} users</span>
            </div>
            {busy ? <Spin /> : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>User</th><th>Email</th><th>Role</th><th>Orders</th><th>Total Spent</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {fUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="ad-user-row">
                            <Avatar name={u.name} />
                            <strong>{u.name}</strong>
                          </div>
                        </td>
                        <td className="ad-muted">{u.email}</td>
                        <td>
                          <span className={`ad-role-badge ${u.role === "ADMIN" ? "admin" : "user"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.orderCount}</td>
                        <td><strong>${u.totalSpent?.toFixed(2)}</strong></td>
                        <td>
                          <button className="ad-btn-delete" onClick={() => deleteUser(u.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "Books" && (
          <div className="ad-tab-content">
            <div className="ad-toolbar">
              <input
                className="ad-search"
                placeholder="Search by title, author, category…"
                value={bQ}
                onChange={e => setBQ(e.target.value)}
              />
              <span className="ad-count">{fBooks.length} books</span>
            </div>
            {busy ? <Spin /> : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Cover</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {fBooks.map(b => (
                      <tr key={b.id}>
                        <td>
                          {b.imageUrl
                            ? <img src={b.imageUrl} alt={b.title} className="ad-book-thumb" />
                            : <div className="ad-book-thumb-ph">📖</div>
                          }
                        </td>
                        <td>
                          <strong>{b.title}</strong><br/>
                          <span className="ad-muted">{b.author}</span>
                        </td>
                        <td className="ad-muted">{b.category || "—"}</td>
                        <td>
                          ${b.price?.toFixed(2)}
                          {b.availableForBorrow && (
                            <span className="ad-borrow-price"> / ${b.borrowPrice?.toFixed(2)}</span>
                          )}
                        </td>
                        <td>
                          <span className={`ad-stock ${b.stock <= 5 ? "low" : ""}`}>
                            {b.stock ?? "—"}
                          </span>
                        </td>
                        <td>{b.rating ? `⭐ ${b.rating}` : "—"}</td>
                        <td>
                          <div className="ad-book-actions">
                            <button className="ad-btn-edit" onClick={() => openModal(b)}>Edit</button>
                            <button className="ad-btn-delete" onClick={() => deleteBook(b.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {modal && (
        <div className="ad-modal-overlay" onClick={() => setModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2>{modal === "add" ? "Add New Book" : "Edit Book"}</h2>
              <button className="ad-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            {bErr && <div className="ad-modal-error">{bErr}</div>}

            <div className="ad-modal-body">
              <div className="ad-modal-grid">
                {BOOK_FIELDS.map(([l, k, t]) => (
                  <div key={k} className="ad-modal-field">
                    <label>{l}</label>
                    <input
                      type={t}
                      value={bForm[k] || ""}
                      onChange={e => setBForm(p => ({ ...p, [k]: e.target.value }))}
                    />
                  </div>
                ))}

                <div className="ad-modal-field ad-modal-full">
                  <label>Image URL</label>
                  <input
                    value={bForm.imageUrl || ""}
                    onChange={e => setBForm(p => ({ ...p, imageUrl: e.target.value }))}
                  />
                </div>

                <div className="ad-modal-field ad-modal-full">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={bForm.description || ""}
                    onChange={e => setBForm(p => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="ad-modal-field ad-modal-full ad-modal-check">
                  <input
                    type="checkbox"
                    checked={!!bForm.availableForBorrow}
                    onChange={e => setBForm(p => ({ ...p, availableForBorrow: e.target.checked }))}
                  />
                  <label>Available for borrow</label>
                </div>
              </div>
            </div>

            <div className="ad-modal-footer">
              <button className="ad-btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="ad-btn-primary" onClick={saveBook} disabled={bSaving}>
                {bSaving ? "Saving…" : modal === "add" ? "Add Book" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;