package com.fooddelivery.controller;

import com.fooddelivery.dto.request.ReviewRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.model.Review;
import com.fooddelivery.service.ReviewService;
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
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Review APIs")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create review")
    public ApiResponse<Review> create(@Valid @RequestBody ReviewRequest request,
                                      @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success("Review added", reviewService.create(request, user.getUsername()));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Get restaurant reviews")
    public ApiResponse<PagedResponse<Review>> getByRestaurant(@PathVariable String restaurantId,
                                                               Pageable pageable) {
        return ApiResponse.success(reviewService.getByRestaurant(restaurantId, pageable));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete review")
    public ApiResponse<Void> delete(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails user) {
        reviewService.delete(id, user.getUsername());
        return ApiResponse.success("Review deleted", null);
    }
}
