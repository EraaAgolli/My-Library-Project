import axios from "axios";

const API_URL = "http://localhost:8080/reservations";

// Reserve a book (only if unavailable)
export const reserveBook = async (bookId, userId) => {
  return axios.post(`${API_URL}/${bookId}?userId=${userId}`);
};

// Get reservations for a specific user
export const getReservationsForUser = async (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

// Get reservations for a specific book
export const getReservationsForBook = async (bookId) => {
  return axios.get(`${API_URL}/book/${bookId}`);
};

// Get reservations by user and book
export const getReservationByUserAndBook = async (userId, bookId) => {
  return axios.get(`${API_URL}/user/${userId}/book/${bookId}`);
};

// Cancel reservation
export const cancelReservation = async (reservationId) => {
  return axios.delete(`${API_URL}/${reservationId}`);
};
