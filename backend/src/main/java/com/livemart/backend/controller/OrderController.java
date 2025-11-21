package com.livemart.backend.controller;

import com.livemart.backend.dto.OrderResponseDTO;
import com.livemart.backend.model.Order;
import com.livemart.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Place a new order.
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        try {
            Order savedOrder = orderService.placeOrder(order);
            OrderResponseDTO dto = orderService.convertToDTO(savedOrder);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Order placement failed: " + e.getMessage());
        }
    }

    /**
     * Get all orders for a user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        List<OrderResponseDTO> dtos = orders.stream()
                .map(orderService::convertToDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * Update order status.
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(orderService.convertToDTO(updatedOrder));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to update order status: " + e.getMessage());
        }
    }

    /**
     * Get order by ID.
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        Optional<Order> order = orderService.getOrderById(orderId);
        return order
                .map(o -> ResponseEntity.ok(orderService.convertToDTO(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
