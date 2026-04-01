package br.com.senior.mes_conhecimento.domain.entities;

import br.com.senior.mes_conhecimento.domain.enums.UserRole;

/**
 * Entidade de Domínio representando um Usuário do sistema.
 */
public class User {

    private Long id;
    private String email;
    private String username;
    private String password;
    private UserRole role;

    public User(Long id, String email, String username, String password, UserRole role) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Regras de negócio poderiam ser adicionadas aqui
    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
