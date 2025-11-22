package com.livemart.backend.model;

import jakarta.persistence.*;

@Entity
public class RetailerInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long retailerId;
    private String name;
    private int price;
    private int stock;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRetailerId() { return retailerId; }
    public void setRetailerId(Long retailerId) { this.retailerId = retailerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}
