import axios from "axios";

const API_URL = "http://localhost:8080/borrows";

export const borrowBook = async (userId, bookId)  => {
    return axios.post(`${API_URL}/borrow?userId=${userId}&bookId=${bookId}`);
};

export const returnBook = async (borrowId) => {
    return axios.post(`${API_URL}/return/${borrowId}`);
};

export const getOverdueBorrows = async () => {
  return axios.get("http://localhost:8080/borrows/overdue");
};
