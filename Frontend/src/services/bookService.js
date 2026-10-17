// src/services/bookService.js
import axios from "axios";

const API_URL = "http://localhost:8080/books";
const BORROW_URL = "http://localhost:8080/borrows";
const RESERVE_URL = "http://localhost:8080/reservations";

export const getAllBooks = () => axios.get(API_URL);
export const searchByGenre = (genre) => axios.get(`${API_URL}/filter/genre?genre=${genre}`);
export const searchByTitle = (title) => axios.get(`${API_URL}/search/title?title=${title}`);
export const searchByAuthor = (author) => axios.get(`${API_URL}/search/author?author=${author}`);

export const borrowBook = (id,payload) => axios.post(`${BORROW_URL}/${id}`,payload);

export const reserveBook = (id,payload) => axios.post(`${RESERVE_URL}/${id}`,payload);

export const getBookById = (id) => axios.get(`${API_URL}/${id}`);


export const getBestSellers = () => {
  return axios.get(`${API_URL}/bestsellers?limit=5`);
};
