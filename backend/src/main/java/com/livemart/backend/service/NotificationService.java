package com.livemart.backend.service;

import com.livemart.backend.model.Order;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    // ------------- SEND EMAIL WITH OPTIONAL CALENDAR INVITE -------------
    public void sendEmailWithCalendarInvite(String to, String subject, String body, String icsContent) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            if (icsContent != null) {
                helper.addAttachment(
                        "invite.ics",
                        new ByteArrayResource(icsContent.getBytes()),
                        "text/calendar"
                );
            }

            mailSender.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ------------- ORDER CONFIRMATION EMAIL -------------
    public void sendCustomOrderEmail(Order order) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);

            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Your LiveMart Order #" + order.getId());

            StringBuilder html = new StringBuilder();
            html.append("<h2>Your Order is Confirmed!</h2>");
            html.append("<p>Order ID: ").append(order.getId()).append("</p>");
            html.append("<p>Status: ").append(order.getStatus()).append("</p>");

            html.append("<p>Items:</p><ul>");
            order.getOrderItems().forEach(item ->
                    html.append("<li>")
                            .append(item.getItem().getName())
                            .append(" x ")
                            .append(item.getQuantity())
                            .append(" (₹").append(item.getPrice()).append(")")
                            .append("</li>")
            );
            html.append("</ul>");

            helper.setText(html.toString(), true);
            mailSender.send(msg);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ------------- ORDER CANCELLATION EMAIL -------------
    public void sendOrderCancellationEmail(Order order) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);

            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Order #" + order.getId() + " Cancelled");

            String html =
                    "<h2 style='color:red;'>Order Cancelled</h2>" +
                    "<p>Your order <b># " + order.getId() + "</b> was cancelled successfully.</p>";

            helper.setText(html, true);
            mailSender.send(msg);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ------------- OPTIONAL SMS (DUMMY) -------------
    public void sendSMS(String phone, String message) {
        System.out.println("SMS not enabled. Would send to " + phone + ": " + message);
    }
}
