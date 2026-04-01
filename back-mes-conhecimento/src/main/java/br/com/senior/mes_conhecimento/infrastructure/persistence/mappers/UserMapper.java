package br.com.senior.mes_conhecimento.infrastructure.persistence.mappers;

import br.com.senior.mes_conhecimento.domain.entities.User;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toDomain(UserEntity entity) {
        if (entity == null) return null;
        return new User(
                entity.getId(),
                entity.getEmail(),
                entity.getUsername(),
                entity.getPassword(),
                entity.getRole()
        );
    }

    public UserEntity toEntity(User domain) {
        if (domain == null) return null;
        return new UserEntity(
                domain.getId(),
                domain.getEmail(),
                domain.getUsername(),
                domain.getPassword(),
                domain.getRole()
        );
    }
}
