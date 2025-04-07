import axios from "axios";

const api = axios.create({
  baseURL: "https://student-evaluatie-tool.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
