package com.livemart.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.livemart.backend.model.UserLocation;
import java.util.List;

public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {
    List<UserLocation> findByUserId(Long userId);
}

