package com.fooddelivery.service;

import com.fooddelivery.event.NotificationEvent;
import com.fooddelivery.event.OrderEvent;
import com.fooddelivery.event.PaymentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderEvent(OrderEvent event) {
        kafkaTemplate.send("orders", event.getOrderId(), event);
        log.info("order event: {} - {}", event.getType(), event.getOrderId());
    }

    public void publishPaymentEvent(PaymentEvent event) {
        kafkaTemplate.send("payments", event.getOrderId(), event);
        log.info("payment event: {} - {}", event.getType(), event.getOrderId());
    }

    public void publishNotification(NotificationEvent event) {
        kafkaTemplate.send("notifications", event.getUserId(), event);
        log.info("notification: {} - {}", event.getType(), event.getUserId());
    }
}
