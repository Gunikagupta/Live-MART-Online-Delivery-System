package com.livemart.backend.service;

import com.livemart.backend.model.UserLocation;
import com.livemart.backend.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserLocationService {

    @Autowired
    private UserLocationRepository userLocationRepository;

    public void saveUserLocation(Long userId, Double latitude, Double longitude) {
        UserLocation userLocation = userLocationRepository.findByUserId(userId)
                .orElse(new UserLocation());
        userLocation.setUserId(userId);
        userLocation.setLatitude(latitude);
        userLocation.setLongitude(longitude);
        userLocation.setTimestamp(LocalDateTime.now());
        userLocationRepository.save(userLocation);
    }
}

