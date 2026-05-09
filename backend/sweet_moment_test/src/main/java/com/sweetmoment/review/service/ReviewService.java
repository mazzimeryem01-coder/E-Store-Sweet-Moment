package com.sweetmoment.review.service;

import com.sweetmoment.exception.NotFoundException;
import com.sweetmoment.review.dto.ReviewDtos;
import com.sweetmoment.shared.entity.Product;
import com.sweetmoment.shared.entity.Review;
import com.sweetmoment.shared.entity.User;
import com.sweetmoment.shared.repository.ProductRepository;
import com.sweetmoment.shared.repository.ReviewRepository;
import com.sweetmoment.shared.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewDtos.ReviewResponse create(ReviewDtos.CreateReviewRequest request) {
        Product product = productRepository.findById(request.productId).orElseThrow(() -> new NotFoundException("Produit introuvable"));
        User user = userRepository.findById(request.userId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        Review review = new Review();
        review.setProductId(product.getId());
        review.setUserId(user.getId());
        review.setAuthorName(request.authorName.trim());
        review.setRating(request.rating);
        review.setComment(request.comment.trim());
        reviewRepository.save(review);
        return toResponse(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDtos.ReviewResponse> byProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream().map(this::toResponse).toList();
    }

    private ReviewDtos.ReviewResponse toResponse(Review review) {
        ReviewDtos.ReviewResponse dto = new ReviewDtos.ReviewResponse();
        dto.id = review.getId();
        dto.productId = review.getProductId();
        dto.userId = review.getUserId();
        dto.authorName = review.getAuthorName();
        dto.rating = review.getRating();
        dto.comment = review.getComment();
        dto.createdAt = review.getCreatedAt().toString();
        return dto;
    }
}
