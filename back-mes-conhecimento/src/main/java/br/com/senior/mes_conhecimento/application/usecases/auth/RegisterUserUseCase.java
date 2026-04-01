package br.com.senior.mes_conhecimento.application.usecases.auth;

import br.com.senior.mes_conhecimento.application.dtos.RegisterRequestDTO;
import br.com.senior.mes_conhecimento.domain.entities.User;
import br.com.senior.mes_conhecimento.domain.enums.UserRole;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterUserUseCase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void execute(RegisterRequestDTO dto) {
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }
        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new IllegalArgumentException("Username já está em uso.");
        }

        String encodedPassword = passwordEncoder.encode(dto.password());
        User newUser = new User(null, dto.email(), dto.username(), encodedPassword, UserRole.USER);
        userRepository.save(newUser);
    }
}
