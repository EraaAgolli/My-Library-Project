package com.LibrarySystem.LibrarySystem.service;

import com.LibrarySystem.LibrarySystem.dto.CartResponse;
import com.LibrarySystem.LibrarySystem.dto.OrderDTO;
import com.LibrarySystem.LibrarySystem.dto.OrderItemDTO;
import com.LibrarySystem.LibrarySystem.entity.Book;
import com.LibrarySystem.LibrarySystem.entity.Order;
import com.LibrarySystem.LibrarySystem.entity.OrderItem;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.enums.OrderStatus;
import com.LibrarySystem.LibrarySystem.repository.OrderItemRepository;
import com.LibrarySystem.LibrarySystem.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CheckoutService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public CheckoutService(OrderRepository orderRepository, OrderItemRepository orderItemRepository){
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public OrderDTO initiateCheckout(User user, CartResponse cartResponse){
        Order order = new Order();
        order.setUser(user);
        order.setAmountTotal(cartResponse.getTotal());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        orderRepository.save(order);

        List<OrderItem> items = cartResponse.getItems().stream().map(i-> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(new Book(i.getBookId()));
            orderItem.setQuantity(i.getQuantity());
            orderItem.setBorrow(i.getBorrow());
            return  orderItem;
        }) .toList();
        orderItemRepository.saveAll(items);

        return mapToDTO(order, items);
    }

    public OrderDTO checkStatus(String sessionId){
        Order order = orderRepository.findBySessionId(sessionId)
                .orElseThrow(()-> new RuntimeException("Order not found"));
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        return mapToDTO(order, items);
    }

    private OrderDTO mapToDTO(Order order, List<OrderItem> items){
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setAmountTotal(order.getAmountTotal());
        dto.setCurrency(order.getCurrency());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(items.stream().map(i-> {
            OrderItemDTO orderItemDTO = new OrderItemDTO();
            orderItemDTO.setBookId(i.getBook().getId());
            orderItemDTO.setTitle(i.getBook().getTitle());
            orderItemDTO.setQuantity(i.getQuantity());
            orderItemDTO.setBorrow(i.getBorrow());
            orderItemDTO.setPrice(i.getBook().getPrice());
            return orderItemDTO;
        }).toList());
        return dto;
    }


}
