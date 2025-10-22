package com.livemart.backend.repository;

import com.livemart.backend.model.*;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByCategoryId(Long categoryId);
    List<Item> findByRetailerId(Long retailerId);
    List<Item> findByWholesalerSourceId(Long wholesaleId); // For proxy
}
