package com.fooddelivery.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String userId;
    private String email;
    private String type; // ORDER_PLACED, ORDER_CONFIRMED, PAYMENT_SUCCESS, DELIVERED
    private String title;
    private String message;
    private Long timestamp;
}
