package com.livemart.backend.model;

import jakarta.persistence.*;

@Entity
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String item;
    private int quantity;
    private String status;
    private String orderDate;

    @ManyToOne
    @JoinColumn(name = "retailer_id")
    private Retailer retailer;

    // Getters & Setters
    public Long getId() {
        return id;
    }   
    public void setId(Long id) {
        this.id = id;
    }
    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getItem() {
        return item;
    }
    public void setItem(String item) {
        this.item = item;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }




    public Retailer getRetailer() {
        return retailer;
    }
    public void setRetailer(Retailer retailer) {
        this.retailer = retailer;
    }
    
}
