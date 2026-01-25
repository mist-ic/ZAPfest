package com.fooddelivery.consumer;

import com.fooddelivery.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "orders", groupId = "zapfest-orders")
    public void consume(OrderEvent event) {
        log.info("order update: {} - {}", event.getType(), event.getOrderId());
        
        // push to customer via websocket
        messagingTemplate.convertAndSend("/topic/orders/" + event.getCustomerId(), event);
        
        // push to restaurant
        messagingTemplate.convertAndSend("/topic/restaurant/" + event.getRestaurantId(), event);
    }
}
