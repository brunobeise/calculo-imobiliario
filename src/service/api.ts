import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.API_URL ||
    "https://calculo-imobiliario-backend.vercel.app",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
