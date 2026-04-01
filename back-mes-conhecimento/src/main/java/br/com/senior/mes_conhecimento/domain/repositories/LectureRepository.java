package br.com.senior.mes_conhecimento.domain.repositories;

import br.com.senior.mes_conhecimento.domain.entities.Lecture;
import br.com.senior.mes_conhecimento.domain.enums.LectureType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface LectureRepository {
    Optional<Lecture> findById(Long id);
    
    // Método que lida com paginação e filtros opcionais
    Page<Lecture> findAllWithFilters(LectureType type, Boolean finished, Pageable pageable);
    
    Lecture save(Lecture lecture);
    
    void deleteById(Long id);
}
