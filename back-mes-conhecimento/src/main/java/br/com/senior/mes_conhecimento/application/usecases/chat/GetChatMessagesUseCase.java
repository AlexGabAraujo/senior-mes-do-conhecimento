package br.com.senior.mes_conhecimento.application.usecases.chat;

import br.com.senior.mes_conhecimento.application.dtos.ChatMessageResponseDTO;
import br.com.senior.mes_conhecimento.domain.entities.ChatMessage;
import br.com.senior.mes_conhecimento.domain.enums.TipoAvaliacao;
import br.com.senior.mes_conhecimento.domain.repositories.ChatMessageRepository;
import br.com.senior.mes_conhecimento.domain.repositories.MensagemAvaliacaoRepository;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Use Case para recuperar mensagens de chat.
 * Suporta busca de mensagens de palestras específicas ou do Chat Geral.
 * Retorna apenas mensagens raiz com respostas aninhadas e dados de avaliação.
 */
@Service
public class GetChatMessagesUseCase {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final MensagemAvaliacaoRepository avaliacaoRepository;

    public GetChatMessagesUseCase(ChatMessageRepository chatMessageRepository,
                                  UserRepository userRepository,
                                  MensagemAvaliacaoRepository avaliacaoRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    /**
     * Busca mensagens raiz de uma palestra específica com respostas aninhadas
     * @param lectureId           ID da palestra
     * @param authenticatedUserId ID do usuário autenticado
     * @return Lista de mensagens raiz com respostas e dados de avaliação
     */
    public List<ChatMessageResponseDTO> execute(Long lectureId, Long authenticatedUserId) {
        var messages = chatMessageRepository.findByLectureIdOrderByTimestampAsc(lectureId);
        return montarMensagensRaiz(messages, authenticatedUserId);
    }

    /**
     * Busca mensagens raiz do Chat Geral com respostas aninhadas
     * @param authenticatedUserId ID do usuário autenticado
     * @return Lista de mensagens raiz do Chat Geral com respostas e dados de avaliação
     */
    public List<ChatMessageResponseDTO> executeForGeneralChat(Long authenticatedUserId) {
        var messages = chatMessageRepository.findGeneralChatMessagesOrderByTimestampAsc();
        return montarMensagensRaiz(messages, authenticatedUserId);
    }

    /**
     * Filtra apenas mensagens raiz e monta o DTO com respostas aninhadas
     */
    private List<ChatMessageResponseDTO> montarMensagensRaiz(List<ChatMessage> messages, Long authenticatedUserId) {
        return messages.stream()
            .filter(msg -> msg.getMensagemPaiId() == null)
            .map(msg -> montarDTO(msg, authenticatedUserId, true))
            .collect(Collectors.toList());
    }

    /**
     * Monta o ChatMessageResponseDTO para uma mensagem, incluindo respostas se solicitado
     * @param msg                 Mensagem de domínio
     * @param authenticatedUserId ID do usuário autenticado
     * @param incluirRespostas    Se verdadeiro, busca e aninha as respostas
     * @return DTO completo da mensagem
     */
    private ChatMessageResponseDTO montarDTO(ChatMessage msg, Long authenticatedUserId, boolean incluirRespostas) {
        var user = userRepository.findById(msg.getUserId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        long likeCount = avaliacaoRepository.countByMensagemIdAndTipo(msg.getId(), TipoAvaliacao.LIKE);
        long dislikeCount = avaliacaoRepository.countByMensagemIdAndTipo(msg.getId(), TipoAvaliacao.DISLIKE);

        var avaliacaoOpt = avaliacaoRepository.findByMensagemIdAndUsuarioId(msg.getId(), authenticatedUserId);
        boolean usuarioJaAvaliou = avaliacaoOpt.isPresent();
        String tipoAvaliacaoUsuario = avaliacaoOpt.map(a -> a.getTipo().name()).orElse(null);

        // Buscar respostas aninhadas (apenas um nível de profundidade)
        List<ChatMessageResponseDTO> respostas = Collections.emptyList();
        if (incluirRespostas) {
            var respostasEntidade = chatMessageRepository.findByMensagemPaiIdOrderByTimestampAsc(msg.getId());
            respostas = respostasEntidade.stream()
                .map(resp -> montarDTO(resp, authenticatedUserId, false))
                .collect(Collectors.toList());
        }

        return new ChatMessageResponseDTO(
            msg.getId(),
            msg.getLectureId(),
            msg.getUserId(),
            user.getUsername(),
            msg.getContent(),
            msg.getTimestamp(),
            likeCount,
            dislikeCount,
            usuarioJaAvaliou,
            tipoAvaliacaoUsuario,
            respostas
        );
    }
}
