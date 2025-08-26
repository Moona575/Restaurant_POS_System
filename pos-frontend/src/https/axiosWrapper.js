import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Debug logging
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://restaurant-pos-system-ulxe.vercel.app",
  withCredentials: true,
  headers: { ...defaultHeader },
});

// Request interceptor for debugging
axiosWrapper.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosWrapper.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);