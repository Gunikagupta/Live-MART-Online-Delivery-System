package com.livemart.backend.dto;

import java.time.LocalDate;

public class ItemDTO {
    private Long id;
    private String name;
    private Double price;           // wrapper type matches previous compile error (Double)
    private Integer stock;          // wrapper type Integer
    private String imageUrl;
    private LocalDate availableDate;
    private String stockStatus;
    private Boolean proxyAvailable;

    public ItemDTO() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getAvailableDate() {
        return availableDate;
    }
    public void setAvailableDate(LocalDate availableDate) {
        this.availableDate = availableDate;
    }

    public String getStockStatus() {
        return stockStatus;
    }
    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }

    public Boolean getProxyAvailable() {
        return proxyAvailable;
    }
    public void setProxyAvailable(Boolean proxyAvailable) {
        this.proxyAvailable = proxyAvailable;
    }
}
