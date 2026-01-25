package com.fooddelivery.service;

import com.fooddelivery.dto.request.MenuItemRequest;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Cacheable(value = "menu", key = "#restaurantId")
    public List<MenuItem> getMenu(String restaurantId) {
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
    }

    public List<MenuItem> getAllMenu(String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    @CacheEvict(value = "menu", key = "#restaurantId")
    public MenuItem addItem(String restaurantId, MenuItemRequest request, String userId) {
        checkOwnership(restaurantId, userId);

        MenuItem item = MenuItem.builder()
                .restaurantId(restaurantId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .build();

        return menuItemRepository.save(item);
    }

    @CacheEvict(value = "menu", key = "#restaurantId")
    public MenuItem updateItem(String restaurantId, String itemId, MenuItemRequest request, String userId) {
        checkOwnership(restaurantId, userId);
        MenuItem item = getItem(itemId);

        if (request.getName() != null) item.setName(request.getName());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getCategory() != null) item.setCategory(request.getCategory());

        return menuItemRepository.save(item);
    }

    @CacheEvict(value = "menu", key = "#restaurantId")
    public MenuItem updateItemImage(String restaurantId, String itemId, String imageUrl, String userId) {
        checkOwnership(restaurantId, userId);
        MenuItem item = getItem(itemId);
        item.setImageUrl(imageUrl);
        return menuItemRepository.save(item);
    }

    @CacheEvict(value = "menu", key = "#restaurantId")
    public MenuItem toggleAvailability(String restaurantId, String itemId, String userId) {
        checkOwnership(restaurantId, userId);
        MenuItem item = getItem(itemId);
        item.setIsAvailable(!item.getIsAvailable());
        return menuItemRepository.save(item);
    }

    @CacheEvict(value = "menu", key = "#restaurantId")
    public void deleteItem(String restaurantId, String itemId, String userId) {
        checkOwnership(restaurantId, userId);
        menuItemRepository.deleteById(itemId);
    }

    private MenuItem getItem(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
    }

    private void checkOwnership(String restaurantId, String userId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));
        User user = userRepository.findById(userId).orElseThrow();

        if (user.getRole() != Role.ADMIN && !restaurant.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to modify this restaurant's menu");
        }
    }
}
