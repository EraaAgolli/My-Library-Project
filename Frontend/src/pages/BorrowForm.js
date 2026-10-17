import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "../components/BorrowForm.css";
import { FaArrowLeft } from "react-icons/fa";

const BorrowForm = ({ bookId: propBookId }) => {
  const params = useParams();
  const routeBookId = params.bookId;
  const bookId = propBookId ?? routeBookId;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [borrowType, setBorrowType] = useState("STANDARD");
  const [message, setMessage] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Fetch current logged-in user info from backend
    // Endpoint should return JSON like { id: 1, username: "era", email: "...", role: "USER" }
    // If you use session cookies, no Authorization header is needed.
    // If you use JWT, include Authorization header: { headers: { Authorization: `Bearer ${token}` } }
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me"); // adjust endpoint as needed
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch current user", err);
        setMessage("Unable to load user. Please log in.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!bookId) {
      setMessage("Book ID is missing.");
      return;
    }
    try {
      // POST to the endpoint that expects path /borrow/{bookId} and reads user from session
      const res = await axios.post(`/borrow/${bookId}`, {
        borrowDate,
        dueDate,
        borrowType,
      });
      setMessage(`Borrow successful! Borrow ID: ${res.data.id}`);
    } catch (err) {
      console.error(err);
      setMessage("Error borrowing book: " + (err.response?.data?.message ?? err.message));
    }
  };

  if (loadingUser) {
    return <div className="borrow-form">Loading user...</div>;
  }

  return (
    <div className="borrow-form">
      <div className="back-icon" onClick={() => navigate("/book-filter")}>
        <FaArrowLeft size={22} />
      </div>
      <h2>Borrow a Book</h2>

      <form onSubmit={handleBorrow}>
        <div>
          <label>Book ID</label>
          <input
            type="text"
            value={bookId ?? ""}
            readOnly
            disabled
            aria-readonly="true"
          />
        </div>

        <div>
          <label>User ID</label>
          <input
            type="text"
            value={currentUser?.id ?? ""}
            readOnly
            disabled
            aria-readonly="true"
          />
        </div>

        <div>
          <label>Borrow Date</label>
          <input
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Borrow Type</label>
          <select value={borrowType} onChange={(e) => setBorrowType(e.target.value)}>
            <option value="STANDARD">Standard</option>
            <option value="SHORT_TERM">Short Term</option>
            <option value="RESERVE">Reserve</option>
          </select>
        </div>

        <button type="submit">Borrow</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default BorrowForm;
