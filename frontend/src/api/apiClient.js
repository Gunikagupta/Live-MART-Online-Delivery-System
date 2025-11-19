import axios from "axios";

// ---------------------------------------
// MAIN AXIOS INSTANCE
// ---------------------------------------
const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// ---------------------------------------
// MODULE 2 FUNCTIONS
// ---------------------------------------
export const getItemsByCategory = (categoryId) => {
  return api.get(`/api/dashboard/categories/${categoryId}/items`);
};

export const getItemDetails = (itemId) => {
  return api.get(`/api/dashboard/items/${itemId}`);
};

export const getRetailerProxyItems = (retailerId) => {
  return api.get(`/api/dashboard/retailers/${retailerId}/proxy-items`);
};

// ---------------------------------------
// MODULE 3: SEARCH & NAVIGATION FUNCTIONS
// ---------------------------------------

// Smart item search (filters: cost, quantity, stock)
export const searchItems = (filters) => {
  return api.get("/api/items/search", { params: filters });
};

// Nearby shops based on user location
export const getNearbyShops = (lat, lng, radius) => {
  return api.get("/api/shops/nearby", {
    params: { lat, lng, radius },
  });
};

// Optional future: item search + geolocation together
export const searchItemsNearby = (lat, lng, radius, filters) => {
  return api.get("/api/items/search-nearby", {
    params: { lat, lng, radius, ...filters },
  });
};

export default api;
