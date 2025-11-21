package com.livemart.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmailWithCalendarInvite(String to, String subject, String body, String icsContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            if (icsContent != null) {
                helper.addAttachment("invite.ics", new ByteArrayResource(icsContent.getBytes()), "text/calendar");
            }

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
