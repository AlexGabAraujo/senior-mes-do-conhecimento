package br.com.senior.mes_conhecimento.application.usecases.chat;

import br.com.senior.mes_conhecimento.application.dtos.ChatMessageResponseDTO;
import br.com.senior.mes_conhecimento.domain.entities.ChatMessage;
import br.com.senior.mes_conhecimento.domain.repositories.ChatMessageRepository;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

/**
 * Use Case para responder a uma mensagem de chat existente.
 * Valida que a mensagem pai existe e que não é uma resposta (apenas um nível de aninhamento).
 */
@Service
public class ResponderMensagemUseCase {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ResponderMensagemUseCase(ChatMessageRepository chatMessageRepository,
                                    UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    /**
     * Executa a criação de uma resposta a uma mensagem pai.
     *
     * @param mensagemPaiId       ID da mensagem pai
     * @param content             Conteúdo da resposta
     * @param authenticatedUserId ID do usuário autenticado
     * @return DTO da resposta criada
     */
    public ChatMessageResponseDTO execute(Long mensagemPaiId, String content, Long authenticatedUserId) {
        // Buscar mensagem pai — deve existir
        var mensagemPai = chatMessageRepository.findById(mensagemPaiId)
            .orElseThrow(() -> new RuntimeException("Mensagem pai não encontrada"));

        // Validar que a mensagem pai não é uma resposta (apenas um nível de aninhamento)
        if (mensagemPai.getMensagemPaiId() != null) {
            throw new RuntimeException("Não é possível responder a uma resposta. Apenas mensagens raiz aceitam respostas.");
        }

        // Buscar usuário autenticado
        var user = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Criar entidade de resposta herdando o lectureId da mensagem pai
        var resposta = new ChatMessage(
            null,
            mensagemPai.getLectureId(),
            authenticatedUserId,
            content,
            LocalDateTime.now(),
            mensagemPaiId
        );

        // Persistir resposta
        var salva = chatMessageRepository.save(resposta);

        return new ChatMessageResponseDTO(
            salva.getId(),
            salva.getLectureId(),
            salva.getUserId(),
            user.getUsername(),
            salva.getContent(),
            salva.getTimestamp(),
            0L,
            0L,
            false,
            null,
            Collections.emptyList()
        );
    }
}
