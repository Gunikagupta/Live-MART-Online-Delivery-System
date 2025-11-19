package com.livemart.backend.service;

import com.livemart.backend.model.Shop;
import com.livemart.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    /**
     * Searches shops based on distance only.
     * (Smart filtering removed because Shop entity does NOT contain cost/quantity/stock)
     */
    public List<Shop> searchAndFilterShops(
            BigDecimal maxCost,
            Integer minQuantity,
            Boolean inStock,
            Double userLat,
            Double userLon,
            Double distanceKm) {

        // ONLY fetch all shops (no invalid JPA filtering)
        List<Shop> shops = shopRepository.findAll();

        // Distance filtering
        if (userLat != null && userLon != null && distanceKm != null) {
            return shops.stream()
                    .filter(shop ->
                            calculateDistance(userLat, userLon,
                                    shop.getLatitude(), shop.getLongitude()) <= distanceKm)
                    .sorted((s1, s2) -> Double.compare(
                            calculateDistance(userLat, userLon, s1.getLatitude(), s1.getLongitude()),
                            calculateDistance(userLat, userLon, s2.getLatitude(), s2.getLongitude())
                    ))
                    .collect(Collectors.toList());
        }

        return shops;
    }

    /**
     * Haversine Distance Calculation
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
