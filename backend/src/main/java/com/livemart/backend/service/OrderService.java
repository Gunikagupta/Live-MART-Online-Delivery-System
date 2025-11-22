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

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            ItemRepository itemRepository,
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // ----------------------------------------------------
    // PLACE ORDER
    // ----------------------------------------------------
    @Transactional
    public Order placeOrder(Order order) {

        // Load user from DB
        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        // Process items
        for (OrderItem oi : order.getOrderItems()) {

            Item item = itemRepository.findById(oi.getItem().getId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            // Stock check
            if (item.getStock() < oi.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + item.getName());
            }

            item.setStock(item.getStock() - oi.getQuantity());
            itemRepository.save(item);

            oi.setItem(item);
            oi.setPrice(item.getPrice());   // snapshot price
            oi.setOrder(order);
        }

        Order saved = orderRepository.save(order);

        // ------------ Send Email Notification ------------
        if (order.isOfflineOrder()) {
            String ics = CalendarInviteUtils.generateICS(
                    "Offline Order Pickup",
                    "Pickup your order from: " + order.getDeliveryAddress(),
                    order.getDeliveryAddress(),
                    order.getOfflineOrderDate(),
                    order.getOfflineOrderDate().plusHours(1)
            );

            notificationService.sendEmailWithCalendarInvite(
                    user.getEmail(),
                    "Your Offline Order Pickup Reminder",
                    "Please check the attached calendar invite.",
                    ics
            );
        } else {
            notificationService.sendCustomOrderEmail(saved);
        }

        return saved;
    }

    // ----------------------------------------------------
    // GET ORDERS BY USER
    // ----------------------------------------------------
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // ----------------------------------------------------
    // UPDATE ORDER STATUS
    // ----------------------------------------------------
    public Order updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepository.save(order);
    }

    // ----------------------------------------------------
    // CANCEL ORDER (NEW)
    // ----------------------------------------------------
    public Order cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Delivered orders cannot be cancelled.");
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    // ----------------------------------------------------
    // CONVERT ORDER TO RESPONSE DTO
    // ----------------------------------------------------
    public OrderResponseDTO convertToDTO(Order order) {

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.id = order.getId();
        dto.createdAt = order.getOrderDate();
        dto.status = order.getStatus();
        dto.deliveryAddress = order.getDeliveryAddress();
        dto.orderType = order.getOrderType();
        dto.offlineOrder = order.isOfflineOrder();
        dto.offlineOrderDate = order.getOfflineOrderDate();

        dto.items = order.getOrderItems().stream().map(oi -> {
            OrderResponseDTO.ItemDTO itemDTO = new OrderResponseDTO.ItemDTO();
            itemDTO.itemId = oi.getItem().getId();
            itemDTO.name = oi.getItem().getName();
            itemDTO.qty = oi.getQuantity();
            itemDTO.price = oi.getPrice();
            return itemDTO;
        }).collect(Collectors.toList());

        dto.total = order.getOrderItems().stream()
                .mapToDouble(oi -> oi.getPrice() * oi.getQuantity())
                .sum();

        return dto;
    }

    // ----------------------------------------------------
    // GET ORDER BY ID
    // ----------------------------------------------------
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
}
