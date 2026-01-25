package com.fooddelivery.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    private String orderId;
    private String customerId;
    private String type; // SUCCESS, FAILED
    private Double amount;
    private String paymentId;
    private Long timestamp;
}
