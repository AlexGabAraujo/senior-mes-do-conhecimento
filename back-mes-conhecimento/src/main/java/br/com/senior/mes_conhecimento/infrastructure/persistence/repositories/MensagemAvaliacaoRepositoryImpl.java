package br.com.senior.mes_conhecimento.infrastructure.persistence.repositories;

import br.com.senior.mes_conhecimento.domain.entities.MensagemAvaliacao;
import br.com.senior.mes_conhecimento.domain.enums.TipoAvaliacao;
import br.com.senior.mes_conhecimento.domain.repositories.MensagemAvaliacaoRepository;
import br.com.senior.mes_conhecimento.infrastructure.persistence.mappers.MensagemAvaliacaoMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Implementação do repositório de domínio MensagemAvaliacaoRepository.
 * Delega operações para o MensagemAvaliacaoJpaRepository e realiza conversões entre camadas.
 */
@Repository
public class MensagemAvaliacaoRepositoryImpl implements MensagemAvaliacaoRepository {

    private final MensagemAvaliacaoJpaRepository jpaRepository;

    public MensagemAvaliacaoRepositoryImpl(MensagemAvaliacaoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public MensagemAvaliacao save(MensagemAvaliacao avaliacao) {
        var entity = MensagemAvaliacaoMapper.toEntity(avaliacao);
        var saved = jpaRepository.save(entity);
        return MensagemAvaliacaoMapper.toDomain(saved);
    }

    @Override
    public Optional<MensagemAvaliacao> findByMensagemIdAndUsuarioId(Long mensagemId, Long usuarioId) {
        return jpaRepository.findByMensagemIdAndUsuarioId(mensagemId, usuarioId)
            .map(MensagemAvaliacaoMapper::toDomain);
    }

    @Override
    public void deleteByMensagemIdAndUsuarioId(Long mensagemId, Long usuarioId) {
        jpaRepository.deleteByMensagemIdAndUsuarioId(mensagemId, usuarioId);
    }

    @Override
    public long countByMensagemIdAndTipo(Long mensagemId, TipoAvaliacao tipo) {
        return jpaRepository.countByMensagemIdAndTipo(mensagemId, tipo.name());
    }
}
