package br.com.senior.mes_conhecimento.infrastructure.persistence.mappers;

import br.com.senior.mes_conhecimento.domain.entities.MensagemAvaliacao;
import br.com.senior.mes_conhecimento.domain.enums.TipoAvaliacao;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.MensagemAvaliacaoEntity;

/**
 * Mapper para conversão entre entidade de domínio MensagemAvaliacao e entidade JPA MensagemAvaliacaoEntity.
 */
public class MensagemAvaliacaoMapper {

    /** Construtor privado — classe utilitária, não deve ser instanciada */
    private MensagemAvaliacaoMapper() {
    }

    /**
     * Converte entidade JPA para entidade de domínio
     * @param entity Entidade JPA
     * @return Entidade de domínio
     */
    public static MensagemAvaliacao toDomain(MensagemAvaliacaoEntity entity) {
        if (entity == null) {
            return null;
        }

        return new MensagemAvaliacao(
            entity.getId(),
            entity.getUsuarioId(),
            entity.getMensagemId(),
            TipoAvaliacao.valueOf(entity.getTipo()),
            entity.getTimestamp()
        );
    }

    /**
     * Converte entidade de domínio para entidade JPA
     * @param domain Entidade de domínio
     * @return Entidade JPA
     */
    public static MensagemAvaliacaoEntity toEntity(MensagemAvaliacao domain) {
        if (domain == null) {
            return null;
        }

        return new MensagemAvaliacaoEntity(
            domain.getId(),
            domain.getUsuarioId(),
            domain.getMensagemId(),
            domain.getTipo().name(),
            domain.getTimestamp()
        );
    }
}
