package com.sweetmoment.catalog.service;

import com.sweetmoment.catalog.dto.CatalogDtos;
import com.sweetmoment.exception.NotFoundException;
import com.sweetmoment.shared.entity.Category;
import com.sweetmoment.shared.entity.Inventory;
import com.sweetmoment.shared.entity.Product;
import com.sweetmoment.shared.repository.CategoryRepository;
import com.sweetmoment.shared.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public CatalogService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public CatalogDtos.ProductListResponse getProducts(String search, String category, String sort, Integer page, Integer pageSize) {
        int p = page == null || page < 1 ? 1 : page;
        int size = pageSize == null || pageSize < 1 ? 8 : pageSize;
        Sort sorting = switch (sort == null ? "popular" : sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "newest" -> Sort.by("isNew").descending().and(Sort.by("id").descending());
            default -> Sort.by("popularity").descending();
        };

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase().trim() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.join("category").get("name"), category));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> result = productRepository.findAll(spec, PageRequest.of(p - 1, size, sorting));
        CatalogDtos.ProductListResponse response = new CatalogDtos.ProductListResponse();
        response.items = result.getContent().stream().map(this::toProductResponse).toList();
        response.total = result.getTotalElements();
        response.page = p;
        response.pageSize = size;
        return response;
    }

    @Transactional(readOnly = true)
    public CatalogDtos.ProductResponse getProductById(Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Produit introuvable"));
        return toProductResponse(p);
    }

    @Transactional(readOnly = true)
    public List<CatalogDtos.CategoryResponse> getCategories() {
        return categoryRepository.findAll(Sort.by("name").ascending()).stream().map(c -> {
            CatalogDtos.CategoryResponse dto = new CatalogDtos.CategoryResponse();
            dto.id = c.getId();
            dto.name = c.getName();
            dto.description = c.getDescription();
            return dto;
        }).toList();
    }

    public CatalogDtos.ProductResponse toProductResponse(Product p) {
        CatalogDtos.ProductResponse dto = new CatalogDtos.ProductResponse();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.category = p.getCategory() != null ? p.getCategory().getName() : null;
        dto.price = p.getPrice();
        Inventory inv = p.getInventory();
        dto.stock = inv != null ? inv.getQuantity() : 0;
        dto.image = p.getImage();
        dto.imageFallback = p.getImageFallback();
        dto.description = p.getDescription();
        dto.isNew = p.isNew();
        dto.popularity = p.getPopularity();
        return dto;
    }

    public Category findCategoryOrThrow(String name) {
        return categoryRepository.findByName(name).orElseThrow(() -> new NotFoundException("Catégorie introuvable"));
    }
}
