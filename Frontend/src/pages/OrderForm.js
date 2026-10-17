// src/components/OrderForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../components/OrderForm.css"

const OrderForm = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/me")
      .then(res => setUser(res.data))
      .catch(() => setMessage("Please log in to place an order."));
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        quantity,
        orderDate: orderDate || new Date().toISOString().slice(0, 10)
      };
      const res = await axios.post(`/api/order/${bookId}`, dto);
      setMessage(`Order placed successfully! Order ID: ${res.data.id}, Total: $${res.data.totalPrice}`);
      // optional: navigate("/my-orders");
    } catch (err) {
      setMessage("Error placing order: " + (err.response?.data?.message ?? err.message));
    }
  };

  return (
    <div className="order-form">
      <h2>Buy Book</h2>
      <form onSubmit={handleOrder}>
        <div>
          <label>Book ID</label>
          <input type="text" value={bookId ?? ""} readOnly disabled />
        </div>
        <div>
          <label>User ID</label>
          <input type="text" value={user?.id ?? ""} readOnly disabled />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={e => setOrderDate(e.target.value)}
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderForm;
