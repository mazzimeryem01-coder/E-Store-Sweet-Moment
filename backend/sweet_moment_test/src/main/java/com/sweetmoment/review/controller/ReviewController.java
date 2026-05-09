package com.sweetmoment.review.controller;

import com.sweetmoment.review.dto.ReviewDtos;
import com.sweetmoment.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ReviewDtos.ReviewResponse create(@Valid @RequestBody ReviewDtos.CreateReviewRequest request) {
        return reviewService.create(request);
    }

    @GetMapping("/product/{productId}")
    public List<ReviewDtos.ReviewResponse> byProduct(@PathVariable Long productId) {
        return reviewService.byProduct(productId);
    }
}
