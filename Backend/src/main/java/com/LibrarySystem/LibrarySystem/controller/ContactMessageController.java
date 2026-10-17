package com.LibrarySystem.LibrarySystem.controller;

import com.LibrarySystem.LibrarySystem.dto.ContactRequest;
import com.LibrarySystem.LibrarySystem.dto.ContactResponse;
import com.LibrarySystem.LibrarySystem.dto.FaqDTO;
import com.LibrarySystem.LibrarySystem.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/contact")
public class ContactMessageController {

        private  final ContactService contactMessageService;

        public ContactMessageController(ContactService contactMessageService){
            this.contactMessageService = contactMessageService;
        }

        @PostMapping
    public ResponseEntity<ContactResponse> submitMessage(@RequestBody ContactRequest request){
            return ResponseEntity.ok(contactMessageService.submitMessage(request));
        }

        @GetMapping("/faqs")
    public ResponseEntity<List<FaqDTO>> getFAQs(){
            return ResponseEntity.ok(contactMessageService.getFAQs());
        }
    }

