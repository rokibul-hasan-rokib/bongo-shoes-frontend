import axios from "axios";
import { API_BASE } from "./api";

export const getCart = async (token) => {
  if (!token) throw new Error("No token found. User not authenticated.");

  const res = await axios.get(`${API_BASE}/carts/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return res.data; // returns array
};
export const updateCartItem = async (itemId, quantity, token) => {
  const res = await axios.patch(
    `${API_BASE}/cart-items/${itemId}/`,
    { quantity },
    { headers: {Authorization: `Token ${token}`,} }
  );
  return res.data;
};

export const removeCartItem = async (itemId, token) => {
  const res = await axios.delete(`${API_BASE}/cart-items/${itemId}/`, {
    headers: { Authorization: `Token ${token}`, },
  });
  return res.data;
};

export const addCartItem = async (productId, quantity, size = null, color = null, token) => {
  if (!token) throw new Error("No token found. User not authenticated.");

  const payload = { product_id: productId, quantity };
  if (size) payload.size = size;
  if (color) payload.color = color;

  console.log("🛒 Add to cart payload:", payload);

  const res = await axios.post(
    `${API_BASE}/cart-items/`,
    payload,
    {
      headers: {
        Authorization: `Token ${token}`, 
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};
