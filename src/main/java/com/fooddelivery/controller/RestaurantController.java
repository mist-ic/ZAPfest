package com.fooddelivery.controller;

import com.fooddelivery.dto.request.RestaurantRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.service.FileStorageService;
import com.fooddelivery.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurants", description = "Restaurant APIs")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @Operation(summary = "List all restaurants")
    public ApiResponse<PagedResponse<Restaurant>> getAll(Pageable pageable) {
        return ApiResponse.success(restaurantService.getAll(pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Search restaurants by name")
    public ApiResponse<PagedResponse<Restaurant>> search(@RequestParam String q, Pageable pageable) {
        return ApiResponse.success(restaurantService.search(q, pageable));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter by cuisines")
    public ApiResponse<PagedResponse<Restaurant>> filter(@RequestParam List<String> cuisines, Pageable pageable) {
        return ApiResponse.success(restaurantService.filterByCuisine(cuisines, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant by ID")
    public ApiResponse<Restaurant> getById(@PathVariable String id) {
        return ApiResponse.success(restaurantService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Create restaurant")
    public ApiResponse<Restaurant> create(@Valid @RequestBody RestaurantRequest request,
                                          @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success("Restaurant created", restaurantService.create(request, user.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Update restaurant")
    public ApiResponse<Restaurant> update(@PathVariable String id,
                                          @RequestBody RestaurantRequest request,
                                          @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(restaurantService.update(id, request, user.getUsername()));
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Upload restaurant image")
    public ApiResponse<Restaurant> uploadImage(@PathVariable String id,
                                               @RequestParam("file") MultipartFile file,
                                               @AuthenticationPrincipal UserDetails user) {
        String url = fileStorageService.store(file);
        return ApiResponse.success(restaurantService.updateImage(id, url, user.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete restaurant (Admin)")
    public ApiResponse<Void> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails user) {
        restaurantService.delete(id, user.getUsername());
        return ApiResponse.success("Restaurant deleted", null);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @Operation(summary = "Get my restaurants")
    public ApiResponse<List<Restaurant>> getMyRestaurants(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(restaurantService.getByOwner(user.getUsername()));
    }
}
