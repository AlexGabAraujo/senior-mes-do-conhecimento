package br.com.senior.mes_conhecimento.infrastructure.persistence.repositories;

import br.com.senior.mes_conhecimento.domain.entities.ChatMessage;
import br.com.senior.mes_conhecimento.domain.repositories.ChatMessageRepository;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.ChatMessageEntity;
import br.com.senior.mes_conhecimento.infrastructure.persistence.mappers.ChatMessageMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementação do repositório de domínio ChatMessageRepository.
 * Delega operações para o ChatMessageJpaRepository e realiza conversões entre camadas.
 */
@Repository
public class ChatMessageRepositoryImpl implements ChatMessageRepository {
    
    private final ChatMessageJpaRepository jpaRepository;
    
    public ChatMessageRepositoryImpl(ChatMessageJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public ChatMessage save(ChatMessage message) {
        ChatMessageEntity entity = ChatMessageMapper.toEntity(message);
        ChatMessageEntity saved = jpaRepository.save(entity);
        return ChatMessageMapper.toDomain(saved);
    }
    
    @Override
    public List<ChatMessage> findByLectureIdOrderByTimestampAsc(Long lectureId) {
        return jpaRepository.findByLectureIdOrderByTimestampAsc(lectureId)
            .stream()
            .map(ChatMessageMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ChatMessage> findGeneralChatMessagesOrderByTimestampAsc() {
        return jpaRepository.findGeneralChatMessagesOrderByTimestampAsc()
            .stream()
            .map(ChatMessageMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<ChatMessage> findByMensagemPaiIdOrderByTimestampAsc(Long mensagemPaiId) {
        return jpaRepository.findByMensagemPaiIdOrderByTimestampAsc(mensagemPaiId)
            .stream()
            .map(ChatMessageMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<ChatMessage> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ChatMessageMapper::toDomain);
    }
}
