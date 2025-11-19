package com.livemart.backend.controller;

import com.livemart.backend.model.Category;
import com.livemart.backend.model.Item;
import com.livemart.backend.repository.CategoryRepository;
import com.livemart.backend.repository.ItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private ItemRepository itemRepo;

    // Get category details by ID
    @GetMapping("/{id}")
    public Category getCategory(@PathVariable Long id) {
        return categoryRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    // Get items that belong to a category
    @GetMapping("/{id}/items")
    public List<Item> getItemsByCategory(@PathVariable Long id) {
        return itemRepo.findByCategoryId(id);
    }
}
