package br.com.senior.mes_conhecimento.web.controllers;

import br.com.senior.mes_conhecimento.application.dtos.LectureResponseDTO;
import br.com.senior.mes_conhecimento.application.usecases.lecture.GetLecturesUseCase;
import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lectures")
public class PublicLectureController {

    private final GetLecturesUseCase getLecturesUseCase;

    public PublicLectureController(GetLecturesUseCase getLecturesUseCase) {
        this.getLecturesUseCase = getLecturesUseCase;
    }

    @GetMapping
    public ResponseEntity<Page<LectureResponseDTO>> list(
            @RequestParam(required = false) LectureType type,
            @RequestParam(required = false) Boolean finished,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<LectureResponseDTO> page = getLecturesUseCase.execute(type, finished, pageable);
        return ResponseEntity.ok(page);
    }
}
