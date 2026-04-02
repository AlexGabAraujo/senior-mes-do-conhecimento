package br.com.senior.mes_conhecimento.application.dtos;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para resposta de mensagem de chat.
 * Inclui informações completas da mensagem, contadores de avaliação,
 * estado de avaliação do usuário autenticado e respostas aninhadas.
 */
public record ChatMessageResponseDTO(
    Long id,
    Long lectureId,
    Long userId,
    String username,
    String content,
    LocalDateTime timestamp,
    Long likeCount,
    Long dislikeCount,
    Boolean usuarioJaAvaliou,
    String tipoAvaliacaoUsuario,
    List<ChatMessageResponseDTO> respostas
) {}
