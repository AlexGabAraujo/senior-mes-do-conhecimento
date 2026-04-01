package br.com.senior.mes_conhecimento.web.controllers;

import br.com.senior.mes_conhecimento.application.dtos.LoginRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.RegisterRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.TokenResponseDTO;
import br.com.senior.mes_conhecimento.application.usecases.auth.LoginUserUseCase;
import br.com.senior.mes_conhecimento.application.usecases.auth.RegisterUserUseCase;
import br.com.senior.mes_conhecimento.domain.entities.User;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterUserUseCase registerUseCase;
    private final LoginUserUseCase loginUseCase;
    private final UserRepository userRepository;

    public AuthController(RegisterUserUseCase registerUseCase, LoginUserUseCase loginUseCase, UserRepository userRepository) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid LoginRequestDTO body) {
        String token = loginUseCase.execute(body);
        return ResponseEntity.ok(new TokenResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequestDTO body) {
        registerUseCase.execute(body);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Usuário não autenticado");
        }
        
        // O principal é o próprio User (definido no SecurityFilter)
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(user);
    }
}
