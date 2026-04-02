package br.com.senior.mes_conhecimento.domain.entities;

import br.com.senior.mes_conhecimento.domain.enums.TipoAvaliacao;
import java.time.LocalDateTime;

/**
 * Entidade de domínio representando a avaliação (like/dislike) de uma mensagem de chat por um usuário.
 */
public class MensagemAvaliacao {

    /** Identificador único da avaliação */
    private Long id;

    /** ID do usuário que realizou a avaliação */
    private Long usuarioId;

    /** ID da mensagem avaliada */
    private Long mensagemId;

    /** Tipo da avaliação: LIKE ou DISLIKE */
    private TipoAvaliacao tipo;

    /** Data e hora em que a avaliação foi registrada */
    private LocalDateTime timestamp;

    public MensagemAvaliacao() {
    }

    public MensagemAvaliacao(Long id, Long usuarioId, Long mensagemId, TipoAvaliacao tipo, LocalDateTime timestamp) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.mensagemId = mensagemId;
        this.tipo = tipo;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public Long getMensagemId() {
        return mensagemId;
    }

    public TipoAvaliacao getTipo() {
        return tipo;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
