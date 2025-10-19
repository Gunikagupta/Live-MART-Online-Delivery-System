package com.livemart.backend.service;

import com.livemart.backend.model.OtpVerification;
import com.livemart.backend.repository.OtpVerificationRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Value("${twilio.account_sid}")
    private String accountSid;

    @Value("${twilio.auth_token}")
    private String authToken;

    @Value("${twilio.phone_number}")
    private String twilioNumber;

    private final OtpVerificationRepository otpRepo;

    public OtpService(OtpVerificationRepository otpRepo) {
        this.otpRepo = otpRepo;
    }

    public void sendOtp(String phone) {
        Twilio.init(accountSid, authToken);
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        Message.creator(
                new PhoneNumber(phone),
                new PhoneNumber(twilioNumber),
                "Your LiveMart OTP code is: " + otp
        ).create();

        OtpVerification otpEntry = new OtpVerification();
        otpEntry.setPhone(phone);
        otpEntry.setOtpCode(otp);
        otpEntry.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(otpEntry);
    }

    public boolean verifyOtp(String phone, String code) {
        Optional<OtpVerification> otpOpt =
            otpRepo.findTopByPhoneAndOtpCodeAndVerifiedFalseOrderByExpiresAtDesc(phone, code);

        if (otpOpt.isPresent() && otpOpt.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            OtpVerification otp = otpOpt.get();
            otp.setVerified(true);
            otpRepo.save(otp);
            return true;
        }
        return false;
    }
}
