package br.com.senior.mes_conhecimento.domain.entities;

import java.time.LocalDateTime;

/**
 * Entidade de Domínio representando uma Mensagem de Chat.
 * Suporta mensagens vinculadas a palestras específicas ou ao Chat Geral (lectureId NULL).
 * Suporta respostas encadeadas via mensagemPaiId (nullable).
 */
public class ChatMessage {
    private Long id;
    private Long lectureId;  // NULL para Chat Geral
    private Long userId;
    private String content;
    private LocalDateTime timestamp;
    /** ID da mensagem pai para respostas encadeadas; null se for mensagem raiz */
    private Long mensagemPaiId;

    public ChatMessage() {
    }

    public ChatMessage(Long id, Long lectureId, Long userId, String content, LocalDateTime timestamp) {
        this.id = id;
        this.lectureId = lectureId;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
        this.mensagemPaiId = null;
        validateContent();
    }

    public ChatMessage(Long id, Long lectureId, Long userId, String content, LocalDateTime timestamp, Long mensagemPaiId) {
        this.id = id;
        this.lectureId = lectureId;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
        this.mensagemPaiId = mensagemPaiId;
        validateContent();
    }

    /**
     * Valida que o conteúdo da mensagem não está vazio
     */
    private void validateContent() {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("O conteúdo da mensagem não pode estar vazio");
        }
    }

    /**
     * Verifica se esta mensagem pertence ao Chat Geral
     */
    public boolean isGeneralChat() {
        return lectureId == null;
    }

    /**
     * Verifica se esta mensagem foi enviada por um usuário específico
     */
    public boolean isFromUser(Long userId) {
        return this.userId != null && this.userId.equals(userId);
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLectureId() {
        return lectureId;
    }

    public void setLectureId(Long lectureId) {
        this.lectureId = lectureId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        validateContent();
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Long getMensagemPaiId() {
        return mensagemPaiId;
    }

    public void setMensagemPaiId(Long mensagemPaiId) {
        this.mensagemPaiId = mensagemPaiId;
    }
}
