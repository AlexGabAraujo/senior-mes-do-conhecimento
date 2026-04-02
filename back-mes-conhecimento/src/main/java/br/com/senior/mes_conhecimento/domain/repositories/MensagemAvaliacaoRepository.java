package br.com.senior.mes_conhecimento.domain.repositories;

import br.com.senior.mes_conhecimento.domain.entities.MensagemAvaliacao;
import br.com.senior.mes_conhecimento.domain.enums.TipoAvaliacao;
import java.util.Optional;

/**
 * Interface de repositório para operações de persistência de avaliações de mensagens.
 */
public interface MensagemAvaliacaoRepository {

    /**
     * Persiste uma nova avaliação ou atualiza uma existente
     * @param avaliacao Avaliação a ser salva
     * @return Avaliação salva com ID gerado
     */
    MensagemAvaliacao save(MensagemAvaliacao avaliacao);

    /**
     * Busca a avaliação de um usuário para uma mensagem específica
     * @param mensagemId ID da mensagem
     * @param usuarioId  ID do usuário
     * @return Optional contendo a avaliação, se existir
     */
    Optional<MensagemAvaliacao> findByMensagemIdAndUsuarioId(Long mensagemId, Long usuarioId);

    /**
     * Remove a avaliação de um usuário para uma mensagem específica
     * @param mensagemId ID da mensagem
     * @param usuarioId  ID do usuário
     */
    void deleteByMensagemIdAndUsuarioId(Long mensagemId, Long usuarioId);

    /**
     * Conta o número de avaliações de um determinado tipo para uma mensagem
     * @param mensagemId ID da mensagem
     * @param tipo       Tipo de avaliação (LIKE ou DISLIKE)
     * @return Quantidade de avaliações do tipo informado
     */
    long countByMensagemIdAndTipo(Long mensagemId, TipoAvaliacao tipo);
}
