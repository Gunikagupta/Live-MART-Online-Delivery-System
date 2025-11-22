package com.livemart.backend.controller;


import com.livemart.backend.model.UserLocation;
import com.livemart.backend.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    private UserLocationRepository locationRepository;

    @PostMapping
    public ResponseEntity<?> saveLocation(@RequestBody UserLocation location) {
        locationRepository.save(location);
        return ResponseEntity.ok("Location saved successfully");
    }

    @GetMapping("/{userId}")
public ResponseEntity<UserLocation> getUserLocation(@PathVariable Long userId) {
    return locationRepository.findByUserId(userId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}

}
