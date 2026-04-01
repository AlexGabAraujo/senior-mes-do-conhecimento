package br.com.senior.mes_conhecimento.infrastructure.persistence.repositories;

import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.LectureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureJpaRepository extends JpaRepository<LectureEntity, Long>, JpaSpecificationExecutor<LectureEntity> {
}
