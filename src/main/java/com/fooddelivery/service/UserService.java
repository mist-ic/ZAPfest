package com.fooddelivery.service;

import com.fooddelivery.dto.request.UpdateUserRequest;
import com.fooddelivery.dto.response.PagedResponse;
import com.fooddelivery.dto.response.UserResponse;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.model.User;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserResponse getUser(String id) {
        return toResponse(findById(id));
    }

    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = findById(id);
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddresses() != null) user.setAddresses(request.getAddresses());
        return toResponse(userRepository.save(user));
    }

    public UserResponse updateAvatar(String id, String avatarUrl) {
        User user = findById(id);
        user.setAvatarUrl(avatarUrl);
        return toResponse(userRepository.save(user));
    }

    public PagedResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return PagedResponse.<UserResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    public void updateRole(String id, Role role) {
        User user = findById(id);
        user.setRole(role);
        userRepository.save(user);
    }

    private User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .addresses(user.getAddresses())
                .build();
    }
}
