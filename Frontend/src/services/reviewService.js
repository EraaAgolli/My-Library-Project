// src/services/reviewService.js
import axios from "axios";

const API_URL = "http://localhost:8080/reviews";

export const addReview = async (userId, bookId, rating, comment) => {
  return axios.post(`${API_URL}/add?userId=${userId}&bookId=${bookId}&rating=${rating}&comment=${comment}`);
};

export const getReviewsForBook = async (bookId) => {
  return axios.get(`${API_URL}/book/${bookId}`);
};

export const getReviewsForUser = async (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

export const deleteReview = async (reviewId) => {
  return axios.delete(`${API_URL}/${reviewId}`);
};

export const getAllReviews = async () => {
  return axios.get(`${API_URL}`);
}