package br.com.senior.mes_conhecimento.application.usecases.lecture;

import br.com.senior.mes_conhecimento.application.dtos.LectureResponseDTO;
import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class GetLecturesUseCase {

    private final LectureRepository repository;

    public GetLecturesUseCase(LectureRepository repository) {
        this.repository = repository;
    }

    public Page<LectureResponseDTO> execute(LectureType type, Boolean finished, Pageable pageable) {
        return repository.findAllWithFilters(type, finished, pageable)
                .map(l -> new LectureResponseDTO(
                        l.getId(), l.getTitle(), l.getSpeaker(), l.getDescription(),
                        l.getTargetAudience(), l.getDate(),
                        l.getTime() != null ? l.getTime().toString() : null,
                        l.getType(), l.getSpeakerImagePath(), l.getRegistrationUrl(), l.isFinished()
                ));
    }
}
