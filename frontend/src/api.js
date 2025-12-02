import axios from "axios";

const api = axios.create({
  baseURL: "https://xeno-2vhd.onrender.com",
  withCredentials: false
});

// Attach JWT automatically on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;
