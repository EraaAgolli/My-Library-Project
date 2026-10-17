// src/pages/ReviewPage.js
import React, { useEffect, useState } from "react";
import { getAllReviews } from "../services/reviewService";
import "./../components/Review.css";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAllReviews()
      .then(res => setReviews(res.data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  return (
    <div className="review-section">
      <h2 className="review-title">Our Readers Say</h2>
      <div className="review-grid">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet.</p>
        ) : (
          reviews.map((r, index) => (
            <div key={r.id} className="review-card" style={{ animationDelay: `${index * 0.15}s` }}>
              {/* Optional avatar placeholder */}
              <div className="review-avatar">
                <span>{r.userId ? r.userId.toString().charAt(0) : "U"}</span>
              </div>
              <div className="review-content">
                <p className="review-comment">"{r.comment}"</p>
                <span className="review-rating">⭐ {r.rating}/5</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
