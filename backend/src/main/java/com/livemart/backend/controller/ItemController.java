package com.livemart.backend.controller;

import com.livemart.backend.dto.ItemDTO;
import com.livemart.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.livemart.backend.model.Item;
import com.livemart.backend.repository.ItemRepository;
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
    @GetMapping("/{itemId}")
public ResponseEntity<Item> getItem(@PathVariable Long itemId) {
    try {
        Item item = itemService.getItemById(itemId);
        return ResponseEntity.ok(item);
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}


}
