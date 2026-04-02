package br.com.senior.mes_conhecimento.application.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para requisição de avaliação de uma mensagem de chat.
 */
public record AvaliarMensagemRequestDTO(
    @NotBlank(message = "O tipo de avaliação não pode estar vazio")
    String tipo
) {}
