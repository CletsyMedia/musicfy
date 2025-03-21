import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
});

// Add a request interceptor to include the token
AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("clerk_session_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
