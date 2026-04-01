package br.com.senior.mes_conhecimento.application.dtos;

import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.enums.TargetAudience;

import java.time.LocalDate;

public record LectureResponseDTO(
        Long id,
        String title,
        String speaker,
        String description,
        TargetAudience targetAudience,
        LocalDate date,
        String time,
        LectureType type,
        String speakerImagePath,
        String registrationUrl,
        boolean finished
) {}
