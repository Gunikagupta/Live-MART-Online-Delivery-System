package com.livemart.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${twilio.account_sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth_token}")
    private String twilioAuthToken;

    @Value("${twilio.phone_number}")
    private String twilioPhoneNumber;

    public void sendSMS(String phone, String message) {
        Twilio.init(twilioAccountSid, twilioAuthToken);
        Message.creator(
                new com.twilio.type.PhoneNumber(phone),
                new com.twilio.type.PhoneNumber(twilioPhoneNumber),
                message
        ).create();
    }

    public void sendEmailWithCalendarInvite(String to, String subject, String body, String icsContent) {
        try {
            MimeMessage messageObj = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(messageObj, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            if (icsContent != null) {
                helper.addAttachment("invite.ics", new ByteArrayResource(icsContent.getBytes()), "text/calendar");
            }

            mailSender.send(messageObj);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
