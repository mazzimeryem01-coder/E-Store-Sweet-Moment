package com.sweetmoment.billing.service;

import com.sweetmoment.billing.dto.OrderDtos;
import com.sweetmoment.exception.BadRequestException;
import com.sweetmoment.exception.NotFoundException;
import com.sweetmoment.shared.entity.*;
import com.sweetmoment.shared.repository.*;
import com.sweetmoment.shopping.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final CartService cartService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerOrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public OrderService(CartService cartService, CartRepository cartRepository, CartItemRepository cartItemRepository, CustomerOrderRepository orderRepository, InventoryRepository inventoryRepository, UserRepository userRepository) {
        this.cartService = cartService;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderDtos.OrderResponse createOrder(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        Cart cart = cartService.getOrCreateCart(userId);
        if (cart.getItems().isEmpty()) throw new BadRequestException("Panier vide");

        for (CartItem item : cart.getItems()) {
            Inventory inventory = inventoryRepository.findByProductId(item.getProduct().getId())
                    .orElseThrow(() -> new NotFoundException("Stock introuvable"));
            if (item.getQuantity() > inventory.getQuantity()) {
                throw new BadRequestException("Stock insuffisant pour " + item.getProduct().getName());
            }
        }
//Création de la commande
        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setStatus(OrderStatus.PROCESSING);//Crée un nouvel objet commande avec le statut "En traitement"

        String city = user.getProfile() != null && user.getProfile().getCity() != null ? user.getProfile().getCity() : "Casablanca";
        order.setShippingAddress(city + ", Maroc");

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;// Initialise le sous-total à 0
// Parcourt chaque article présent dans le panier de l'utilisateur
        for (CartItem item : cart.getItems()) {
// Si le produit n'a pas de stock enregistré, on déclenche une exception
            Inventory inv = inventoryRepository.findByProductId(item.getProduct().getId()).orElseThrow();
            inv.setQuantity(inv.getQuantity() - item.getQuantity());
// Sauvegarde le nouveau stock dans la base de données
            inventoryRepository.save(inv);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getUnitPrice());
            orderItems.add(orderItem);
            subtotal = subtotal.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(500)) > 0 ? BigDecimal.ZERO : BigDecimal.valueOf(30);
        order.setTotalAmount(subtotal.add(shipping));
        order.setItems(orderItems);
        orderRepository.save(order);

        for (CartItem item : new ArrayList<>(cart.getItems())) {
            cartItemRepository.delete(item);
        }
        cart.getItems().clear();
        cartRepository.save(cart);

        return toOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDtos.OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream().map(this::toOrderResponse).toList();
    }

    @Transactional(readOnly = true)
    public OrderDtos.OrderResponse getOrderById(Long orderId) {
        CustomerOrder order = orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("Commande introuvable"));
        return toOrderResponse(order);
    }

    private OrderDtos.OrderResponse toOrderResponse(CustomerOrder order) {
        OrderDtos.OrderResponse dto = new OrderDtos.OrderResponse();
        dto.id = order.getId();
        dto.userId = order.getUser().getId();
        dto.status = order.getStatus().name();
        dto.createdAt = order.getOrderDate().toString();
        dto.total = order.getTotalAmount();
        dto.shippingAddress = order.getShippingAddress();
        dto.items = order.getItems().stream().map(item -> {
            OrderDtos.OrderItemResponse row = new OrderDtos.OrderItemResponse();
            row.productId = item.getProduct().getId();
            row.name = item.getProduct().getName();
            row.quantity = item.getQuantity();
            row.unitPrice = item.getUnitPrice();
            return row;
        }).toList();
        return dto;
    }
}
