package com.livemart.backend.repository;

import com.livemart.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByRetailerId(Long retailerId);
}
