package com.livemart.backend.service;

import com.livemart.backend.model.User;
import com.livemart.backend.model.Item;
import com.livemart.backend.model.Order;
import com.livemart.backend.model.OrderItem;
import com.livemart.backend.repository.ItemRepository;
import com.livemart.backend.repository.OrderRepository;
import com.livemart.backend.repository.UserRepository;
import com.livemart.backend.util.CalendarInviteUtils;
import jakarta.transaction.Transactional;
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
    NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Places a new order, updates stock, and saves order with items.
     */
    @Transactional
    public Order placeOrder(Order order) {
        Order savedOrder = orderRepository.save(order);
        User user = userRepository.findById(order.getUser().getId())
                  .orElseThrow(() -> new RuntimeException("User not found"));
    order.setUser(user);
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
        // Send simple order placed notification
        notificationService.sendEmailWithCalendarInvite(
            order.getUser().getEmail(),
            "Order Placed Successfully",
            "Thank you for your order! Your order ID is " + order.getId(),
            null
        );
    }

        // Update stock automatically
        for (OrderItem oi : order.getOrderItems()) {
            Item item = oi.getItem();
            int newStock = item.getStock() - oi.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName());
            }
            item.setStock(newStock);
            itemRepository.save(item);
            oi.setPrice(item.getPrice());
            oi.setOrder(order);
        }
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        // Save order along with order items cascade
        return orderRepository.save(order);
    }

    /**
     * Fetch all orders placed by a specific user.
     */
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getUser() != null && order.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    /**
     * Update the status of an existing order.
     */
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

    /**
     * Get order by Id.
     */
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
}
