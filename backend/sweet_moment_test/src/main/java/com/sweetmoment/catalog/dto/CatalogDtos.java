package com.sweetmoment.catalog.dto;

import java.math.BigDecimal;
import java.util.List;

public class CatalogDtos {

    public static class ProductResponse {
        public Long id;
        public String name;
        public String category;
        public BigDecimal price;
        public Integer stock;
        public String image;
        public String imageFallback;
        public String description;
        public boolean isNew;
        public Integer popularity;
    }

    public static class CategoryResponse {
        public Long id;
        public String name;
        public String description;
    }

    public static class ProductListResponse {
        public List<ProductResponse> items;
        public long total;
        public int page;
        public int pageSize;
    }
}
