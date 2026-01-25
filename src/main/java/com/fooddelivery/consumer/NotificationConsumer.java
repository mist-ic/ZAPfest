package com.fooddelivery.consumer;

import com.fooddelivery.event.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final JavaMailSender mailSender;

    @KafkaListener(topics = "notifications", groupId = "zapfest-notifications")
    public void consume(NotificationEvent event) {
        log.info("sending notification to {}: {}", event.getEmail(), event.getType());
        
        if (event.getEmail() == null) return;
        
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(event.getEmail());
            msg.setSubject(event.getTitle());
            msg.setText(event.getMessage());
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("email failed: {}", e.getMessage());
        }
    }
}
