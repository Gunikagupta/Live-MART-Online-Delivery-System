package com.livemart.backend.controller;

import com.livemart.backend.dto.ItemDTO;
import com.livemart.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<ItemDTO>> getItemsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemsByCategory(id));
    }
}
