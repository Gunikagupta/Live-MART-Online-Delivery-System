package com.livemart.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {

    public Long id;
    public LocalDateTime createdAt;
    public String status;
    public String deliveryAddress;
    public boolean offlineOrder;
    public LocalDateTime offlineOrderDate;

    public double total;      // <-- required
    public String orderType;  // <-- required

    public List<ItemDTO> items;

    public static class ItemDTO {
        public Long itemId;
        public String name;
        public int qty;
        public double price;
    }
}
