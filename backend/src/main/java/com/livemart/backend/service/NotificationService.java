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
// ------------- ORDER CONFIRMATION EMAIL (PROFESSIONAL LIVEMART TEMPLATE) -------------
public void sendCustomOrderEmail(Order order) {
    try {
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);

        helper.setTo(order.getUser().getEmail());
        helper.setSubject("Your LiveMart Order #" + order.getId());

        double total = order.getOrderItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        StringBuilder itemsTable = new StringBuilder();
        order.getOrderItems().forEach(oi -> {
            itemsTable.append(
                "<tr style='border-bottom:1px solid #fce7f3;'>"
              + "  <td style='padding:10px;'>" + oi.getItem().getName() + "</td>"
              + "  <td style='padding:10px; text-align:center;'>" + oi.getQuantity() + "</td>"
              + "  <td style='padding:10px; text-align:right;'>₹" + oi.getPrice() + "</td>"
              + "</tr>"
            );
        });

        String html =
        "<div style='font-family:Arial, sans-serif; max-width:700px; margin:auto; "
      + "border:1px solid #f2d0d5; border-radius:12px; overflow:hidden;'>"

        // HEADER
      + "<div style='background: linear-gradient(to right, #7f1d1d, #b91c1c, #f472b6); "
      + "padding:20px; color:white;'>"
      + "  <h1 style='margin:0; font-size:26px; font-weight:800;'>LiveMart</h1>"
      + "  <p style='margin:4px 0 0; font-size:14px;'>Your Order Has Been Confirmed</p>"
      + "</div>"

      + "<div style='padding:25px;'>"

        // Greeting
      + "<h2 style='margin:0 0 10px; color:#7f1d1d;'>Hello " + order.getUser().getName() + ",</h2>"
      + "<p style='font-size:15px; color:#444;'>Thank you for shopping with <b>LiveMart</b>. "
      + "Below are your order details:</p>"

        // Order details table
      + "<table style='width:100%; margin-top:20px; font-size:14px;'>"
      + "  <tr><td><b>Order ID:</b></td><td>#" + order.getId() + "</td></tr>"
      + "  <tr><td><b>Order Date:</b></td><td>" + order.getOrderDate() + "</td></tr>"
      + "  <tr><td><b>Status:</b></td>"
      + "      <td style='color:#b91c1c; font-weight:bold;'>" + order.getStatus() + "</td></tr>"
      + "</table>"

      + "<hr style='margin:25px 0; border:none; border-top:1px solid #f2d0d5;'>"

        // Items section
      + "<h3 style='color:#7f1d1d; margin-bottom:10px;'>Items in Your Order</h3>"
      + "<table style='width:100%; border-collapse:collapse; font-size:14px;'>"
      + "  <thead>"
      + "    <tr style='background:#fdf2f8; color:#7f1d1d;'>"
      + "      <th style='padding:10px; text-align:left;'>Item</th>"
      + "      <th style='padding:10px; text-align:center;'>Qty</th>"
      + "      <th style='padding:10px; text-align:right;'>Price</th>"
      + "    </tr>"
      + "  </thead>"
      + "  <tbody>"
      +        itemsTable.toString()
      + "  </tbody>"
      + "</table>"

        // Total
      + "<div style='margin-top:20px; text-align:right; font-size:16px;'>"
      + "  <p style='margin:6px 0;'><b>Subtotal:</b> ₹" + total + "</p>"
      + "  <p style='margin:6px 0;'><b>Delivery Fee:</b> ₹0.00</p>"
      + "  <p style='margin:6px 0; font-size:18px; color:#7f1d1d;'>"
      + "     <b>Total:</b> ₹" + total + "</p>"
      + "</div>"

      + "<hr style='margin:25px 0; border:none; border-top:1px solid #f2d0d5;'>"

        // Delivery Address
      + "<h3 style='color:#7f1d1d;'>Delivery Address</h3>"
      + "<p style='font-size:14px; color:#444; line-height:1.6;'>"
      +      order.getDeliveryAddress()
      + "</p>"

      + "<div style='margin-top:25px; font-size:14px; color:#444;'>"
      + "<p>We hope you enjoy shopping with us!</p>"
      + "<p style='font-weight:bold; color:#7f1d1d;'>Team LiveMart</p>"
      + "</div>"

      + "</div>"

        // FOOTER
      + "<div style='background:#fdf2f8; padding:15px; text-align:center; font-size:13px; color:#7f1d1d;'>"
      + "  Download the LiveMart App<br><br>"
      + "  <img src='https://i.imgur.com/3aWZl9i.png' alt='App Store' height='40' style='margin-right:10px;'>"
      + "  <img src='https://i.imgur.com/X5qOJ1L.png' alt='Google Play' height='40'>"
      + "</div>"

      + "</div>";

        helper.setText(html, true);
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
