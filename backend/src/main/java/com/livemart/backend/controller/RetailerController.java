    package com.livemart.backend.controller;

    import com.livemart.backend.model.RetailerInventory;
    import com.livemart.backend.model.RetailerOrder;
    import com.livemart.backend.repository.RetailerInventoryRepository;
    import com.livemart.backend.repository.RetailerOrderRepository;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/retailer")
@CrossOrigin(origins = "http://localhost:3000")
    public class RetailerController {

        private final RetailerInventoryRepository inventoryRepo;
        private final RetailerOrderRepository orderRepo;

        public RetailerController(RetailerInventoryRepository inventoryRepo,
                                RetailerOrderRepository orderRepo) {
            this.inventoryRepo = inventoryRepo;
            this.orderRepo = orderRepo;
        }

        @GetMapping("/{id}/inventory")
        public List<RetailerInventory> getInventory(@PathVariable Long id) {
            return inventoryRepo.findByRetailerId(id);
        }

        @GetMapping("/{id}/orders")
        public List<RetailerOrder> getOrders(@PathVariable Long id) {
            return orderRepo.findByRetailerId(id);
        }

        // update stock
        @PutMapping("/{id}/inventory/{itemId}/stock")
        public RetailerInventory updateStock(@PathVariable Long itemId, @RequestBody int newStock) {
            RetailerInventory inv = inventoryRepo.findById(itemId).orElseThrow();
            inv.setStock(newStock);
            return inventoryRepo.save(inv);
        }

        // update order status
        @PutMapping("/orders/{orderId}/status")
        public RetailerOrder updateOrderStatus(@PathVariable Long orderId, @RequestBody String status) {
            RetailerOrder order = orderRepo.findById(orderId).orElseThrow();
            order.setStatus(status);
            return orderRepo.save(order);
        }
    }
