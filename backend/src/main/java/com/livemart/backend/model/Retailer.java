package com.livemart.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Retailer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean isWholesaler; // true if this retailer is a wholesaler

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isWholesaler() { return isWholesaler; }
    public void setWholesaler(boolean wholesaler) { isWholesaler = wholesaler; }
}
