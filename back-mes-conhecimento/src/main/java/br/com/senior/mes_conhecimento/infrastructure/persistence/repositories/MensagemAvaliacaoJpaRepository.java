package br.com.senior.mes_conhecimento.infrastructure.persistence.repositories;

import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.MensagemAvaliacaoEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório JPA para operações de persistência de avaliações de mensagens.
 */
@Repository
public interface MensagemAvaliacaoJpaRepository extends JpaRepository<MensagemAvaliacaoEntity, Long> {

    /**
     * Busca a avaliação de um usuário para uma mensagem específica
     * @param mensagemId ID da mensagem
     * @param usuarioId  ID do usuário
     * @return Optional contendo a avaliação, se existir
     */
    Optional<MensagemAvaliacaoEntity> findByMensagemIdAndUsuarioId(Long mensagemId, Long usuarioId);

    /**
     * Remove a avaliação de um usuário para uma mensagem específica
     * @param mensagemId ID da mensagem
     * @param usuarioId  ID do usuário
     */
    @Transactional
    @Modifying
    void deleteByMensagemIdAndUsuarioId(Long mensagemId, Long usuarioId);

    /**
     * Conta o número de avaliações de um determinado tipo para uma mensagem
     * @param mensagemId ID da mensagem
     * @param tipo       Tipo de avaliação como String ("LIKE" ou "DISLIKE")
     * @return Quantidade de avaliações do tipo informado
     */
    long countByMensagemIdAndTipo(Long mensagemId, String tipo);
}
