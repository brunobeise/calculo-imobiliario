import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL:
    import.meta.env.PUBLIC_ENV__API_URL ||
    "https://calculo-imobiliario-backend.vercel.app",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
