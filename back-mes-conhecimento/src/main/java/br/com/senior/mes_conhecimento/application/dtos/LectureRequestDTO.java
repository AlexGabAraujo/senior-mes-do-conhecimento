package br.com.senior.mes_conhecimento.application.dtos;

import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.enums.TargetAudience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class LectureRequestDTO {
    @NotBlank
    private String title;
    
    @NotBlank
    private String speaker;
    
    private String description;
    
    private TargetAudience targetAudience;
    
    @NotNull
    private LocalDate date;
    
    @NotBlank
    private String time;
    
    @NotNull
    private LectureType type;
    
    private String speakerImagePath;
    
    private String registrationUrl;
    
    private boolean finished;

    // Default constructor
    public LectureRequestDTO() {}

    // Constructor with all fields
    public LectureRequestDTO(String title, String speaker, String description, TargetAudience targetAudience,
                           LocalDate date, String time, LectureType type, String speakerImagePath,
                           String registrationUrl, boolean finished) {
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

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSpeaker() { return speaker; }
    public void setSpeaker(String speaker) { this.speaker = speaker; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TargetAudience getTargetAudience() { return targetAudience; }
    public void setTargetAudience(TargetAudience targetAudience) { this.targetAudience = targetAudience; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public LectureType getType() { return type; }
    public void setType(LectureType type) { this.type = type; }

    public String getSpeakerImagePath() { return speakerImagePath; }
    public void setSpeakerImagePath(String speakerImagePath) { this.speakerImagePath = speakerImagePath; }

    public String getRegistrationUrl() { return registrationUrl; }
    public void setRegistrationUrl(String registrationUrl) { this.registrationUrl = registrationUrl; }

    public boolean isFinished() { return finished; }
    public void setFinished(boolean finished) { this.finished = finished; }
}
