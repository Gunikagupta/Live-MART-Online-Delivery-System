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
    // --- CUSTOM EMAIL WITH ORDER DETAILS ---
public void sendCustomOrderEmail(com.livemart.backend.model.Order order) {
    try {
        MimeMessage messageObj = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(messageObj, true);
        helper.setTo(order.getUser().getEmail());
        helper.setSubject("Your LiveMart Order #" + order.getId());

        StringBuilder html = new StringBuilder();
        html.append("<div style='font-family:sans-serif;'>")
            .append("<h2>Order Confirmation</h2>");
        html.append("<p>Hello <b>")
            .append(order.getUser().getName())
            .append("</b>,<br>Thank you for your order!</p>");
        html.append("<b>Order ID:</b> ").append(order.getId()).append("<br>");
        html.append("<b>Status:</b> ").append(order.getStatus()).append("<br>");
        html.append("<b>Order Method:</b> ").append(order.getOrderType()).append("<br>");
        if ("DELIVERY".equalsIgnoreCase(order.getOrderType())) {
            html.append("<b>Delivery Address:</b> ").append(order.getDeliveryAddress()).append("<br>");
        } else {
            html.append("<b>Pickup:</b> ").append("You have chosen to collect your order from the shop. Bring your order ID.<br>");
        }
        html.append("<b>Date:</b> ").append(order.getOrderDate()).append("<br><br>");
        html.append("<b>Items:</b><ul>");
        for (com.livemart.backend.model.OrderItem item : order.getOrderItems()) {
            html.append("<li>")
                .append(item.getItem().getName())
                .append(" &times; ").append(item.getQuantity())
                .append(" (₹").append(item.getPrice()).append(" each)")
                .append("</li>");
        }
        html.append("</ul><br>");
        html.append("<b>Total:</b> ₹")
            .append(order.getOrderItems().stream().mapToDouble(oi -> oi.getPrice() * oi.getQuantity()).sum())
            .append("<br><br>");
        html.append("We’ll notify you when your order status changes.<br><br>");
        html.append("Thank you for shopping with LiveMart!");
        html.append("</div>");

        helper.setText(html.toString(), true); // true = HTML

        mailSender.send(messageObj);
    } catch (Exception e) {
        e.printStackTrace();
    }
}

}
