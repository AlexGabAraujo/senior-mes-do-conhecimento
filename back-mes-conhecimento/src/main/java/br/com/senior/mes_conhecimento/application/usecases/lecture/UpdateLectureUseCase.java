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

        lecture.setTitle(dto.getTitle());
        lecture.setSpeaker(dto.getSpeaker());
        lecture.setDescription(dto.getDescription());
        lecture.setTargetAudience(dto.getTargetAudience());
        lecture.setDate(dto.getDate());
        lecture.setTime(LocalTime.parse(dto.getTime()));
        lecture.setType(dto.getType());
        lecture.setSpeakerImagePath(dto.getSpeakerImagePath());
        lecture.setRegistrationUrl(dto.getRegistrationUrl());
        lecture.setFinished(dto.isFinished());

        Lecture saved = repository.save(lecture);

        return new LectureResponseDTO(
                saved.getId(), saved.getTitle(), saved.getSpeaker(), saved.getDescription(),
                saved.getTargetAudience(), saved.getDate(),
                saved.getTime().toString(), saved.getType(),
                saved.getSpeakerImagePath(), saved.getRegistrationUrl(), saved.isFinished()
        );
    }
}
