package com.fooddelivery.service;

import com.fooddelivery.event.NotificationEvent;
import com.fooddelivery.event.OrderEvent;
import com.fooddelivery.event.PaymentEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishOrderEvent(OrderEvent event) {
        try {
            kafkaTemplate.send("orders", event.getOrderId(), event);
            log.info("order event: {} - {}", event.getType(), event.getOrderId());
        } catch (Exception e) {
            log.warn("kafka unavailable, skipping event: {}", e.getMessage());
        }
    }

    public void publishPaymentEvent(PaymentEvent event) {
        try {
            kafkaTemplate.send("payments", event.getOrderId(), event);
            log.info("payment event: {} - {}", event.getType(), event.getOrderId());
        } catch (Exception e) {
            log.warn("kafka unavailable, skipping event: {}", e.getMessage());
        }
    }

    public void publishNotification(NotificationEvent event) {
        try {
            kafkaTemplate.send("notifications", event.getUserId(), event);
            log.info("notification: {} - {}", event.getType(), event.getUserId());
        } catch (Exception e) {
            log.warn("kafka unavailable, skipping event: {}", e.getMessage());
        }
    }
}
