import axios from "axios";

const API_URL = "http://localhost:8080/events"; 

export const getEvents = () => axios.get(API_URL); 
