import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
// Auth Endpoints
export const login = (data) => axiosWrapper.post("/user/login", data);
export const register = (data) => axiosWrapper.post("/user/register", data);
export const getUserData = () => axiosWrapper.get("/user/getUserData");
export const logout = (data) => axiosWrapper.post("/user/logout", data);

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
  baseURL: "https://restaurant-pos-system-ulxe.vercel.app", // replace with your backend URL
  withCredentials: true,
});

