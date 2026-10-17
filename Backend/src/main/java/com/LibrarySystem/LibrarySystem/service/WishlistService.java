package com.LibrarySystem.LibrarySystem.service;


import com.LibrarySystem.LibrarySystem.dto.WishlistItemDTO;
import com.LibrarySystem.LibrarySystem.entity.Book;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.entity.WishlistItem;
import com.LibrarySystem.LibrarySystem.repository.BookRepository;
import com.LibrarySystem.LibrarySystem.repository.UserRepository;
import com.LibrarySystem.LibrarySystem.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {


    private final WishlistItemRepository wishlistRepository;

    private final BookRepository bookRepository;

    public WishlistService(WishlistItemRepository wishlistRepository,BookRepository bookRepository){
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
    }

    public List<WishlistItemDTO> getWishlist(User user){
        return wishlistRepository.findByUser(user).stream()
                .map(this::mapToDTO).toList();
    }

    public void addItem(User user, Long bookId){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new RuntimeException("Book not found"));
        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setBook(book);
        wishlistRepository.save(item);
    }

    public void  removeItem(User user, Long bookId){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new RuntimeException("Book not found"));
        wishlistRepository.deleteByUserAndBook(user, book);
    }

    private WishlistItemDTO mapToDTO(WishlistItem item){
        WishlistItemDTO dto = new WishlistItemDTO();
        dto.setBookId(item.getBook().getId());
        dto.setTitle(item.getBook().getTitle());
        dto.setAuthor(item.getBook().getAuthor());
        dto.setImageUrl(item.getBook().getImageUrl());
        return dto;
    }


}


