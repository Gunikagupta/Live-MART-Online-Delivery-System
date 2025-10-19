package com.livemart.backend.controller;

import com.livemart.backend.service.OtpService;
import com.livemart.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.livemart.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;



import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.http.javanet.NetHttpTransport;
import java.util.Collections;



@CrossOrigin(origins = "http://localhost:3000")  
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OtpService otpService;

    // ---------- SEND OTP ----------
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        otpService.sendOtp(phone);
        return ResponseEntity.ok("OTP sent successfully to " + phone);
    }

    // ---------- VERIFY OTP ----------
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String otp = request.get("otp");
        boolean valid = otpService.verifyOtp(phone, otp);
        if (valid) return ResponseEntity.ok("OTP verified successfully");
        else return ResponseEntity.status(401).body("Invalid or expired OTP");
    }

    // ---------- REGISTER ----------
    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {
    System.out.println("Received registration for email: " + user.getEmail());
    try {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            System.out.println("Email already registered: " + user.getEmail());
            return ResponseEntity.badRequest().body("Email already registered");
        }
        userRepo.save(user);
        System.out.println("User registered successfully: " + user.getEmail());
        return ResponseEntity.ok("Registration successful");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Registration failed due to server error.");
    }
}



    // ---------- LOGIN ----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User credentials) {
        Optional<User> userOpt = userRepo.findByEmail(credentials.getEmail());
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(credentials.getPassword())) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
    @PostMapping("/google-login")
public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
    String token = payload.get("token");
    try {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
            .setAudience(Collections.singletonList("982520762305-0hqpoq34bmctonak7jn9no4n7djd48s4.apps.googleusercontent.com"))
            .build();

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken != null) {
            GoogleIdToken.Payload googlePayload = idToken.getPayload();
            String email = googlePayload.getEmail();
            String name = (String) googlePayload.get("name");

            // find user or create user logic:
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
            // you may want to return a session or JWT
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(401).body("Invalid Google ID token");
        }
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google login error");
    }
}
// @PostMapping("/facebook-login")
// public ResponseEntity<?> facebookLogin(@RequestBody Map<String, String> payload) {
//     String accessToken = payload.get("accessToken");
//     try {
//         // Validate token with Facebook
//         String uri = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
//         RestTemplate restTemplate = new RestTemplate();
//         Map response = restTemplate.getForObject(uri, Map.class);

//         String email = (String) response.get("email");
//         String name = (String) response.get("name");
//         // Find or create user logic as with Google above
//         Optional<User> userOpt = userRepo.findByEmail(email);
//         User user;
//         if (userOpt.isPresent()) {
//             user = userOpt.get();
//         } else {
//             user = new User();
//             user.setEmail(email);
//             user.setName(name);
//             user.setRole("CUSTOMER");
//             userRepo.save(user);
//         }
//         // you may want to return a session or JWT
//         return ResponseEntity.ok("Login successful!");
//     } catch (Exception e) {
//         e.printStackTrace();
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Facebook login error");
//     }
// }


}
