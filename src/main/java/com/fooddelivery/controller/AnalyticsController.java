package com.fooddelivery.controller;

import com.fooddelivery.dto.response.AnalyticsResponse;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics APIs (Admin only)")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard")
    public ApiResponse<AnalyticsResponse> getDashboard() {
        return ApiResponse.success(analyticsService.getDashboard());
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue")
    public ApiResponse<Double> getRevenue(@RequestParam(required = false) String startDate,
                                          @RequestParam(required = false) String endDate) {
        return ApiResponse.success(analyticsService.getRevenue(startDate, endDate));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Get restaurant stats")
    public ApiResponse<AnalyticsResponse> getRestaurantStats(@PathVariable String restaurantId) {
        return ApiResponse.success(analyticsService.getRestaurantStats(restaurantId));
    }
}
