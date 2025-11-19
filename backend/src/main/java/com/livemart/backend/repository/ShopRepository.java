package com.livemart.backend.repository;

import com.livemart.backend.model.Shop; // Updated Import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    // JpaSpecificationExecutor allows us to build dynamic queries for smart filtering.
}