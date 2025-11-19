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
// MODULE 3: SEARCH & NAVIGATION FUNCTIONS (CORRECTED PATH)
// ---------------------------------------

/**
 * Smart item search (filters: minPrice, maxPrice, minQuantity, category).
 * Maps to Java Controller endpoint: /api/v1/search/filter
 */
export const getFilteredItems = (filters) => {
  return api.get("/api/v1/search/filter", { params: filters });
};

/**
 * Nearby items based on user location (Haversine distance).
 * Maps to Java Controller endpoint: /api/v1/search/nearby
 * FIX: The path must be /api/v1/search/nearby
 */
export const getNearbyItems = (userLat, userLon, radiusKm) => {
    // CORRECTED PATH
  return api.get("/api/v1/search/nearby", {
    params: { 
        userLat: userLat, 
        userLon: userLon, 
        radiusKm: radiusKm 
    },
  });
};

export default api;