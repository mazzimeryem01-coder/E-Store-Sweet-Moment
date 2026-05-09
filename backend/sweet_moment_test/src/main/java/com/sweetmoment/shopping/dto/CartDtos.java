package com.sweetmoment.shopping.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CartDtos {

    public static class AddToCartRequest {
        @NotNull public Long userId;
        @NotNull public Long productId;
        @NotNull @Min(1) public Integer quantity;
    }

    public static class UpdateCartItemRequest {
        @NotNull public Long itemId;
        @NotNull @Min(1) public Integer quantity;
        public Long userId;
    }

    public static class CartItemResponse {
        public Long id;
        public Long productId;
        public String productName;
        public String category;
        public String productImage;
        public BigDecimal unitPrice;
        public Integer quantity;
        public Integer stock;
    }

    public static class CartResponse {
        public Long id;
        public Long userId;
        public List<CartItemResponse> items;
    }
}
