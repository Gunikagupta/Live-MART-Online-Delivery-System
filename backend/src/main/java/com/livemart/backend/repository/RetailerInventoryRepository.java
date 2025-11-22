package com.livemart.backend.repository;

import com.livemart.backend.model.RetailerInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RetailerInventoryRepository extends JpaRepository<RetailerInventory, Long> {
    List<RetailerInventory> findByRetailerId(Long retailerId);
}
