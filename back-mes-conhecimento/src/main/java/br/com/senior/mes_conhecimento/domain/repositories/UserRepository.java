package br.com.senior.mes_conhecimento.domain.repositories;

import br.com.senior.mes_conhecimento.domain.entities.User;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    User save(User user);
}
