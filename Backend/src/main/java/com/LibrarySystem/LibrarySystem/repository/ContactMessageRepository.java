package com.LibrarySystem.LibrarySystem.repository;

import com.LibrarySystem.LibrarySystem.entity.ContactMessage;
import com.LibrarySystem.LibrarySystem.enums.ContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByStatus(ContactStatus status);
}
