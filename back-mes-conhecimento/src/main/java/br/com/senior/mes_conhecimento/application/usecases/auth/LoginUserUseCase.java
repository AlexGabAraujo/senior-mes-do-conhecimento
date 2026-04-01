package br.com.senior.mes_conhecimento.application.usecases.auth;

import br.com.senior.mes_conhecimento.application.dtos.LoginRequestDTO;
import br.com.senior.mes_conhecimento.domain.entities.User;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import br.com.senior.mes_conhecimento.infrastructure.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class LoginUserUseCase {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;

    public LoginUserUseCase(AuthenticationManager authenticationManager, TokenService tokenService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    public String execute(LoginRequestDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
        // O Authentication Manager usará o AuthService (UserDetailsService) e o PasswordEncoder configurados para validar no banco de dados.
        var auth = this.authenticationManager.authenticate(usernamePassword);

        // O principal será o UserDetails do Spring que passamos em AuthService. Precisamos da Entidade User para gerar o token com regras.
        // Já verificamos e existe, carregar do repo
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado após login"));

        return tokenService.generateToken(user);
    }
}
