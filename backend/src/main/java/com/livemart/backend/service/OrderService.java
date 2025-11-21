package com.livemart.backend.service;

import com.livemart.backend.model.User;
import com.livemart.backend.dto.OrderResponseDTO;
import com.livemart.backend.model.Item;
import com.livemart.backend.model.Order;
import com.livemart.backend.model.OrderItem;
import com.livemart.backend.repository.ItemRepository;
import com.livemart.backend.repository.OrderRepository;
import com.livemart.backend.repository.UserRepository;
import com.livemart.backend.util.CalendarInviteUtils;

import org.springframework.transaction.annotation.Transactional;   // <-- FIXED
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Places an order: loads user & items from DB, updates stock, and saves all.
     */
    @Transactional
    public Order placeOrder(Order order) {

        // 1. Load REAL user from DB
        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        // 2. Set initial metadata
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        // 3. Process each order item
        for (OrderItem oi : order.getOrderItems()) {

            // Load item from DB
            Item item = itemRepository.findById(oi.getItem().getId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            // Defensive: backend will NOT accept null stock anymore
            if (item.getStock() == null) {
                throw new RuntimeException("Item stock is NULL for item: " + item.getName());
            }

            // Check & update stock
            int newStock = item.getStock() - oi.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName());
            }

            item.setStock(newStock);
            itemRepository.save(item);

            // Set snapshot values
            oi.setPrice(item.getPrice());
            oi.setItem(item);
            oi.setOrder(order);
        }

        // 4. Save order with all items
        Order saved = orderRepository.save(order);

        // 5. Email notification
        if (order.isOfflineOrder()) {
            String ics = CalendarInviteUtils.generateICS(
                    "Offline Order Pickup",
                    "Your offline order pickup at: " + order.getDeliveryAddress(),
                    order.getDeliveryAddress(),
                    order.getOfflineOrderDate(),
                    order.getOfflineOrderDate().plusHours(1)
            );

            notificationService.sendEmailWithCalendarInvite(
                    user.getEmail(),
                    "Your Offline Order Pickup Reminder",
                    "Please find your order pickup invitation attached.",
                    ics
            );
        } else {
            notificationService.sendEmailWithCalendarInvite(
                    user.getEmail(),
                    "Order Placed Successfully",
                    "Thank you for your order! Your order ID is " + saved.getId(),
                    null
            );
        }

        return saved;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getUser() != null && order.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optOrder = orderRepository.findById(orderId);
        if (optOrder.isEmpty()) {
            throw new RuntimeException("Order not found: " + orderId);
        }
        Order order = optOrder.get();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void reminderForOfflineOrder(Order order) {
        String ics = CalendarInviteUtils.generateICS(
                "Offline Order Pickup",
                "Order at: " + order.getDeliveryAddress(),
                order.getDeliveryAddress(),
                order.getOfflineOrderDate(),
                order.getOfflineOrderDate().plusHours(1)
        );
        notificationService.sendEmailWithCalendarInvite(
                order.getUser().getEmail(),
                "Order Reminder: Scheduled Pickup",
                "Your order is scheduled. See the attached invite.",
                ics
        );
    }
    public OrderResponseDTO convertToDTO(Order order) {
    OrderResponseDTO dto = new OrderResponseDTO();

    dto.id = order.getId();
    dto.createdAt = order.getOrderDate();
    dto.status = order.getStatus();
    dto.deliveryAddress = order.getDeliveryAddress();
    dto.offlineOrder = order.isOfflineOrder();
    dto.offlineOrderDate = order.getOfflineOrderDate();

    dto.items = order.getOrderItems().stream().map(oi -> {
        OrderResponseDTO.ItemDTO i = new OrderResponseDTO.ItemDTO();
        i.itemId = oi.getItem().getId();
        i.name = oi.getItem().getName();
        i.qty = oi.getQuantity();
        i.price = oi.getPrice();
        return i;
    }).toList();

    return dto;
}

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
}
