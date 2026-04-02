package br.com.senior.mes_conhecimento.application.dtos;

import java.time.LocalDate;

/**
 * DTO representando um chat disponível (palestra ou geral).
 */
public record ChatRoomDTO(
    Long lectureId,  // NULL para Chat Geral
    String name,     // Nome da palestra ou "Chat Geral"
    LocalDate lectureDate,  // NULL para Chat Geral
    boolean isGeneral
) {}
