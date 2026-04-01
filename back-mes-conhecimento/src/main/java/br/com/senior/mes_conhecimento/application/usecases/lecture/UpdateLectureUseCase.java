package br.com.senior.mes_conhecimento.application.usecases.lecture;

import br.com.senior.mes_conhecimento.application.dtos.LectureRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.LectureResponseDTO;
import br.com.senior.mes_conhecimento.domain.entities.Lecture;
import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class UpdateLectureUseCase {

    private final LectureRepository repository;

    public UpdateLectureUseCase(LectureRepository repository) {
        this.repository = repository;
    }

    public LectureResponseDTO execute(Long id, LectureRequestDTO dto) {
        Lecture lecture = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Palestra não encontrada"));

        lecture.setTitle(dto.title());
        lecture.setSpeaker(dto.speaker());
        lecture.setDescription(dto.description());
        lecture.setTargetAudience(dto.targetAudience());
        lecture.setDate(dto.date());
        lecture.setTime(LocalTime.parse(dto.time()));
        lecture.setType(dto.type());
        lecture.setSpeakerImagePath(dto.speakerImagePath());
        lecture.setRegistrationUrl(dto.registrationUrl());
        lecture.setFinished(dto.finished());

        Lecture saved = repository.save(lecture);

        return new LectureResponseDTO(
                saved.getId(), saved.getTitle(), saved.getSpeaker(), saved.getDescription(),
                saved.getTargetAudience(), saved.getDate(),
                saved.getTime().toString(), saved.getType(),
                saved.getSpeakerImagePath(), saved.getRegistrationUrl(), saved.isFinished()
        );
    }
}
