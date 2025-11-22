package com.livemart.backend.repository;

import com.livemart.backend.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByRetailerId(Long retailerId);
}
