package com.fooddelivery.service;

import com.fooddelivery.dto.request.RestaurantRequest;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Cacheable(value = "restaurants", key = "#pageable.pageNumber")
    public PagedResponse<Restaurant> getAll(Pageable pageable) {
        return toPagedResponse(restaurantRepository.findByIsActiveTrue(pageable));
    }

    public PagedResponse<Restaurant> search(String query, Pageable pageable) {
        return toPagedResponse(restaurantRepository.searchByName(query, pageable));
    }

    public PagedResponse<Restaurant> filterByCuisine(List<String> cuisines, Pageable pageable) {
        return toPagedResponse(restaurantRepository.findByCuisines(cuisines, pageable));
    }

    public Restaurant getById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
    }

    @CacheEvict(value = "restaurants", allEntries = true)
    public Restaurant create(RestaurantRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole() != Role.ADMIN && user.getRole() != Role.RESTAURANT_OWNER) {
            throw new UnauthorizedException("Only admins or restaurant owners can create restaurants");
        }

        Restaurant restaurant = Restaurant.builder()
                .ownerId(userId)
                .name(request.getName())
                .description(request.getDescription())
                .cuisines(request.getCuisines())
                .address(request.getAddress())
                .build();

        return restaurantRepository.save(restaurant);
    }

    @CacheEvict(value = "restaurants", allEntries = true)
    public Restaurant update(String id, RestaurantRequest request, String userId) {
        Restaurant restaurant = getById(id);
        checkOwnership(restaurant, userId);

        if (request.getName() != null) restaurant.setName(request.getName());
        if (request.getDescription() != null) restaurant.setDescription(request.getDescription());
        if (request.getCuisines() != null) restaurant.setCuisines(request.getCuisines());
        if (request.getAddress() != null) restaurant.setAddress(request.getAddress());

        return restaurantRepository.save(restaurant);
    }

    @CacheEvict(value = "restaurants", allEntries = true)
    public Restaurant updateImage(String id, String imageUrl, String userId) {
        Restaurant restaurant = getById(id);
        checkOwnership(restaurant, userId);
        restaurant.setImageUrl(imageUrl);
        return restaurantRepository.save(restaurant);
    }

    @CacheEvict(value = "restaurants", allEntries = true)
    public void delete(String id, String userId) {
        Restaurant restaurant = getById(id);
        User user = userRepository.findById(userId).orElseThrow();
        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admin can delete restaurants");
        }
        restaurantRepository.delete(restaurant);
    }

    public List<Restaurant> getByOwner(String ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public void updateRating(String restaurantId, double rating, int totalReviews) {
        Restaurant restaurant = getById(restaurantId);
        restaurant.setRating(rating);
        restaurant.setTotalReviews(totalReviews);
        restaurantRepository.save(restaurant);
    }

    private void checkOwnership(Restaurant restaurant, String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        if (user.getRole() != Role.ADMIN && !restaurant.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to modify this restaurant");
        }
    }

    private PagedResponse<Restaurant> toPagedResponse(Page<Restaurant> page) {
        return PagedResponse.<Restaurant>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
