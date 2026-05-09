package com.sweetmoment.shopping.service;

import com.sweetmoment.exception.BadRequestException;
import com.sweetmoment.exception.NotFoundException;
import com.sweetmoment.shared.entity.*;
import com.sweetmoment.shared.repository.*;
import com.sweetmoment.shopping.dto.CartDtos;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, UserRepository userRepository, ProductRepository productRepository, InventoryRepository inventoryRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public CartDtos.CartResponse getCart(Long userId) {
        if (userId == null || !userRepository.existsById(userId)) {
            return emptyCart(userId);
        }
        List<Cart> carts = cartRepository.findAllByUserIdOrderByIdDesc(userId);
        if (carts.isEmpty()) {
            return emptyCart(userId);
        }
        return toCartResponse(carts.get(0));
    }

    @Transactional
    public CartDtos.CartResponse addItem(CartDtos.AddToCartRequest request) {
        Cart cart = getOrCreateCart(request.userId);
        Product product = productRepository.findById(request.productId)
                .orElseThrow(() -> new NotFoundException("Produit introuvable"));
        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new NotFoundException("Stock introuvable"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);
        int nextQty = request.quantity;
        if (item != null) {
            nextQty = item.getQuantity() + request.quantity;
        }
        if (nextQty > inventory.getQuantity()) {
            throw new BadRequestException("Stock insuffisant");
        }
        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setUnitPrice(product.getPrice());
            item.setQuantity(request.quantity);
            cart.getItems().add(item);
        } else {
            item.setQuantity(nextQty);
        }
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse updateItem(CartDtos.UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(request.itemId)
                .orElseThrow(() -> new NotFoundException("Ligne panier introuvable"));
        Inventory inventory = inventoryRepository.findByProductId(item.getProduct().getId())
                .orElseThrow(() -> new NotFoundException("Stock introuvable"));
        if (request.quantity > inventory.getQuantity()) {
            throw new BadRequestException("Stock insuffisant");
        }
        item.setQuantity(request.quantity);
        cartItemRepository.save(item);
        return toCartResponse(item.getCart());
    }

    @Transactional
    public CartDtos.CartResponse removeItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Ligne panier introuvable"));
        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toCartResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse clearCart(Long userId) {
        ensureUserExists(userId);
        Cart cart = getOrCreateCart(userId);
        List<CartItem> items = new ArrayList<>(cart.getItems());
        for (CartItem item : items) {
            cartItemRepository.delete(item);
        }
        cart.getItems().clear();
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        List<Cart> carts = cartRepository.findAllByUserIdOrderByIdDesc(userId);
        if (!carts.isEmpty()) {
            return carts.get(0);
        }
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    public CartDtos.CartResponse toCartResponse(Cart cart) {
        CartDtos.CartResponse dto = new CartDtos.CartResponse();
        dto.id = cart.getId();
        if (cart.getUser() == null || cart.getUser().getId() == null) {
            throw new NotFoundException("Utilisateur introuvable");
        }
        dto.userId = cart.getUser().getId();
        dto.items = cart.getItems().stream().map(item -> {
            CartDtos.CartItemResponse line = new CartDtos.CartItemResponse();
            line.id = item.getId();
            Product product = item.getProduct();
            if (product == null) {
                throw new NotFoundException("Produit introuvable dans le panier");
            }
            line.productId = product.getId();
            line.productName = product.getName();
            line.category = product.getCategory() != null ? product.getCategory().getName() : null;
            line.productImage = product.getImage();
            line.unitPrice = item.getUnitPrice();
            line.quantity = item.getQuantity();
            line.stock = product.getInventory() != null ? product.getInventory().getQuantity() : 0;
            return line;
        }).toList();
        return dto;
    }

    private void ensureUserExists(Long userId) {
        if (userId == null || !userRepository.existsById(userId)) {
            throw new NotFoundException("Utilisateur introuvable");
        }
    }

    private CartDtos.CartResponse emptyCart(Long userId) {
        CartDtos.CartResponse dto = new CartDtos.CartResponse();
        dto.id = null;
        dto.userId = userId;
        dto.items = Collections.emptyList();
        return dto;
    }
}
