import axios from 'axios';
import { API_BASE } from './api';

export const createOrder = async (payload) => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.post(`${API_BASE}/orders/`, payload, {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Network error' };
  }
};

export const createGuestOrder = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE}/guest-checkout/`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
};


export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/orders/${orderId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// ✅ Get all orders of current user
export const getAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/orders/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data; // শুধু array of orders রিটার্ন করবে
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};
