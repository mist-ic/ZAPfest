package com.fooddelivery.dto.request;

import com.fooddelivery.model.Address;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    @NotBlank
    private String restaurantId;

    @NotEmpty
    private List<OrderItemRequest> items;

    private Address deliveryAddress;

    @Data
    public static class OrderItemRequest {
        @NotBlank
        private String menuItemId;
        private Integer quantity = 1;
    }
}
