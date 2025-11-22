export const getNearbyShopsMock = async (lat, lng, maxDistance) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, shopName: "Green Farm Organics", distanceKm: 1.2 },
          { id: 2, shopName: "SuperMart Daily", distanceKm: 0.8 },
          { id: 3, shopName: "The Bakery Junction", distanceKm: 2.5 },
          { id: 4, shopName: "Kirana King", distanceKm: 3.1 },
          { id: 5, shopName: "Daily Dairy", distanceKm: 1.5 },
          { id: 6, shopName: "Beverage Depot", distanceKm: 4.2 },
        ],
      });
    }, 500);
  });
};
