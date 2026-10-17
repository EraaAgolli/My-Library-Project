package com.LibrarySystem.LibrarySystem.repository;

import com.LibrarySystem.LibrarySystem.entity.Order;
import com.LibrarySystem.LibrarySystem.entity.User;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    Optional<Order> findBySessionId(String sessionId);

}
