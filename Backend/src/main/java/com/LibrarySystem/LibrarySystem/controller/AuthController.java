package com.LibrarySystem.LibrarySystem.controller;

import com.LibrarySystem.LibrarySystem.dto.AuthResponse;
import com.LibrarySystem.LibrarySystem.dto.LoginRequest;
import com.LibrarySystem.LibrarySystem.dto.RegisterRequest;
import com.LibrarySystem.LibrarySystem.dto.UserDTO;
import com.LibrarySystem.LibrarySystem.entity.User;
import com.LibrarySystem.LibrarySystem.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;


    public AuthController(AuthService authService){

        this.authService = authService;

    }

  @PostMapping("/login")
     public ResponseEntity<AuthResponse> login (@RequestBody LoginRequest request){
       return ResponseEntity.ok(authService.login(request));
  }

  @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
  }

  @GetMapping("/me")
    public ResponseEntity<UserDTO> me(){
      User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      return ResponseEntity.ok(mapToDTO(user));
  }

    private UserDTO mapToDTO(User user){
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}

