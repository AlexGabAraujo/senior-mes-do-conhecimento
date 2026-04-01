package br.com.senior.mes_conhecimento.application.dtos;

public class TokenResponseDTO {
    private String token;

    // Default constructor
    public TokenResponseDTO() {}

    // Constructor with token
    public TokenResponseDTO(String token) {
        this.token = token;
    }

    // Getter and setter
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
