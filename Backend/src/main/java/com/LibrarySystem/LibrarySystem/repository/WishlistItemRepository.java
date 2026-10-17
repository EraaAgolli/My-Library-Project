package com.LibrarySystem.LibrarySystem.repository;

import com.LibrarySystem.LibrarySystem.entity.Book;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUser(User user);

   Optional<WishlistItem> findByUserAndBook(User user, Book book);

   void deleteByUserAndBook(User user,Book book);
}
