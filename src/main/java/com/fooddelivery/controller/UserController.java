package com.fooddelivery.controller;

import com.fooddelivery.dto.request.UpdateUserRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.dto.response.UserResponse;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.service.FileStorageService;
import com.fooddelivery.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    @Operation(summary = "Get current user")
    public ApiResponse<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.success(userService.getUser(user.getUsername()));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ApiResponse<UserResponse> updateProfile(@AuthenticationPrincipal UserDetails user,
                                                   @RequestBody UpdateUserRequest request) {
        return ApiResponse.success(userService.updateUser(user.getUsername(), request));
    }

    @PostMapping("/me/avatar")
    @Operation(summary = "Upload avatar")
    public ApiResponse<UserResponse> uploadAvatar(@AuthenticationPrincipal UserDetails user,
                                                  @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ApiResponse.success(userService.updateAvatar(user.getUsername(), url));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users (Admin)")
    public ApiResponse<PagedResponse<UserResponse>> getAllUsers(Pageable pageable) {
        return ApiResponse.success(userService.getAllUsers(pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user (Admin)")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ApiResponse.success("User deleted", null);
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user role (Admin)")
    public ApiResponse<Void> updateRole(@PathVariable String id, @RequestParam Role role) {
        userService.updateRole(id, role);
        return ApiResponse.success("Role updated", null);
    }
}
