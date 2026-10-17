package com.LibrarySystem.LibrarySystem.service;

import com.LibrarySystem.LibrarySystem.dto.CartItemDTO;
import com.LibrarySystem.LibrarySystem.dto.CartResponse;
import com.LibrarySystem.LibrarySystem.entity.Book;
import com.LibrarySystem.LibrarySystem.entity.CartItem;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.repository.BookRepository;
import com.LibrarySystem.LibrarySystem.repository.CartItemRepository;
import com.LibrarySystem.LibrarySystem.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;


    public CartService(CartItemRepository cartItemRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;

    }

    public CartResponse getCart(User user){
        List<CartItemDTO> items = cartItemRepository.findByUser(user).stream()
                .map(this::mapToDTO).toList();
        double total = items.stream().mapToDouble(i-> i.getPrice() * i.getQuantity()).sum();
        CartResponse response = new CartResponse();
        response.setItems(items);
        response.setTotal(total);
        return response;
    }

    public void addItem(User user, Long bookId, int quantity, boolean isBorrow){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new RuntimeException("Book not found"));
        CartItem item = cartItemRepository.findByUserAndBook(user,book)
                .orElse(new CartItem());
        item.setUser(user);
        item.setBook(book);
        item.setQuantity(quantity);
        item.setBorrow(isBorrow);
        cartItemRepository.save(item);
    }

    public void removeItem(User user, Long bookId){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new RuntimeException("Book not found"));
        cartItemRepository.deleteByUserAndBook(user, book);
    }

    private CartItemDTO mapToDTO(CartItem item){
        CartItemDTO dto = new CartItemDTO();
        dto.setBookId(item.getBook().getId());
        dto.setTitle(item.getBook().getTitle());
        dto.setQuantity(item.getQuantity());
        dto.setBorrow(item.getBorrow());
        dto.setPrice(item.getBook().getPrice());
        return dto;
    }
}



