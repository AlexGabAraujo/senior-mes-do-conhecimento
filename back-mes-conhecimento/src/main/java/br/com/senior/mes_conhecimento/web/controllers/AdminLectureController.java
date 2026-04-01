package br.com.senior.mes_conhecimento.web.controllers;

import br.com.senior.mes_conhecimento.application.dtos.LectureRequestDTO;
import br.com.senior.mes_conhecimento.application.dtos.LectureResponseDTO;
import br.com.senior.mes_conhecimento.application.usecases.lecture.CreateLectureUseCase;
import br.com.senior.mes_conhecimento.application.usecases.lecture.DeleteLectureUseCase;
import br.com.senior.mes_conhecimento.application.usecases.lecture.UpdateLectureUseCase;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/admin/lectures")
public class AdminLectureController {

    private final CreateLectureUseCase createLectureUseCase;
    private final UpdateLectureUseCase updateLectureUseCase;
    private final DeleteLectureUseCase deleteLectureUseCase;

    public AdminLectureController(CreateLectureUseCase createLectureUseCase,
                                  UpdateLectureUseCase updateLectureUseCase,
                                  DeleteLectureUseCase deleteLectureUseCase) {
        this.createLectureUseCase = createLectureUseCase;
        this.updateLectureUseCase = updateLectureUseCase;
        this.deleteLectureUseCase = deleteLectureUseCase;
    }

    @PostMapping
    public ResponseEntity<LectureResponseDTO> create(@RequestBody @Valid LectureRequestDTO dto) {
        LectureResponseDTO response = createLectureUseCase.execute(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(response.getId()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LectureResponseDTO> update(@PathVariable Long id, @RequestBody @Valid LectureRequestDTO dto) {
        LectureResponseDTO response = updateLectureUseCase.execute(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteLectureUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
