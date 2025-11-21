package com.livemart.backend.model;

import java.math.BigDecimal;

public class ShopItem {
    private String shopName;
    private String itemName;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;

    public ShopItem() {}

    public ShopItem(String shopName, String itemName, BigDecimal price, Integer stockQuantity, String category) {
        this.shopName = shopName;
        this.itemName = itemName;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.category = category;
    }

    public String getShopName() {
        return shopName;
    }
    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getItemName() {
        return itemName;
    }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
}
