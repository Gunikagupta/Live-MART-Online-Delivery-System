package com.livemart.backend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true) // If you use Lombok, this is necessary to inherit fields
public class NearbyShopItem extends ShopItem {
    private Double distanceKm; // New field for location filtering
}