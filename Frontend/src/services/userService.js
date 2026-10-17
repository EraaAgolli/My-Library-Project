import axios from "axios";

const USERS_URL = "http://localhost:8080/users";

export const getCurrentUser = () =>
  axios.get("http://localhost:8080/users/me", {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  });
