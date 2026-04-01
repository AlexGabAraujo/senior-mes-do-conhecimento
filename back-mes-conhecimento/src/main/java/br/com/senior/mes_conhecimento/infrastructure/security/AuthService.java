package br.com.senior.mes_conhecimento.infrastructure.security;

import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.UserEntity;
import br.com.senior.mes_conhecimento.infrastructure.persistence.repositories.UserJpaRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService implements UserDetailsService {

    private final UserJpaRepository repository;

    public AuthService(UserJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Usa o JPA Repo para carregar do banco mais rapido do que mapear pro de dominio atoa no userDetailsService
        UserEntity user = repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
