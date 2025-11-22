package com.livemart.backend.controller;

import com.livemart.backend.service.OtpService;
import com.livemart.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.livemart.backend.dto.LoginRequest;
import com.livemart.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.livemart.backend.service.UserLocationService;
import com.livemart.backend.service.UserService;

import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.http.javanet.NetHttpTransport;
import java.util.Collections;




@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserLocationService userLocationService;

    // ----- SEND OTP -----
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        otpService.sendOtp(phone);
        return ResponseEntity.ok("OTP sent successfully to " + phone);
    }

    // ----- VERIFY OTP -----
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String otp = request.get("otp");
        boolean valid = otpService.verifyOtp(phone, otp);
        if (valid) return ResponseEntity.ok("OTP verified successfully");
        else return ResponseEntity.status(401).body("Invalid or expired OTP");
    }

    // ----- REGISTER -----
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        userRepo.save(user);
        return ResponseEntity.ok("Registration successful");
    }

    // ----- LOGIN WITH LOCATION -----
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        // Authenticate logic here
        User user = userService.authenticate(request.getEmail(), request.getPassword());

        // Save detected location if present
        if (request.getLatitude() != null && request.getLongitude() != null) {
            userLocationService.saveUserLocation(user.getId(), request.getLatitude(), request.getLongitude());
        }
        // Your login response (could be user, JWT, etc.)
        return ResponseEntity.ok(user);
    }

    // ----- GOOGLE LOGIN -----
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList("your-client-id.apps.googleusercontent.com"))
                .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload googlePayload = idToken.getPayload();
                String email = googlePayload.getEmail();
                String name = (String) googlePayload.get("name");

                Optional<User> userOpt = userRepo.findByEmail(email);
                User user;
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                } else {
                    user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setRole("CUSTOMER");
                    userRepo.save(user);
                }
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).body("Invalid Google ID token");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google login error");
        }
    }

    // Uncomment and adapt Facebook login as needed
}
