package com.livemart.backend.repository;

import com.livemart.backend.model.RetailerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RetailerOrderRepository extends JpaRepository<RetailerOrder, Long> {
    List<RetailerOrder> findByRetailerId(Long retailerId);
}
