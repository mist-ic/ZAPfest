package com.fooddelivery.service;

import com.fooddelivery.dto.response.AnalyticsResponse;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.enums.OrderStatus;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public AnalyticsResponse getDashboard() {
        List<Restaurant> topRestaurants = restaurantRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "rating"))
        ).getContent();

        Map<String, Long> ordersByStatus = Arrays.stream(OrderStatus.values())
                .collect(Collectors.toMap(Enum::name, s -> (long) orderRepository.findByStatus(s).size()));

        return AnalyticsResponse.builder()
                .totalRevenue(orderRepository.getTotalRevenue())
                .totalOrders(orderRepository.count())
                .totalUsers(userRepository.count())
                .totalRestaurants(restaurantRepository.count())
                .topRestaurants(topRestaurants.stream()
                        .map(r -> AnalyticsResponse.TopItem.builder()
                                .id(r.getId())
                                .name(r.getName())
                                .value(r.getRating())
                                .build())
                        .toList())
                .ordersByStatus(ordersByStatus)
                .orderTrend(getOrderTrend())
                .build();
    }

    public AnalyticsResponse getRestaurantStats(String restaurantId) {
        Double revenue = orderRepository.getRevenueByRestaurant(restaurantId);
        long orderCount = orderRepository.countByRestaurantId(restaurantId);
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);

        return AnalyticsResponse.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .totalOrders(orderCount)
                .topRestaurants(restaurant != null ? List.of(AnalyticsResponse.TopItem.builder()
                        .id(restaurant.getId())
                        .name(restaurant.getName())
                        .value(restaurant.getRating())
                        .build()) : List.of())
                .build();
    }

    public Double getRevenue(String startDate, String endDate) {
        if (startDate == null || endDate == null) {
            return orderRepository.getTotalRevenue();
        }

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return orderRepository.findAll().stream()
                .filter(o -> {
                    LocalDate orderDate = o.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate();
                    return !orderDate.isBefore(start) && !orderDate.isAfter(end);
                })
                .filter(o -> o.getPaymentStatus().name().equals("PAID"))
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }

    private List<AnalyticsResponse.TrendPoint> getOrderTrend() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);

        Map<String, Long> countByDate = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            countByDate.put(date.format(formatter), 0L);
        }

        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> !o.getCreatedAt().isBefore(startInstant) && o.getCreatedAt().isBefore(endInstant))
                .forEach(o -> {
                    String date = o.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter);
                    countByDate.merge(date, 1L, Long::sum);
                });

        return countByDate.entrySet().stream()
                .map(e -> AnalyticsResponse.TrendPoint.builder()
                        .date(e.getKey())
                        .count(e.getValue())
                        .build())
                .toList();
    }
}
