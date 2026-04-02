package br.com.senior.mes_conhecimento.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para requisição de envio de mensagem de chat.
 */
public record ChatMessageRequestDTO(
    Long lectureId,  // NULL para Chat Geral
    
    @NotBlank(message = "O conteúdo da mensagem não pode estar vazio")
    @Size(max = 2000, message = "O conteúdo da mensagem não pode exceder 2000 caracteres")
    String content
) {}
