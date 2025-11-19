import axios from 'axios';
const API_URL = 'http://localhost:8080/api/orders';

export const getOrdersByUser = async (userId) =>
  axios.get(`${API_URL}/user/${userId}`).then(res => res.data);

export const updateOrderStatus = async (orderId, status) =>
  axios.put(`${API_URL}/${orderId}/status`, null, { params: { status } }).then(res => res.data);

export const placeOrder = async (order) =>
  axios.post(`${API_URL}/place`, order).then(res => res.data);
