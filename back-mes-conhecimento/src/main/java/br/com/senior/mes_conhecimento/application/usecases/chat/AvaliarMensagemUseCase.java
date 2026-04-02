package br.com.senior.mes_conhecimento.application.usecases.chat;

import br.com.senior.mes_conhecimento.application.dtos.ChatMessageResponseDTO;
import br.com.senior.mes_conhecimento.domain.entities.MensagemAvaliacao;
import br.com.senior.mes_conhecimento.domain.enums.TipoAvaliacao;
import br.com.senior.mes_conhecimento.domain.repositories.ChatMessageRepository;
import br.com.senior.mes_conhecimento.domain.repositories.MensagemAvaliacaoRepository;
import br.com.senior.mes_conhecimento.domain.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

/**
 * Use Case para avaliar (like/dislike) uma mensagem de chat.
 * Suporta toggle: avaliar com o mesmo tipo remove a avaliação existente.
 */
@Service
public class AvaliarMensagemUseCase {

    private final ChatMessageRepository chatMessageRepository;
    private final MensagemAvaliacaoRepository avaliacaoRepository;
    private final UserRepository userRepository;

    public AvaliarMensagemUseCase(ChatMessageRepository chatMessageRepository,
                                  MensagemAvaliacaoRepository avaliacaoRepository,
                                  UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.userRepository = userRepository;
    }

    /**
     * Executa a avaliação de uma mensagem pelo usuário autenticado.
     * Comportamento de toggle: mesmo tipo remove a avaliação; tipo diferente substitui.
     *
     * @param mensagemId          ID da mensagem a ser avaliada
     * @param tipoStr             Tipo de avaliação em string ("LIKE" ou "DISLIKE")
     * @param authenticatedUserId ID do usuário autenticado
     * @return DTO atualizado da mensagem com novos contadores de avaliação
     */
    public ChatMessageResponseDTO execute(Long mensagemId, String tipoStr, Long authenticatedUserId) {
        // Verificar que a mensagem existe
        var mensagem = chatMessageRepository.findById(mensagemId)
            .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));

        // Verificar que o usuário existe
        var user = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Converter string para enum TipoAvaliacao
        TipoAvaliacao tipo = TipoAvaliacao.valueOf(tipoStr.toUpperCase());

        // Buscar avaliação existente do usuário para esta mensagem
        var avaliacaoExistente = avaliacaoRepository.findByMensagemIdAndUsuarioId(mensagemId, authenticatedUserId);

        if (avaliacaoExistente.isPresent()) {
            if (avaliacaoExistente.get().getTipo() == tipo) {
                // Mesmo tipo: toggle off — remover avaliação
                avaliacaoRepository.deleteByMensagemIdAndUsuarioId(mensagemId, authenticatedUserId);
            } else {
                // Tipo diferente: substituir avaliação
                avaliacaoRepository.deleteByMensagemIdAndUsuarioId(mensagemId, authenticatedUserId);
                var novaAvaliacao = new MensagemAvaliacao(null, authenticatedUserId, mensagemId, tipo, LocalDateTime.now());
                avaliacaoRepository.save(novaAvaliacao);
            }
        } else {
            // Sem avaliação prévia: criar nova
            var novaAvaliacao = new MensagemAvaliacao(null, authenticatedUserId, mensagemId, tipo, LocalDateTime.now());
            avaliacaoRepository.save(novaAvaliacao);
        }

        // Calcular contadores atualizados
        long likeCount = avaliacaoRepository.countByMensagemIdAndTipo(mensagemId, TipoAvaliacao.LIKE);
        long dislikeCount = avaliacaoRepository.countByMensagemIdAndTipo(mensagemId, TipoAvaliacao.DISLIKE);

        // Buscar estado atual da avaliação do usuário
        var avaliacaoAtual = avaliacaoRepository.findByMensagemIdAndUsuarioId(mensagemId, authenticatedUserId);
        boolean usuarioJaAvaliou = avaliacaoAtual.isPresent();
        String tipoAvaliacaoUsuario = avaliacaoAtual.map(a -> a.getTipo().name()).orElse(null);

        return new ChatMessageResponseDTO(
            mensagem.getId(),
            mensagem.getLectureId(),
            mensagem.getUserId(),
            user.getUsername(),
            mensagem.getContent(),
            mensagem.getTimestamp(),
            likeCount,
            dislikeCount,
            usuarioJaAvaliou,
            tipoAvaliacaoUsuario,
            Collections.emptyList()
        );
    }
}
