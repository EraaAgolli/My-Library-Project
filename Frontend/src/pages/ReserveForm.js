// src/components/ReserveForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../components/ReserveForm.css"
import { FaArrowLeft } from "react-icons/fa";


const ReserveForm = () => {
  const { bookId } = useParams();
  const [user, setUser] = useState(null);
  const [reserveDate, setReserveDate] = useState(""); // use reserveDate
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/me")
      .then(res => setUser(res.data))
      .catch(() => setMessage("Please log in to reserve a book."));
  }, []);

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        reserveDate, // send reserveDate to backend
        reserveType: "STANDARD"
      };
      const res = await axios.post(`/api/reserve/${bookId}`, dto);
      setMessage(`Reserved successfully! Reservation ID: ${res.data.id}`);
    } catch (err) {
      setMessage("Error reserving book: " + (err.response?.data?.message ?? err.message));
    }
  };

  return (
    <div className="reserve-form">
      <div className="back-icon" onClick={() => navigate("/book-filter")}>
        <FaArrowLeft size={22} />
      </div>
      <h2>Reserve Book</h2>
      <form onSubmit={handleReserve}>
        <div>
          <label>Book ID</label>
          <input type="text" value={bookId ?? ""} readOnly disabled />
        </div>
        <div>
          <label>User ID</label>
          <input type="text" value={user?.id ?? ""} readOnly disabled />
        </div>
        <div>
          <label>Reserve Date</label>
          <input
            type="date"
            value={reserveDate}
            onChange={e => setReserveDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reserve</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReserveForm;
