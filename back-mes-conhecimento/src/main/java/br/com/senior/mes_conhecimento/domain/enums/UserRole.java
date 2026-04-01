package br.com.senior.mes_conhecimento.domain.enums;

/**
 * Papéis de usuário no sistema.
 */
public enum UserRole {
    ADMIN("ADMIN"),
    USER("USER");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
