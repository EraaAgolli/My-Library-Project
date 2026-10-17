import axios from "axios";

const API_URL = "http://localhost:8080/books";


export const getNewArrivals = (limit = 10) => axios.get(`${API_URL}/new-arrivals?limit=${limit}`);
