package com.fooddelivery.repository;

import com.fooddelivery.model.Order;
import com.fooddelivery.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    Page<Order> findByCustomerId(String customerId, Pageable pageable);
    Page<Order> findByRestaurantId(String restaurantId, Pageable pageable);
    Page<Order> findByDeliveryPartnerId(String deliveryPartnerId, Pageable pageable);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByRestaurantIdAndCreatedAtBetween(String restaurantId, Instant start, Instant end);
    long countByRestaurantId(String restaurantId);

    @Aggregation(pipeline = {
        "{ $match: { 'paymentStatus': 'PAID' } }",
        "{ $group: { _id: null, total: { $sum: '$totalAmount' } } }"
    })
    Double getTotalRevenue();

    @Aggregation(pipeline = {
        "{ $match: { 'restaurantId': ?0, 'paymentStatus': 'PAID' } }",
        "{ $group: { _id: null, total: { $sum: '$totalAmount' } } }"
    })
    Double getRevenueByRestaurant(String restaurantId);
}
