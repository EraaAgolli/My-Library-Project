package com.LibrarySystem.LibrarySystem.controller;

import com.LibrarySystem.LibrarySystem.dto.WishlistItemDTO;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService){
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<WishlistItemDTO>> getWishlist(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(wishlistService.getWishlist(user));
    }

    @PostMapping("/add/{bookId}")
    public ResponseEntity<Void> addItem(@AuthenticationPrincipal User user,
                                        @PathVariable Long bookId){
        wishlistService.addItem(user, bookId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal User user,
                                           @PathVariable Long bookId) {
        wishlistService.removeItem(user, bookId);
        return ResponseEntity.ok().build();
    }
}
