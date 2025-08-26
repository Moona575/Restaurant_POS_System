import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// Table Endpoints
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);

export const addCategory = (data) => axios.post("/api/categories", data);
// Category Endpoints

export const getCategories = () => axiosWrapper.get("/api/categories");
export const deleteCategory = (id) => axiosWrapper.delete(`/api/categories/${id}`);
export const updateCategory = (id, data) => axiosWrapper.put(`/api/categories/${id}`, data);
// Dish Endpoints
export const addDish = (data) => axios.post("/api/dishes", data);
export const getDishes = () => axios.get("/api/dishes");
export const getDish = (id) => axios.get(`/api/dishes/${id}`);
export const updateDish = (id, data) => axios.put(`/api/dishes/${id}`, data);
export const deleteDish = (id) => axios.delete(`/api/dishes/${id}`);
export const getDishesByCategory = (categoryId) => axios.get(`/api/dishes/category/${categoryId}`);

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment//verify-payment", data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });
import axios from "axios"; // <-- make sure this is at the top

const API = axios.create({
  baseURL: "http://localhost:8000/api", // replace with your backend URL
  withCredentials: true,
});

