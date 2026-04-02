package br.com.senior.mes_conhecimento.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidade JPA para persistência de mensagens de chat.
 * Mapeia para a tabela mensagem_chat no banco de dados.
 */
@Entity
@Table(name = "mensagem_chat", indexes = {
    @Index(name = "idx_mensagem_chat_lecture_timestamp", columnList = "lecture_id, timestamp"),
    @Index(name = "idx_mensagem_chat_user", columnList = "user_id")
})
public class ChatMessageEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "lecture_id")
    private Long lectureId;  // Nullable para Chat Geral
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;

    /** ID da mensagem pai para respostas encadeadas; null se for mensagem raiz */
    @Column(name = "mensagem_pai_id")
    private Long mensagemPaiId;
    
    // Relacionamentos lazy para evitar N+1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id", insertable = false, updatable = false)
    private LectureEntity lecture;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;

    /** Relacionamento com a mensagem pai (auto-referência) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mensagem_pai_id", insertable = false, updatable = false)
    private ChatMessageEntity mensagemPai;

    // Construtores
    public ChatMessageEntity() {
    }

    public ChatMessageEntity(Long id, Long lectureId, Long userId, String content, LocalDateTime timestamp) {
        this.id = id;
        this.lectureId = lectureId;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
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
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LectureEntity getLecture() {
        return lecture;
    }

    public void setLecture(LectureEntity lecture) {
        this.lecture = lecture;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public Long getMensagemPaiId() {
        return mensagemPaiId;
    }

    public void setMensagemPaiId(Long mensagemPaiId) {
        this.mensagemPaiId = mensagemPaiId;
    }

    public ChatMessageEntity getMensagemPai() {
        return mensagemPai;
    }

    public void setMensagemPai(ChatMessageEntity mensagemPai) {
        this.mensagemPai = mensagemPai;
    }
}
