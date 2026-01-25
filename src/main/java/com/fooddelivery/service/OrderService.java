package com.fooddelivery.service;

import com.fooddelivery.dto.request.OrderRequest;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.event.NotificationEvent;
import com.fooddelivery.event.OrderEvent;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.model.*;
import com.fooddelivery.model.enums.OrderStatus;
import com.fooddelivery.model.enums.PaymentStatus;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final EventPublisher eventPublisher;

    public Order create(OrderRequest request, String customerId) {
        if (!restaurantRepository.existsById(request.getRestaurantId())) {
            throw new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId());
        }

        List<String> itemIds = request.getItems().stream()
                .map(OrderRequest.OrderItemRequest::getMenuItemId).toList();
        Map<String, MenuItem> menuItems = menuItemRepository.findAllById(itemIds).stream()
                .collect(Collectors.toMap(MenuItem::getId, m -> m));

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (OrderRequest.OrderItemRequest item : request.getItems()) {
            MenuItem menuItem = menuItems.get(item.getMenuItemId());
            if (menuItem == null || !menuItem.getIsAvailable()) {
                throw new BadRequestException("Item not available: " + item.getMenuItemId());
            }
            int qty = item.getQuantity() != null ? item.getQuantity() : 1;
            orderItems.add(OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .name(menuItem.getName())
                    .price(menuItem.getPrice())
                    .quantity(qty)
                    .build());
            total += menuItem.getPrice() * qty;
        }

        Order order = Order.builder()
                .customerId(customerId)
                .restaurantId(request.getRestaurantId())
                .items(orderItems)
                .totalAmount(total)
                .deliveryAddress(request.getDeliveryAddress())
                .build();

        order = orderRepository.save(order);

        publishOrderEvent(order, "CREATED");
        
        User customer = userRepository.findById(customerId).orElse(null);
        if (customer != null) {
            eventPublisher.publishNotification(NotificationEvent.builder()
                    .userId(customerId)
                    .email(customer.getEmail())
                    .type("ORDER_PLACED")
                    .title("Order Placed - #" + order.getId())
                    .message("Your order has been placed! Total: ₹" + order.getTotalAmount())
                    .timestamp(System.currentTimeMillis())
                    .build());
        }

        return order;
    }

    public PagedResponse<Order> getCustomerOrders(String customerId, Pageable pageable) {
        return toPagedResponse(orderRepository.findByCustomerId(customerId, pageable));
    }

    public PagedResponse<Order> getRestaurantOrders(String restaurantId, String userId, Pageable pageable) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));
        User user = userRepository.findById(userId).orElseThrow();

        if (user.getRole() != Role.ADMIN && !restaurant.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("Not authorized");
        }

        return toPagedResponse(orderRepository.findByRestaurantId(restaurantId, pageable));
    }

    public PagedResponse<Order> getDeliveryOrders(String deliveryPartnerId, Pageable pageable) {
        return toPagedResponse(orderRepository.findByDeliveryPartnerId(deliveryPartnerId, pageable));
    }

    public Order getById(String id, String userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        checkAccess(order, userId);
        return order;
    }

    public Order updateStatus(String id, OrderStatus status, String userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        User user = userRepository.findById(userId).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(order.getRestaurantId()).orElse(null);

        boolean canUpdate = user.getRole() == Role.ADMIN
                || (restaurant != null && restaurant.getOwnerId().equals(userId))
                || (user.getRole() == Role.DELIVERY_PARTNER && userId.equals(order.getDeliveryPartnerId()));

        if (!canUpdate) throw new UnauthorizedException("Not authorized to update this order");

        order.setStatus(status);
        order = orderRepository.save(order);

        publishOrderEvent(order, status.name());

        User customer = userRepository.findById(order.getCustomerId()).orElse(null);
        if (customer != null) {
            eventPublisher.publishNotification(NotificationEvent.builder()
                    .userId(order.getCustomerId())
                    .email(customer.getEmail())
                    .type("ORDER_" + status.name())
                    .title("Order Update - #" + order.getId())
                    .message("Your order status: " + status.name())
                    .timestamp(System.currentTimeMillis())
                    .build());
        }

        return order;
    }

    public Order assignDeliveryPartner(String orderId, String deliveryPartnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setDeliveryPartnerId(deliveryPartnerId);
        return orderRepository.save(order);
    }

    public Order cancel(String id, String userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        User user = userRepository.findById(userId).orElseThrow();
        if (user.getRole() != Role.ADMIN && !order.getCustomerId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Cannot cancel order in current status");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        publishOrderEvent(order, "CANCELLED");
        return order;
    }

    public void updatePaymentStatus(String orderId, PaymentStatus status, String razorpayPaymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setPaymentStatus(status);
        if (razorpayPaymentId != null) order.setRazorpayPaymentId(razorpayPaymentId);
        if (status == PaymentStatus.PAID) order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        
        if (status == PaymentStatus.PAID) {
            publishOrderEvent(order, "CONFIRMED");
        }
    }

    private void publishOrderEvent(Order order, String type) {
        eventPublisher.publishOrderEvent(OrderEvent.builder()
                .orderId(order.getId())
                .customerId(order.getCustomerId())
                .restaurantId(order.getRestaurantId())
                .type(type)
                .totalAmount(order.getTotalAmount())
                .timestamp(System.currentTimeMillis())
                .build());
    }

    private void checkAccess(Order order, String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        if (user.getRole() == Role.ADMIN) return;

        Restaurant restaurant = restaurantRepository.findById(order.getRestaurantId()).orElse(null);
        boolean isOwner = restaurant != null && restaurant.getOwnerId().equals(userId);
        boolean isCustomer = order.getCustomerId().equals(userId);
        boolean isDelivery = userId.equals(order.getDeliveryPartnerId());

        if (!isOwner && !isCustomer && !isDelivery) {
            throw new UnauthorizedException("Not authorized to view this order");
        }
    }

    private PagedResponse<Order> toPagedResponse(Page<Order> page) {
        return PagedResponse.<Order>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
