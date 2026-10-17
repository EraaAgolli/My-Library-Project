package com.LibrarySystem.LibrarySystem.controller;


import com.LibrarySystem.LibrarySystem.dto.CartResponse;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService){
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal User user,
                                        @RequestParam Long bookId,
                                        @RequestParam int quantity,
                                        @RequestParam boolean isBorrow){
        cartService.addItem(user, bookId, quantity, isBorrow);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal User user,
                                           @PathVariable Long bookId) {
        cartService.removeItem(user, bookId);
        return ResponseEntity.ok().build();
    }


}
