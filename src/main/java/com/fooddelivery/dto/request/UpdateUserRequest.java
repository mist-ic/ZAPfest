package com.fooddelivery.dto.request;

import com.fooddelivery.model.Address;
import lombok.Data;
import java.util.List;

@Data
public class UpdateUserRequest {
    private String name;
    private String phone;
    private List<Address> addresses;
}
