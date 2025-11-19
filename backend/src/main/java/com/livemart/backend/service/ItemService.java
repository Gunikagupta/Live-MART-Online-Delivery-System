package com.livemart.backend.service;

import com.livemart.backend.dto.ItemDTO;
import com.livemart.backend.model.Item;
import com.livemart.backend.repository.ItemRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    // Fetch category-wise items
    public List<ItemDTO> getItemsByCategory(Long categoryId) {

        List<Item> items = itemRepository.findByCategoryId(categoryId);

        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert Item -> ItemDTO
    private ItemDTO convertToDTO(Item item) {

        ItemDTO dto = new ItemDTO();

        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());
        dto.setStock(item.getStock());
        dto.setImageUrl(item.getImageUrl());
        dto.setAvailableDate(item.getAvailableDate());

        String status;

        // Stock Status Logic (YOUR requirements)
        if (item.getStock() > 5) {
            status = "IN STOCK";
        } else if (item.getStock() > 0) {
            status = "LOW STOCK";
        } else if (item.getAvailableDate() != null) {
            status = "AVAILABLE ON " + item.getAvailableDate();
        } else if (item.getWholesalerSource() != null) {  // PROXY logic
            status = "AVAILABLE VIA WHOLESALER";
        } else {
            status = "OUT OF STOCK";
        }

        dto.setStockStatus(status);

        // Proxy flag
        dto.setProxyAvailable(item.getWholesalerSource() != null);

        return dto;
    }
}
