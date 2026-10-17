package com.LibrarySystem.LibrarySystem.controller;

import com.LibrarySystem.LibrarySystem.dto.CartResponse;
import com.LibrarySystem.LibrarySystem.dto.OrderDTO;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.service.CartService;
import com.LibrarySystem.LibrarySystem.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final CartService cartService;

    public CheckoutController(CheckoutService checkoutService, CartService cartService){
        this.checkoutService = checkoutService;
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<OrderDTO> initiateCheckout(@AuthenticationPrincipal User user){
        CartResponse cartResponse = cartService.getCart(user);
        return ResponseEntity.ok(checkoutService.initiateCheckout(user, cartResponse));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<OrderDTO> checkStatus(@PathVariable String sessionId){
        return ResponseEntity.ok(checkoutService.checkStatus(sessionId));
    }


}
