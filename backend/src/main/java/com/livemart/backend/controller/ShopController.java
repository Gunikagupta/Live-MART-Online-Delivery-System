package com.livemart.backend.controller;

import com.livemart.backend.model.Shop;
import com.livemart.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for Shop search and navigation functionality (Module 3).
 */
@RestController
@RequestMapping("/api/v1/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    /**
     * Handles shop searching with integrated smart filtering and distance calculation.
     * * The method applies:
     * 1. Smart Filtering (cost <= maxCost, quantity >= minQuantity, inStock == true) 
     * using JPA Specifications (executed by the database).
     * 2. Distance Filtering (shop is within distanceKm of userLat/userLon)
     * 3. Distance Sorting (results are ordered closest-first)
     * * @param maxCost Upper limit for shop's average product cost.
     * @param minQuantity Minimum stock quantity required.
     * @param inStock Filter for only shops marked as in stock.
     * @param userLat User's latitude for distance calculation.
     * @param userLon User's longitude for distance calculation.
     * @param distanceKm Maximum distance (in kilometers) from the user.
     * @return A list of filtered and sorted Shop entities.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Shop>> searchShops(
            @RequestParam(required = false) BigDecimal maxCost,
            @RequestParam(required = false) Integer minQuantity,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLon,
            @RequestParam(required = false) Double distanceKm) {

        List<Shop> results = shopService.searchAndFilterShops(
                maxCost, 
                minQuantity, 
                inStock, 
                userLat, 
                userLon, 
                distanceKm
        );

        // Return 200 OK with the results list (which may be empty)
        return ResponseEntity.ok(results);
    }
}