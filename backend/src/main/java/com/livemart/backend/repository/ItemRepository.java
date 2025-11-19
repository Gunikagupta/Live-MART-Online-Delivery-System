package com.livemart.backend.repository;

import com.livemart.backend.model.Item;
import com.livemart.backend.model.Retailer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByCategoryId(Long categoryId);

    List<Item> findByRetailerId(Long retailerId);

    // This is the CORRECT one
    List<Item> findByWholesalerSource(Retailer wholesaler);
}
