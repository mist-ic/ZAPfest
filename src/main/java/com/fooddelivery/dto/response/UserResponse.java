package com.fooddelivery.dto.response;

import com.fooddelivery.model.Address;
import com.fooddelivery.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String avatarUrl;
    private List<Address> addresses;
}
