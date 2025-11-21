package com.livemart.backend.model;

public class NearbyShopItem extends ShopItem {
    private double distanceKm;

    public NearbyShopItem() {
        super();
    }

    public NearbyShopItem(String shopName, String itemName, java.math.BigDecimal price, Integer stockQuantity, String category, double distanceKm) {
        super(shopName, itemName, price, stockQuantity, category);
        this.distanceKm = distanceKm;
    }

    public double getDistanceKm() {
        return distanceKm;
    }
    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }
}
