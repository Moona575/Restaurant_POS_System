import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// First, log the env variable outside of the object
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,  // ✅ correct
  withCredentials: true,
  headers: { ...defaultHeader },
});
