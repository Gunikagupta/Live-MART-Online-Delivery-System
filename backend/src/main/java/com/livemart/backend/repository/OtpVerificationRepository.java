package com.livemart.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.livemart.backend.model.OtpVerification;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByPhoneAndOtpCodeAndVerifiedFalseOrderByExpiresAtDesc(String phone, String otpCode);
}

