package com.fooddelivery.controller;

import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create/{orderId}")
    @Operation(summary = "Create payment order")
    public ApiResponse<Map<String, Object>> createPayment(@PathVariable String orderId,
                                                          @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(paymentService.createPaymentOrder(orderId, user.getUsername()));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook")
    public ApiResponse<Void> webhook(@RequestBody Map<String, Object> payload) {
        paymentService.handleWebhook(payload);
        return ApiResponse.success("Processed", null);
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify payment signature")
    public ApiResponse<Boolean> verify(@RequestParam String orderId,
                                       @RequestParam String paymentId,
                                       @RequestParam String signature) {
        return ApiResponse.success(paymentService.verifySignature(orderId, paymentId, signature));
    }
}
