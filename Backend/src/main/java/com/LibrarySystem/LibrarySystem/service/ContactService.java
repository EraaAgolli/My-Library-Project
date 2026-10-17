package com.LibrarySystem.LibrarySystem.service;

import com.LibrarySystem.LibrarySystem.dto.ContactRequest;
import com.LibrarySystem.LibrarySystem.dto.ContactResponse;
import com.LibrarySystem.LibrarySystem.dto.FaqDTO;
import com.LibrarySystem.LibrarySystem.entity.ContactMessage;
import com.LibrarySystem.LibrarySystem.entity.FAQ;
import com.LibrarySystem.LibrarySystem.enums.ContactStatus;
import com.LibrarySystem.LibrarySystem.repository.ContactMessageRepository;
import com.LibrarySystem.LibrarySystem.repository.FaqRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactService {
    private final ContactMessageRepository contactMessageRepository;
    private final FaqRepository faqRepository;

    public ContactService(ContactMessageRepository contactMessageRepository, FaqRepository faqRepository) {
        this.contactMessageRepository = contactMessageRepository;
        this.faqRepository = faqRepository;
    }

    public ContactResponse submitMessage(ContactRequest request){
        ContactMessage contactMessage = new ContactMessage();
        contactMessage.setName(request.getName());
        contactMessage.setEmail(request.getEmail());
        contactMessage.setSubject(request.getSubject());
        contactMessage.setMessage(request.getMessage());
        contactMessage.setCreatedAt(LocalDateTime.now());
        contactMessage.setStatus(ContactStatus.NEW);
        contactMessageRepository.save(contactMessage);

        ContactResponse response = new ContactResponse();
        response.setStatus("NEW");
        response.setMessage("Your message has been received.We will get back to you soon.");
        return response;
    }

    public List<FaqDTO> getFAQs(){
        return faqRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    private FaqDTO mapToDTO(FAQ faq){
        FaqDTO dto = new FaqDTO();
        dto.setId(faq.getId());
        dto.setQuestion(faq.getQuestion());
        dto.setAnswer(faq.getAnswer());
        return dto;
    }




}
