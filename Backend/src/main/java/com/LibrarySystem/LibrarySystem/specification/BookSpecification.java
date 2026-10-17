package com.LibrarySystem.LibrarySystem.specification;


import com.LibrarySystem.LibrarySystem.entity.Book;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<Book> hasCategory(String category){
        return (root, query, criteriaBuilder) -> category == null ? null : criteriaBuilder.equal(root.get("category"), category);
    }

    public static Specification<Book> hasMinRating(Double rating){
        return (root, query, criteriaBuilder) -> rating == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), rating);
    }

    public static Specification<Book> hasPriceLessThan(Double maxPrice){
        return (root, query, criteriaBuilder) -> maxPrice == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Book> searchByName(String keyword){
        return (root, query, criteriaBuilder) -> keyword == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }


}