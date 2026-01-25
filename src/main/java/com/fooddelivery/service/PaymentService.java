package com.fooddelivery.service;

import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.enums.PaymentStatus;
import com.fooddelivery.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@Slf4j
@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final String keyId;
    private final String keySecret;
    private RazorpayClient razorpayClient;

    public PaymentService(OrderRepository orderRepository,
                          OrderService orderService,
                          @Value("${app.razorpay.key-id}") String keyId,
                          @Value("${app.razorpay.key-secret}") String keySecret) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.keyId = keyId;
        this.keySecret = keySecret;
        try {
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            log.warn("Razorpay client init failed - running in mock mode");
        }
    }

    public Map<String, Object> createPaymentOrder(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getCustomerId().equals(userId)) {
            throw new BadRequestException("Not your order");
        }

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Order already paid");
        }

        try {
            if (razorpayClient != null) {
                JSONObject options = new JSONObject();
                options.put("amount", (int) (order.getTotalAmount() * 100));
                options.put("currency", "INR");
                options.put("receipt", orderId);

                com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
                String razorpayOrderId = razorpayOrder.get("id");

                order.setRazorpayOrderId(razorpayOrderId);
                orderRepository.save(order);

                return Map.of(
                        "orderId", razorpayOrderId,
                        "amount", order.getTotalAmount(),
                        "currency", "INR",
                        "keyId", keyId
                );
            }
        } catch (RazorpayException e) {
            log.error("Razorpay error: {}", e.getMessage());
        }

        // mock mode
        String mockOrderId = "mock_" + orderId;
        order.setRazorpayOrderId(mockOrderId);
        orderRepository.save(order);

        return Map.of(
                "orderId", mockOrderId,
                "amount", order.getTotalAmount(),
                "currency", "INR",
                "keyId", "mock_key",
                "mock", true
        );
    }

    public void handleWebhook(Map<String, Object> payload) {
        String event = (String) payload.get("event");

        if ("payment.captured".equals(event) || "order.paid".equals(event)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> payloadData = (Map<String, Object>) payload.get("payload");
            @SuppressWarnings("unchecked")
            Map<String, Object> payment = (Map<String, Object>) payloadData.get("payment");
            @SuppressWarnings("unchecked")
            Map<String, Object> entity = (Map<String, Object>) payment.get("entity");

            String razorpayOrderId = (String) entity.get("order_id");
            String paymentId = (String) entity.get("id");

            Order order = orderRepository.findAll().stream()
                    .filter(o -> razorpayOrderId.equals(o.getRazorpayOrderId()))
                    .findFirst().orElse(null);

            if (order != null) {
                orderService.updatePaymentStatus(order.getId(), PaymentStatus.PAID, paymentId);
            }
        }
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String data = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes());
            String generated = bytesToHex(hash);
            return generated.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
