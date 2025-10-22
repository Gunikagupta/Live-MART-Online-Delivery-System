package com.livemart.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String imageUrl;
    private double price;
    private int stock;
    private LocalDate availableDate;

    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name="retailer_id")
    private Retailer retailer;

    @ManyToOne
    @JoinColumn(name="source_wholesaler_id", nullable = true)
    private Retailer wholesalerSource; // For proxy

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Retailer getRetailer() { return retailer; }
    public void setRetailer(Retailer retailer) { this.retailer = retailer; }
    public Retailer getWholesalerSource() { return wholesalerSource; }
    public void setWholesalerSource(Retailer wholesalerSource) { this.wholesalerSource = wholesalerSource; }
}
