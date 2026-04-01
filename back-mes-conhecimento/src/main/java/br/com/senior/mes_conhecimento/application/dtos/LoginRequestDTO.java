package br.com.senior.mes_conhecimento.application.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class LoginRequestDTO {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;

    // Default constructor
    public LoginRequestDTO() {}

    // Constructor with all fields
    public LoginRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
