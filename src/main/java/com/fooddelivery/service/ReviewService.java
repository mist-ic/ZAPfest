package com.fooddelivery.service;

import com.fooddelivery.dto.request.ReviewRequest;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.Review;
import com.fooddelivery.model.User;
import com.fooddelivery.model.enums.OrderStatus;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.ReviewRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantService restaurantService;

    public Review create(ReviewRequest request, String customerId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (!order.getCustomerId().equals(customerId)) {
            throw new UnauthorizedException("Not your order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Can only review delivered orders");
        }

        if (reviewRepository.existsByCustomerIdAndOrderId(customerId, request.getOrderId())) {
            throw new BadRequestException("Already reviewed this order");
        }

        Review review = Review.builder()
                .customerId(customerId)
                .restaurantId(order.getRestaurantId())
                .orderId(request.getOrderId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        updateRestaurantRating(order.getRestaurantId());

        return review;
    }

    public PagedResponse<Review> getByRestaurant(String restaurantId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByRestaurantId(restaurantId, pageable);
        return PagedResponse.<Review>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public void delete(String id, String userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));

        User user = userRepository.findById(userId).orElseThrow();
        if (user.getRole() != Role.ADMIN && !review.getCustomerId().equals(userId)) {
            throw new UnauthorizedException("Not authorized");
        }

        String restaurantId = review.getRestaurantId();
        reviewRepository.delete(review);
        updateRestaurantRating(restaurantId);
    }

    private void updateRestaurantRating(String restaurantId) {
        ReviewRepository.RatingStats stats = reviewRepository.getRestaurantRatingStats(restaurantId);
        if (stats != null && stats.getAvg() != null) {
            restaurantService.updateRating(restaurantId, stats.getAvg(), stats.getCount());
        }
    }
}
