package com.livemart.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> orderItems;

    private LocalDateTime orderDate;
    private String status; // PLACED, SHIPPED, DELIVERED, CANCELLED
    private String deliveryAddress;

    private boolean offlineOrder; // true if offline order
    private LocalDateTime offlineOrderDate; // scheduled offline order date if offlineOrder=true

    // NEW FIELD: "DELIVERY" or "COLLECT"
    private String orderType;

    // Getters and setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }
    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public boolean isOfflineOrder() {
        return offlineOrder;
    }
    public void setOfflineOrder(boolean offlineOrder) {
        this.offlineOrder = offlineOrder;
    }

    public LocalDateTime getOfflineOrderDate() {
        return offlineOrderDate;
    }
    public void setOfflineOrderDate(LocalDateTime offlineOrderDate) {
        this.offlineOrderDate = offlineOrderDate;
    }

    // --- NEW: orderType ---
    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
}
