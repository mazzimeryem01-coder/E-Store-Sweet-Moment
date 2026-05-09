package com.sweetmoment.catalog.controller;

import com.sweetmoment.catalog.dto.CatalogDtos;
import com.sweetmoment.catalog.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/products")
    public CatalogDtos.ProductListResponse products(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "popular") String sort,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "8") Integer pageSize
    ) {
        return catalogService.getProducts(search, category, sort, page, pageSize);
    }

    @GetMapping("/products/{id}")
    public CatalogDtos.ProductResponse productById(@PathVariable Long id) {
        return catalogService.getProductById(id);
    }

    @GetMapping("/categories")
    public List<CatalogDtos.CategoryResponse> categories() {
        return catalogService.getCategories();
    }
}
