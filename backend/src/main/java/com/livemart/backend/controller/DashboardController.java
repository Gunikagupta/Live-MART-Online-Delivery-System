package com.livemart.backend.controller;

import com.livemart.backend.model.*;
import com.livemart.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private ItemRepository itemRepo;
    @Autowired private RetailerRepository retailerRepo;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }
@GetMapping("/categories/{categoryId}/items")
public List<Item> getItemsByCategory(@PathVariable Long categoryId) {
    return itemRepo.findByCategoryId(categoryId);
}

@GetMapping("/retailers/{retailerId}/proxy-items")
public List<Item> getProxyItems(@PathVariable Long retailerId) {
    // Return all wholesaler items shown by this retailer via proxy
    return itemRepo.findByWholesalerSourceId(retailerId);
}

@GetMapping("/items/{itemId}")
public Item getItemDetails(@PathVariable Long itemId) {
    return itemRepo.findById(itemId).orElse(null);
}
}
