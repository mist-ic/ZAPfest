package com.fooddelivery.dto.request;

import com.fooddelivery.model.Address;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class RestaurantRequest {
    @NotBlank
    private String name;
    private String description;
    private List<String> cuisines;
    private Address address;
}
