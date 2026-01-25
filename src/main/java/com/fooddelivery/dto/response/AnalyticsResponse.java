package com.fooddelivery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalRestaurants;
    private List<TopItem> topRestaurants;
    private List<TopItem> topItems;
    private Map<String, Long> ordersByStatus;
    private List<TrendPoint> orderTrend;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopItem {
        private String id;
        private String name;
        private Double value;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendPoint {
        private String date;
        private Long count;
    }
}
