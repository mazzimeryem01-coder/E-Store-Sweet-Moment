package com.sweetmoment.billing.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class OrderDtos {

    public static class CreateOrderRequest {
        @NotNull public Long userId;
    }

    public static class OrderItemResponse {
        public Long productId;
        public String name;
        public Integer quantity;
        public BigDecimal unitPrice;
    }

    public static class OrderResponse {
        public Long id;
        public Long userId;
        public String status;
        public String createdAt;
        public BigDecimal total;
        public String shippingAddress;
        public List<OrderItemResponse> items;
    }
}
