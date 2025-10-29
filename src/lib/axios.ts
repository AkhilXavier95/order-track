import axios from "axios";
import toast from "react-hot-toast"; // or your preferred toaster

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Refresh token logic
      try {
        const refreshResponse = await axios.post("/api/auth/refresh");
        const newToken = refreshResponse.data.accessToken;

        localStorage.setItem("access_token", newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;

        return api.request(error.config); // retry original request
      } catch (refreshError) {
        console.error("Session expired. Please login again.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    } else {
      // Show toaster for other errors
      const message = error.response?.data?.message || "Something went wrong!";
      console.log(error.response?.data);
      toast.error(message); // Show toaster error
    }

    return Promise.reject(error);
  }
);

export default api;
