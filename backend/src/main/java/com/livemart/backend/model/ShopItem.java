package com.livemart.backend.model;

import java.math.BigDecimal; // IMPORTANT Import
import lombok.Data; // Assuming you are using Lombok for simple getters/setters

@Data
public class ShopItem {
    private String shopName;
    private String itemName;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
}