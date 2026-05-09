package com.sweetmoment.shopping.controller;

import com.sweetmoment.shopping.dto.CartDtos;
import com.sweetmoment.shopping.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public CartDtos.CartResponse getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/add")
    public CartDtos.CartResponse add(@Valid @RequestBody CartDtos.AddToCartRequest request) {
        return cartService.addItem(request);
    }

    @PutMapping("/update")
    public CartDtos.CartResponse update(@Valid @RequestBody CartDtos.UpdateCartItemRequest request) {
        return cartService.updateItem(request);
    }

    @DeleteMapping("/remove/{itemId}")
    public CartDtos.CartResponse remove(@PathVariable Long itemId) {
        return cartService.removeItem(itemId);
    }

    @DeleteMapping("/clear/{userId}")
    public CartDtos.CartResponse clear(@PathVariable Long userId) {
        return cartService.clearCart(userId);
    }
}
