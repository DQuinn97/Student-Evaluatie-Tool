import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const api = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:3000/api"
    : "https://student-evaluatie-tool.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) =>
    ({
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }) as any,
  null,
  { synchronous: true },
);

export default api;
