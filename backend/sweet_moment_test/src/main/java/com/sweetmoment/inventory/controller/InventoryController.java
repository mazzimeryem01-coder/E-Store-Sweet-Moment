package com.sweetmoment.inventory.controller;

import com.sweetmoment.catalog.dto.CatalogDtos;
import com.sweetmoment.inventory.dto.InventoryDtos;
import com.sweetmoment.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{productId}")
    public Map<String, Object> stock(@PathVariable Long productId) {
        return Map.of("productId", productId, "quantity", inventoryService.getStock(productId));
    }

    @PutMapping
    public CatalogDtos.ProductResponse update(@Valid @RequestBody InventoryDtos.UpdateStockRequest request) {
        return inventoryService.updateStock(request);
    }
}
