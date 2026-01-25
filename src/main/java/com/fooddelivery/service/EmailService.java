package com.fooddelivery.service;

import com.fooddelivery.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@fooddelivery.com}")
    private String from;

    @Async
    public void sendOrderConfirmation(String to, Order order) {
        send(to, "Order Confirmed - #" + order.getId(),
                "Your order has been placed!\n\nOrder ID: " + order.getId() +
                        "\nTotal: ₹" + order.getTotalAmount() +
                        "\n\nThank you for ordering!");
    }

    @Async
    public void sendStatusUpdate(String to, Order order) {
        send(to, "Order Update - #" + order.getId(),
                "Your order status has been updated.\n\nOrder ID: " + order.getId() +
                        "\nStatus: " + order.getStatus());
    }

    @Async
    public void sendDeliveryComplete(String to, Order order) {
        send(to, "Order Delivered - #" + order.getId(),
                "Your order has been delivered!\n\nOrder ID: " + order.getId() +
                        "\n\nEnjoy your meal!");
    }

    private void send(String to, String subject, String text) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
        } catch (Exception e) {
            // log but don't fail
        }
    }
}
