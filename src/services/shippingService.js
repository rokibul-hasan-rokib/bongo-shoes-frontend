import axios from 'axios';
import { API_BASE } from './api';

// GET active shipping address
export const fetchDefaultShipping = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${API_BASE}/shipping-address/active/`, {
      headers: { Authorization: `Token ${token}` } 
    });
    return res.data;
  } catch (err) {
    console.error('Fetch default shipping failed', err);
    return null;
  }
};


// SAVE or UPDATE shipping address
export const saveShippingAddress = async (address, id=null) => {
  const token = localStorage.getItem('token');
  try {
    if(id) {
      // update existing
      const res = await axios.put(`${API_BASE}/shipping-address/${id}/`, address, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` }
      });
      return res.data;
    } else {
      // create new
      const res = await axios.post(`${API_BASE}/shipping-address/`, address, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` }
      });
      return res.data;
    }
  } catch(err) {
    console.error(err);
    throw err.response?.data || { message: 'Network error' };
  }
};
