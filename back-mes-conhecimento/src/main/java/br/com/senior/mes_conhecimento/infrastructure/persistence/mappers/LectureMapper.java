package br.com.senior.mes_conhecimento.infrastructure.persistence.mappers;

import br.com.senior.mes_conhecimento.domain.entities.Lecture;
import br.com.senior.mes_conhecimento.infrastructure.persistence.entities.LectureEntity;
import org.springframework.stereotype.Component;

@Component
public class LectureMapper {

    public Lecture toDomain(LectureEntity entity) {
        if (entity == null) return null;
        return new Lecture(
                entity.getId(),
                entity.getTitle(),
                entity.getSpeaker(),
                entity.getDescription(),
                entity.getTargetAudience(),
                entity.getDate(),
                java.time.LocalTime.parse(entity.getTime()),
                entity.getType(),
                entity.getSpeakerImagePath(),
                entity.getRegistrationUrl(),
                entity.isFinished()
        );
    }

    public LectureEntity toEntity(Lecture domain) {
        if (domain == null) return null;
        return new LectureEntity(
                domain.getId(),
                domain.getTitle(),
                domain.getSpeaker(),
                domain.getDescription(),
                domain.getTargetAudience(),
                domain.getDate(),
                domain.getTime() != null ? domain.getTime().toString() : null,
                domain.getType(),
                domain.getSpeakerImagePath(),
                domain.getRegistrationUrl(),
                domain.isFinished()
        );
    }
}
