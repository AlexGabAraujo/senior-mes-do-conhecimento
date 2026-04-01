package br.com.senior.mes_conhecimento.application.dtos;

import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.enums.TargetAudience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record LectureRequestDTO(
        @NotBlank String title,
        @NotBlank String speaker,
        String description,
        TargetAudience targetAudience,
        @NotNull LocalDate date,
        @NotBlank String time,
        @NotNull LectureType type,
        String speakerImagePath,
        String registrationUrl,
        boolean finished
) {}
