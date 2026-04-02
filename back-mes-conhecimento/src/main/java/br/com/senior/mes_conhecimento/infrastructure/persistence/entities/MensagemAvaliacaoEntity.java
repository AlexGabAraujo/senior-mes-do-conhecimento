package br.com.senior.mes_conhecimento.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidade JPA para persistência de avaliações (like/dislike) de mensagens de chat.
 * Mapeia para a tabela mensagem_avaliacao no banco de dados.
 */
@Entity
@Table(name = "mensagem_avaliacao")
public class MensagemAvaliacaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID do usuário que realizou a avaliação */
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    /** ID da mensagem avaliada */
    @Column(name = "mensagem_id", nullable = false)
    private Long mensagemId;

    /** Tipo da avaliação: "LIKE" ou "DISLIKE" */
    @Column(nullable = false, length = 10)
    private String tipo;

    /** Data e hora em que a avaliação foi registrada */
    @Column(nullable = false)
    private LocalDateTime timestamp;

    /** Relacionamento lazy com o usuário (somente leitura) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", insertable = false, updatable = false)
    private UserEntity usuario;

    /** Relacionamento lazy com a mensagem de chat (somente leitura) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mensagem_id", insertable = false, updatable = false)
    private ChatMessageEntity mensagem;

    /** Construtor padrão exigido pelo JPA */
    public MensagemAvaliacaoEntity() {
    }

    /** Construtor completo sem os relacionamentos lazy */
    public MensagemAvaliacaoEntity(Long id, Long usuarioId, Long mensagemId, String tipo, LocalDateTime timestamp) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.mensagemId = mensagemId;
        this.tipo = tipo;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getMensagemId() {
        return mensagemId;
    }

    public void setMensagemId(Long mensagemId) {
        this.mensagemId = mensagemId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public UserEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UserEntity usuario) {
        this.usuario = usuario;
    }

    public ChatMessageEntity getMensagem() {
        return mensagem;
    }

    public void setMensagem(ChatMessageEntity mensagem) {
        this.mensagem = mensagem;
    }
}
