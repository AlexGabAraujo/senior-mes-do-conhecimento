package br.com.senior.mes_conhecimento.application.usecases.lecture;

import br.com.senior.mes_conhecimento.application.dtos.LectureRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.LectureResponseDTO;
import br.com.senior.mes_conhecimento.domain.entities.Lecture;
import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class CreateLectureUseCase {

    private final LectureRepository repository;

    public CreateLectureUseCase(LectureRepository repository) {
        this.repository = repository;
    }

    public LectureResponseDTO execute(LectureRequestDTO dto) {
        Lecture lecture = new Lecture(
                null,
                dto.title(),
                dto.speaker(),
                dto.description(),
                dto.targetAudience(),
                dto.date(),
                LocalTime.parse(dto.time()),
                dto.type(),
                dto.speakerImagePath(),
                dto.registrationUrl(),
                dto.finished()
        );

        Lecture saved = repository.save(lecture);

        return new LectureResponseDTO(
                saved.getId(), saved.getTitle(), saved.getSpeaker(), saved.getDescription(),
                saved.getTargetAudience(), saved.getDate(),
                saved.getTime().toString(), saved.getType(),
                saved.getSpeakerImagePath(), saved.getRegistrationUrl(), saved.isFinished()
        );
    }
}
