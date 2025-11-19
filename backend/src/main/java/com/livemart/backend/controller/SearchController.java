package com.livemart.backend.controller;

import com.livemart.backend.model.NearbyShopItem;
import com.livemart.backend.model.ShopItem;
import com.livemart.backend.repository.SearchRepository;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchRepository searchRepository;

    // Dependency Injection: Spring automatically provides the SearchRepository instance
    public SearchController(SearchRepository searchRepository) {
        this.searchRepository = searchRepository;
    }

    // --- Endpoint 1: Smart Filtering (Cost, Quantity, Category) ---
    // URL Example: GET /api/v1/search/filter?minPrice=10.00&maxPrice=50.00&minQuantity=10&category=Beverages
    
    /**
     * Retrieves items filtered by price range, minimum stock quantity, and category.
     */
    @GetMapping("/filter")
    public List<ShopItem> filterItems(
        @RequestParam(name = "minPrice") BigDecimal minPrice,
        @RequestParam(name = "maxPrice") BigDecimal maxPrice,
        @RequestParam(name = "minQuantity") int minQuantity,
        @RequestParam(name = "category") String category) {
        
        // Calls the filtering logic in the repository layer
        return searchRepository.getFilteredItems(minPrice, maxPrice, minQuantity, category);
    }


    // --- Endpoint 2: Location-Based Filtering (Distance) ---
    // URL Example: GET /api/v1/search/nearby?userLat=34.05&userLon=-118.24&radiusKm=5

    /**
     * Retrieves items from shops within a specified radius (km) of the user's location.
     */
    @GetMapping("/nearby")
    public List<NearbyShopItem> findNearbyItems(
        @RequestParam(name = "userLat") double userLat,
        @RequestParam(name = "userLon") double userLon,
        @RequestParam(name = "radiusKm") int radiusKm) {

        // Calls the Haversine distance calculation logic in the repository layer
        return searchRepository.getNearbyItems(userLat, userLon, radiusKm);
    }
}