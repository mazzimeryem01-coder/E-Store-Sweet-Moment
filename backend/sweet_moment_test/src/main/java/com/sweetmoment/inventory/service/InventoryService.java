package com.sweetmoment.inventory.service;

import com.sweetmoment.catalog.dto.CatalogDtos;
import com.sweetmoment.catalog.service.CatalogService;
import com.sweetmoment.exception.NotFoundException;
import com.sweetmoment.inventory.dto.InventoryDtos;
import com.sweetmoment.shared.entity.Inventory;
import com.sweetmoment.shared.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final CatalogService catalogService;

    public InventoryService(InventoryRepository inventoryRepository, CatalogService catalogService) {
        this.inventoryRepository = inventoryRepository;
        this.catalogService = catalogService;
    }

    @Transactional(readOnly = true)
    public Integer getStock(Long productId) {
        return inventoryRepository.findByProductId(productId).map(Inventory::getQuantity)
                .orElseThrow(() -> new NotFoundException("Stock introuvable"));
    }

    @Transactional
    public CatalogDtos.ProductResponse updateStock(InventoryDtos.UpdateStockRequest request) {
        Inventory inventory = inventoryRepository.findByProductId(request.productId)
                .orElseThrow(() -> new NotFoundException("Stock introuvable"));
        inventory.setQuantity(request.quantity);
        inventoryRepository.save(inventory);
        return catalogService.getProductById(request.productId);
    }
}
