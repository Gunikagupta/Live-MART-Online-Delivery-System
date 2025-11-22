package com.livemart.backend.service;

import com.livemart.backend.model.User;
import com.livemart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    // Basic authentication method
    public User authenticate(String email, String password) {
        return userRepo.findByEmail(email)
                .filter(u -> password.equals(u.getPassword()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
    // Add your other methods as needed
}

