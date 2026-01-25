package com.fooddelivery.controller;

import com.fooddelivery.dto.request.MenuItemRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.service.FileStorageService;
import com.fooddelivery.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
@RequiredArgsConstructor
@Tag(name = "Menu", description = "Menu management APIs")
public class MenuController {

    private final MenuService menuService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @Operation(summary = "Get restaurant menu")
    public ApiResponse<List<MenuItem>> getMenu(@PathVariable String restaurantId) {
        return ApiResponse.success(menuService.getMenu(restaurantId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Get all menu items including unavailable")
    public ApiResponse<List<MenuItem>> getAllMenu(@PathVariable String restaurantId) {
        return ApiResponse.success(menuService.getAllMenu(restaurantId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Add menu item")
    public ApiResponse<MenuItem> addItem(@PathVariable String restaurantId,
                                         @Valid @RequestBody MenuItemRequest request,
                                         @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success("Item added", menuService.addItem(restaurantId, request, user.getUsername()));
    }

    @PutMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Update menu item")
    public ApiResponse<MenuItem> updateItem(@PathVariable String restaurantId,
                                            @PathVariable String itemId,
                                            @RequestBody MenuItemRequest request,
                                            @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(menuService.updateItem(restaurantId, itemId, request, user.getUsername()));
    }

    @PostMapping("/{itemId}/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Upload menu item image")
    public ApiResponse<MenuItem> uploadImage(@PathVariable String restaurantId,
                                             @PathVariable String itemId,
                                             @RequestParam("file") MultipartFile file,
                                             @AuthenticationPrincipal UserDetails user) {
        String url = fileStorageService.store(file);
        return ApiResponse.success(menuService.updateItemImage(restaurantId, itemId, url, user.getUsername()));
    }

    @PatchMapping("/{itemId}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Toggle item availability")
    public ApiResponse<MenuItem> toggleAvailability(@PathVariable String restaurantId,
                                                    @PathVariable String itemId,
                                                    @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(menuService.toggleAvailability(restaurantId, itemId, user.getUsername()));
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANT_OWNER')")
    @Operation(summary = "Delete menu item")
    public ApiResponse<Void> deleteItem(@PathVariable String restaurantId,
                                        @PathVariable String itemId,
                                        @AuthenticationPrincipal UserDetails user) {
        menuService.deleteItem(restaurantId, itemId, user.getUsername());
        return ApiResponse.success("Item deleted", null);
    }
}
