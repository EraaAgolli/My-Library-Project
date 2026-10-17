package com.LibrarySystem.LibrarySystem.repository;

import com.LibrarySystem.LibrarySystem.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> ,
        JpaSpecificationExecutor<Book> {

   @Query("SELECT DISTINCT book.category FROM Book book")
   List<String> findDistinctCategories();

   @Query("SELECT DISTINCT book.language FROM Book book")
   List<String> findDistinctLanguages();

   @Query("SELECT DISTINCT book.audience FROM Book book")
   List<String> findDistinctAudiences();


}
