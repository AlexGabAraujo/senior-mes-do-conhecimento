package br.com.senior.mes_conhecimento.infrastructure.persistence.repositories;

import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório JPA para operações de persistência de mensagens de chat.
 */
@Repository
public interface ChatMessageJpaRepository extends JpaRepository<ChatMessageEntity, Long> {
    
    /**
     * Busca todas as mensagens de uma palestra específica, ordenadas por timestamp crescente
     * @param lectureId ID da palestra
     * @return Lista de mensagens ordenadas cronologicamente
     */
    List<ChatMessageEntity> findByLectureIdOrderByTimestampAsc(Long lectureId);
    
    /**
     * Busca todas as mensagens do Chat Geral (lectureId NULL), ordenadas por timestamp crescente
     * @return Lista de mensagens do Chat Geral ordenadas cronologicamente
     */
    @Query("SELECT c FROM ChatMessageEntity c WHERE c.lectureId IS NULL ORDER BY c.timestamp ASC")
    List<ChatMessageEntity> findGeneralChatMessagesOrderByTimestampAsc();

    /**
     * Busca todas as respostas de uma mensagem pai, ordenadas por timestamp crescente
     * @param mensagemPaiId ID da mensagem pai
     * @return Lista de respostas ordenadas cronologicamente
     */
    List<ChatMessageEntity> findByMensagemPaiIdOrderByTimestampAsc(Long mensagemPaiId);
}
