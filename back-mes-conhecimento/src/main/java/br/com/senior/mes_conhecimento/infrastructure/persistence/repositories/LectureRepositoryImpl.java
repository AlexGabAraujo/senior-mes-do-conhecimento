package br.com.senior.mes_conhecimento.infrastructure.persistence.repositories;

import br.com.senior.mes_conhecimento.domain.entities.Lecture;
import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.LectureEntity;
import br.com.senior.mes_conhecimento.infrastructure.persistence.mappers.LectureMapper;
import br.com.senior.mes_conhecimento.infrastructure.persistence.specifications.LectureSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LectureRepositoryImpl implements LectureRepository {

    private final LectureJpaRepository jpaRepository;
    private final LectureMapper mapper;

    public LectureRepositoryImpl(LectureJpaRepository jpaRepository, LectureMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Lecture> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Page<Lecture> findAllWithFilters(LectureType type, Boolean finished, Pageable pageable) {
        Specification<LectureEntity> spec = LectureSpecification.withFilters(type, finished);
        Page<LectureEntity> entityPage = jpaRepository.findAll(spec, pageable);
        return entityPage.map(mapper::toDomain);
    }

    @Override
    public Lecture save(Lecture lecture) {
        LectureEntity entity = mapper.toEntity(lecture);
        LectureEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
