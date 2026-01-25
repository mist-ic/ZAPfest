package com.fooddelivery.controller;

import com.fooddelivery.dto.request.OrderRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.enums.OrderStatus;
import com.fooddelivery.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create order")
    public ApiResponse<Order> create(@Valid @RequestBody OrderRequest request,
                                     @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success("Order placed", orderService.create(request, user.getUsername()));
    }

    @GetMapping
    @Operation(summary = "Get my orders")
    public ApiResponse<PagedResponse<Order>> getMyOrders(@AuthenticationPrincipal UserDetails user,
                                                         Pageable pageable) {
        return ApiResponse.success(orderService.getCustomerOrders(user.getUsername(), pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ApiResponse<Order> getById(@PathVariable String id,
                                      @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(orderService.getById(id, user.getUsername()));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Get orders for restaurant")
    public ApiResponse<PagedResponse<Order>> getRestaurantOrders(@PathVariable String restaurantId,
                                                                  @AuthenticationPrincipal UserDetails user,
                                                                  Pageable pageable) {
        return ApiResponse.success(orderService.getRestaurantOrders(restaurantId, user.getUsername(), pageable));
    }

    @GetMapping("/delivery")
    @PreAuthorize("hasRole('DELIVERY_PARTNER')")
    @Operation(summary = "Get my delivery orders")
    public ApiResponse<PagedResponse<Order>> getDeliveryOrders(@AuthenticationPrincipal UserDetails user,
                                                                Pageable pageable) {
        return ApiResponse.success(orderService.getDeliveryOrders(user.getUsername(), pageable));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER')")
    @Operation(summary = "Update order status")
    public ApiResponse<Order> updateStatus(@PathVariable String id,
                                           @RequestParam OrderStatus status,
                                           @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(orderService.updateStatus(id, status, user.getUsername()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign delivery partner")
    public ApiResponse<Order> assignDelivery(@PathVariable String id,
                                             @RequestParam String deliveryPartnerId) {
        return ApiResponse.success(orderService.assignDeliveryPartner(id, deliveryPartnerId));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel order")
    public ApiResponse<Order> cancel(@PathVariable String id,
                                     @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success("Order cancelled", orderService.cancel(id, user.getUsername()));
    }
}
