package com.sweetmoment.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class InventoryDtos {
    public static class UpdateStockRequest {
        @NotNull public Long productId;
        @NotNull @Min(0) public Integer quantity;
    }
}
