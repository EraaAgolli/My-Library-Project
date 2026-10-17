package com.LibrarySystem.LibrarySystem.service;


import com.LibrarySystem.LibrarySystem.dto.BookDTO;
import com.LibrarySystem.LibrarySystem.entity.Book;
import com.LibrarySystem.LibrarySystem.repository.BookRepository;
import com.LibrarySystem.LibrarySystem.specification.BookSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class BookService {


    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    public List<BookDTO> getBooks(){
        return bookRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public BookDTO getBookById(Long id){
        return bookRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(()-> new RuntimeException("Book not found"));
    }

    public List<String> getCategories(){
        return bookRepository.findDistinctCategories();
    }

    public List<String> getLanguages(){
        return bookRepository.findDistinctLanguages();
    }

    public List<String> getAudiencies(){
        return bookRepository.findDistinctAudiences();
    }

    public Page<BookDTO> getFilteredBooks(String category, Double rating, Double maxPrice, String search, Pageable pageable) {
        Specification<Book> specification = Specification.where(BookSpecification.hasCategory(category))
                .and(BookSpecification.hasMinRating(rating))
                .and(BookSpecification.hasPriceLessThan(maxPrice))
                .and(BookSpecification.searchByName(search));

        return bookRepository.findAll(specification, pageable).map(this::mapToDTO);
    }
    private BookDTO mapToDTO(Book book){
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setImageUrl(book.getImageUrl());
        dto.setCategory(book.getCategory());
        dto.setLanguage(book.getLanguage());
        dto.setAudience(book.getAudience());
        dto.setPrice(book.getPrice());
        dto.setBorrowPrice(book.getBorrowPrice());
        dto.setAvailableForBorrow(book.getAvailableForBorrow());
        dto.setRating(book.getRating());
        dto.setReviewsCount(book.getReviewsCount());
        dto.setDescription(book.getDescription());
        dto.setPages(book.getPages());
        dto.setPublishedDate(book.getPublishedDate());
        dto.setIsbn(book.getIsbn());
        dto.setPublisher(book.getPublisher());
        dto.setStock(book.getStock());
        return dto;
    }


}

