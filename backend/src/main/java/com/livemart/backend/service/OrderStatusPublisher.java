package com.livemart.backend.service;

import com.livemart.backend.model.Order;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderStatusPublisher {
    private final SimpMessagingTemplate template;

    public OrderStatusPublisher(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void sendOrderStatusUpdate(Order order) {
        // e.g. topic: /topic/order-status-USERID
        template.convertAndSend("/topic/order-status-" + order.getUser().getId(), order.getStatus());
    }
}
