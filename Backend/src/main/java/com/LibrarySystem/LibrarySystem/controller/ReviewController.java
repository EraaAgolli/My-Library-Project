package com.LibrarySystem.LibrarySystem.controller;

import com.LibrarySystem.LibrarySystem.entity.Review;
import com.LibrarySystem.LibrarySystem.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review addReview(@RequestBody Review review) {

        return reviewService.addReview(review);
    }

    @GetMapping("/book/{bookId}")
    public List<Review> getReviewsForBook(@PathVariable Long bookId) {

        return reviewService.getReviewsForBook(bookId);
    }
}
