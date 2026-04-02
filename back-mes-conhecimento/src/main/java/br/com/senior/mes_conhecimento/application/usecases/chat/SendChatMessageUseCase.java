package br.com.senior.mes_conhecimento.application.usecases.chat;

import br.com.senior.mes_conhecimento.application.dtos.ChatMessageRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.ChatMessageResponseDTO;
import br.com.senior.mes_conhecimento.domain.entities.ChatMessage;
import br.com.senior.mes_conhecimento.domain.repositories.ChatMessageRepository;
import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Use Case para enviar uma nova mensagem de chat.
 * Valida a existência da palestra (se não for Chat Geral) e do usuário antes de persistir.
 */
@Service
public class SendChatMessageUseCase {
    
    private final ChatMessageRepository chatMessageRepository;
    private final LectureRepository lectureRepository;
    private final UserRepository userRepository;
    
    public SendChatMessageUseCase(ChatMessageRepository chatMessageRepository,
                                  LectureRepository lectureRepository,
                                  UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.lectureRepository = lectureRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Executa o envio de uma mensagem de chat
     * @param request DTO com lectureId (nullable) e content
     * @param authenticatedUserId ID do usuário autenticado
     * @return DTO com a mensagem criada
     */
    public ChatMessageResponseDTO execute(ChatMessageRequestDTO request, Long authenticatedUserId) {
        // Validação: se lectureId não é NULL, palestra deve existir
        if (request.lectureId() != null) {
            lectureRepository.findById(request.lectureId())
                .orElseThrow(() -> new RuntimeException("Palestra não encontrada"));
        }
        
        // Validação: usuário deve existir
        var user = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Criar mensagem de domínio com timestamp automático
        ChatMessage message = new ChatMessage(
            null,
            request.lectureId(),
            authenticatedUserId,
            request.content(),
            LocalDateTime.now()
        );
        
        // Persistir
        ChatMessage saved = chatMessageRepository.save(message);
        
        // Retornar DTO com contadores zerados (mensagem recém criada)
        return new ChatMessageResponseDTO(
            saved.getId(),
            saved.getLectureId(),
            saved.getUserId(),
            user.getUsername(),
            saved.getContent(),
            saved.getTimestamp(),
            0L,
            0L,
            false,
            null,
            java.util.Collections.emptyList()
        );
    }
}
