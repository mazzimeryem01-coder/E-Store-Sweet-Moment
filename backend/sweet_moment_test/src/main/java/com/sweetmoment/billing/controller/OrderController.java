package com.sweetmoment.billing.controller;

import com.sweetmoment.billing.dto.OrderDtos;
import com.sweetmoment.billing.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
//Injection par constructeur
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
//Création d'une commande
    @PostMapping
    public OrderDtos.OrderResponse createOrder(@Valid @RequestBody OrderDtos.CreateOrderRequest request) {
        return orderService.createOrder(request.userId);/*(création de la commande à partir du panier,
         vérification stock, enregistrement).*/
    }
    //historiques des commandes (récupère TOUTES les commandes d’un utilisateur)
    @GetMapping("/user/{userId}")
    public List<OrderDtos.OrderResponse> byUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }
    // récupère UNE seule commande par ID
    @GetMapping("/{orderId}")
    public OrderDtos.OrderResponse byId(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }
}
