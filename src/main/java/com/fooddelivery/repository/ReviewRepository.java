package com.fooddelivery.repository;

import com.fooddelivery.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {
    Page<Review> findByRestaurantId(String restaurantId, Pageable pageable);
    boolean existsByCustomerIdAndOrderId(String customerId, String orderId);

    @Aggregation(pipeline = {
        "{ $match: { 'restaurantId': ?0 } }",
        "{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }"
    })
    RatingStats getRestaurantRatingStats(String restaurantId);

    interface RatingStats {
        Double getAvg();
        Integer getCount();
    }
}
