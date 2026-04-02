package br.com.senior.mes_conhecimento.infrastructure.persistence.mappers;

import br.com.senior.mes_conhecimento.domain.entities.ChatMessage;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.ChatMessageEntity;

/**
 * Mapper para conversão entre entidade de domínio ChatMessage e entidade JPA ChatMessageEntity.
 */
public class ChatMessageMapper {
    
    /**
     * Converte entidade JPA para entidade de domínio
     * @param entity Entidade JPA
     * @return Entidade de domínio
     */
    public static ChatMessage toDomain(ChatMessageEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return new ChatMessage(
            entity.getId(),
            entity.getLectureId(),
            entity.getUserId(),
            entity.getContent(),
            entity.getTimestamp(),
            entity.getMensagemPaiId()
        );
    }
    
    /**
     * Converte entidade de domínio para entidade JPA
     * @param domain Entidade de domínio
     * @return Entidade JPA
     */
    public static ChatMessageEntity toEntity(ChatMessage domain) {
        if (domain == null) {
            return null;
        }
        
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setId(domain.getId());
        entity.setLectureId(domain.getLectureId());
        entity.setUserId(domain.getUserId());
        entity.setContent(domain.getContent());
        entity.setTimestamp(domain.getTimestamp());
        entity.setMensagemPaiId(domain.getMensagemPaiId());
        
        return entity;
    }
}
