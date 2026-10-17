import axios from "axios";

const API_URL = "http://localhost:8080/contact";

export const submitContactMessage = (messageData) => {
  return axios.post(API_URL, messageData);
};

