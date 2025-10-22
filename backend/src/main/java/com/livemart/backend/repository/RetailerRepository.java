package com.livemart.backend.repository;

import com.livemart.backend.model.*;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RetailerRepository extends JpaRepository<Retailer, Long> {
    
}
