package br.com.senior.mes_conhecimento.web.controllers;

import br.com.senior.mes_conhecimento.application.dtos.LoginRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.RegisterRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.TokenResponseDTO;
import br.com.senior.mes_conhecimento.application.usecases.auth.LoginUserUseCase;
import br.com.senior.mes_conhecimento.application.usecases.auth.RegisterUserUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterUserUseCase registerUseCase;
    private final LoginUserUseCase loginUseCase;

    public AuthController(RegisterUserUseCase registerUseCase, LoginUserUseCase loginUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
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
}
