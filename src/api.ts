import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const api = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:3000/api"
    : "https://student-evaluatie-tool-dev.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
