package br.com.senior.mes_conhecimento.domain.entities;

import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.enums.TargetAudience;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entidade de Domínio representando uma Palestra ou Oficina.
 */
public class Lecture {

    private Long id;
    private String title;
    private String speaker;
    private String description;
    private TargetAudience targetAudience;
    private LocalDate date;
    private LocalTime time;
    private LectureType type;
    private String speakerImagePath;
    private String registrationUrl;
    private boolean finished;

    public Lecture(Long id, String title, String speaker, String description, TargetAudience targetAudience,
                   LocalDate date, LocalTime time, LectureType type, String speakerImagePath,
                   String registrationUrl, boolean finished) {
        this.id = id;
        this.title = title;
        this.speaker = speaker;
        this.description = description;
        this.targetAudience = targetAudience;
        this.date = date;
        this.time = time;
        this.type = type;
        this.speakerImagePath = speakerImagePath;
        this.registrationUrl = registrationUrl;
        this.finished = finished;
    }

    // Comportamentos e lógicas de negócios
    public void finishLecture() {
        this.finished = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TargetAudience getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(TargetAudience targetAudience) {
        this.targetAudience = targetAudience;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public LectureType getType() {
        return type;
    }

    public void setType(LectureType type) {
        this.type = type;
    }

    public String getSpeakerImagePath() {
        return speakerImagePath;
    }

    public void setSpeakerImagePath(String speakerImagePath) {
        this.speakerImagePath = speakerImagePath;
    }

    public String getRegistrationUrl() {
        return registrationUrl;
    }

    public void setRegistrationUrl(String registrationUrl) {
        this.registrationUrl = registrationUrl;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }
}
