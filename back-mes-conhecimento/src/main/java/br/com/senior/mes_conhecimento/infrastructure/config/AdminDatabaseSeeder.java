package br.com.senior.mes_conhecimento.infrastructure.config;

import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.UserEntity;
import br.com.senior.mes_conhecimento.infrastructure.persistence.repositories.UserJpaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDatabaseSeeder {

    @Bean
    public CommandLineRunner resetAdminPassword(UserJpaRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@ucs.br").ifPresent(admin -> {
                // Ao recriar as tabelas pelo flyway, a string estática será carregada.
                // Mas, vamos garantir que a aplicação saiba gerar o verificador hasheando de verdade:
                if (!passwordEncoder.matches("root", admin.getPassword())) {
                     // Substitui o dummy hash do arquivo V1 ou um hash anterior quebrado pelo hash gerado em runtime local.
                     // Criptografa 'root' em BCrypt validado nativo do Spring e atualiza (Pois o Flyway tem um hash 'fictício')
                     admin.setPassword(passwordEncoder.encode("root"));
                     userRepository.save(admin);
                }
            });
        };
    }
}
