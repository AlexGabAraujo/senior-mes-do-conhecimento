package br.com.senior.mes_conhecimento.application.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para requisição de resposta a uma mensagem de chat.
 */
public record ResponderMensagemRequestDTO(
    @NotBlank(message = "O conteúdo da resposta não pode estar vazio")
    String content
) {}
