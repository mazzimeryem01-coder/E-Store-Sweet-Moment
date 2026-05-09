package com.sweetmoment.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReviewDtos {

    public static class CreateReviewRequest {
        @NotNull public Long productId;
        @NotNull public Long userId;
        @NotBlank public String authorName;
        @NotNull @Min(1) @Max(5) public Integer rating;
        @NotBlank @Size(min = 10, max = 500) public String comment;
    }

    public static class ReviewResponse {
        public Long id;
        public Long productId;
        public Long userId;
        public String authorName;
        public Integer rating;
        public String comment;
        public String createdAt;
    }
}
