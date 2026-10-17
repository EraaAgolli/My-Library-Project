package com.LibrarySystem.LibrarySystem.controller;


import com.LibrarySystem.LibrarySystem.dto.BookDTO;
import com.LibrarySystem.LibrarySystem.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService){
        this.bookService = bookService;
    }



    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBook(@PathVariable Long id){
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories(){
        return ResponseEntity.ok(bookService.getCategories());
    }

    @GetMapping("/languages")
    public ResponseEntity<List<String>> getLanguages(){
        return ResponseEntity.ok(bookService.getLanguages());
    }

    @GetMapping("/audience")
    public ResponseEntity<List<String>> getAudiences(){

        return  ResponseEntity.ok(bookService.getAudiencies());}

    @GetMapping
    public ResponseEntity<Page<BookDTO>> getBooks (
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String [] sort
    ) {
        Pageable pageable = PageRequest.of(page,size, Sort.by(sort[0]).ascending());
        if (sort[1].equalsIgnoreCase("desc")){
            pageable = PageRequest.of(page,size,Sort.by(sort[0]).descending());
        }
        return ResponseEntity.ok(bookService.getFilteredBooks(category,minRating,maxPrice,search,pageable));
    }
    }







