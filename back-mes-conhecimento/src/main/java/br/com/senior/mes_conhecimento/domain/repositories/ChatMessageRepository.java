package br.com.senior.mes_conhecimento.domain.repositories;

import br.com.senior.mes_conhecimento.domain.entities.ChatMessage;
import java.util.List;
import java.util.Optional;

/**
 * Interface de repositório para operações de persistência de mensagens de chat.
 */
public interface ChatMessageRepository {
    
    /**
     * Persiste uma nova mensagem de chat ou atualiza uma existente
     * @param message Mensagem a ser salva
     * @return Mensagem salva com ID gerado
     */
    ChatMessage save(ChatMessage message);
    
    /**
     * Busca todas as mensagens de uma palestra específica, ordenadas por timestamp crescente
     * @param lectureId ID da palestra
     * @return Lista de mensagens ordenadas cronologicamente
     */
    List<ChatMessage> findByLectureIdOrderByTimestampAsc(Long lectureId);
    
    /**
     * Busca todas as mensagens do Chat Geral (lectureId NULL), ordenadas por timestamp crescente
     * @return Lista de mensagens do Chat Geral ordenadas cronologicamente
     */
    List<ChatMessage> findGeneralChatMessagesOrderByTimestampAsc();

    /**
     * Busca todas as respostas de uma mensagem pai, ordenadas por timestamp crescente
     * @param mensagemPaiId ID da mensagem pai
     * @return Lista de respostas ordenadas cronologicamente
     */
    List<ChatMessage> findByMensagemPaiIdOrderByTimestampAsc(Long mensagemPaiId);

    /**
     * Busca uma mensagem pelo seu ID
     * @param id ID da mensagem
     * @return Optional contendo a mensagem, se encontrada
     */
    Optional<ChatMessage> findById(Long id);
}
