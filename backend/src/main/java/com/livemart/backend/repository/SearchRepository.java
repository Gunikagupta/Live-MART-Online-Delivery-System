package com.livemart.backend.repository;

import java.math.BigDecimal;
import java.util.List;

// Spring annotations for data access
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

// NOTE: You must create these classes in your model/entity package.
import com.livemart.backend.model.ShopItem;
import com.livemart.backend.model.NearbyShopItem; 

@Repository
public class SearchRepository {

    private final JdbcTemplate jdbcTemplate;

    // Dependency Injection: Spring automatically provides the configured JdbcTemplate
    public SearchRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // --- METHOD 1: SMART FILTERING (Cost, Quantity, Category) ---
    public List<ShopItem> getFilteredItems(BigDecimal minPrice, BigDecimal maxPrice, int minQuantity, String category) {
        
        String sql = """
            SELECT
                s.name AS shop_name,
                i.name AS item_name,
                i.price,
                i.stock_quantity,
                i.category
            FROM
                items i
            JOIN
                shops s ON i.shop_id = s.id
            WHERE
                i.is_available = TRUE
                AND i.price BETWEEN ? AND ?
                AND i.stock_quantity >= ?
                AND i.category = ?
            ORDER BY
                i.price ASC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ShopItem item = new ShopItem();
            item.setShopName(rs.getString("shop_name"));
            item.setItemName(rs.getString("item_name"));
            item.setPrice(rs.getBigDecimal("price"));
            item.setStockQuantity(rs.getInt("stock_quantity"));
            item.setCategory(rs.getString("category"));
            return item;
        },
        minPrice, // 1st ?
        maxPrice, // 2nd ?
        minQuantity, // 3rd ?
        category // 4th ?
        );
    }
    
    // --- METHOD 2: DISTANCE FILTERING (Haversine Formula) ---
    public List<NearbyShopItem> getNearbyItems(double userLat, double userLon, int radiusKm) {
        
        // Haversine Formula: Calculates distance in kilometers (6371)
        String sql = """
            SELECT
                s.name AS shop_name,
                s.latitude,
                s.longitude,
                i.name AS item_name,
                i.price,
                i.stock_quantity,
                (
                    6371 * acos(
                        cos(radians(?)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(?)) +
                        sin(radians(?)) * sin(radians(s.latitude))
                    )
                ) AS distance_km
            FROM
                shops s
            JOIN
                items i ON s.id = i.shop_id
            HAVING
                distance_km < ?
            ORDER BY
                distance_km, s.name, i.price
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            NearbyShopItem item = new NearbyShopItem();
            item.setShopName(rs.getString("shop_name"));
            item.setItemName(rs.getString("item_name"));
            item.setPrice(rs.getBigDecimal("price"));
            item.setStockQuantity(rs.getInt("stock_quantity"));
            item.setDistanceKm(rs.getDouble("distance_km"));
            return item;
        },
        // Parameters passed to the '?' placeholders in order:
        userLat, // 1st ?
        userLon, // 2nd ?
        userLat, // 3rd ?
        radiusKm // 4th ?
        );
    }
}