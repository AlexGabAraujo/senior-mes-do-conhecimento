package br.com.senior.mes_conhecimento.application.usecases.lecture;

import br.com.senior.mes_conhecimento.domain.repositories.LectureRepository;
import org.springframework.stereotype.Service;

@Service
public class DeleteLectureUseCase {

    private final LectureRepository repository;

    public DeleteLectureUseCase(LectureRepository repository) {
        this.repository = repository;
    }

    public void execute(Long id) {
        if (repository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Palestra não encontrada");
        }
        repository.deleteById(id);
    }
}
