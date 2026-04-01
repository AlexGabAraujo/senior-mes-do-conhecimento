package br.com.senior.mes_conhecimento.infrastructure.persistence.entities;

import br.com.senior.mes_conhecimento.domain.enums.LectureType;
import br.com.senior.mes_conhecimento.domain.enums.TargetAudience;
import javax.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_lectures")
public class LectureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String speaker;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_audience")
    private TargetAudience targetAudience;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 5)
    private String time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LectureType type;

    @Column(name = "speaker_image_path")
    private String speakerImagePath;

    @Column(name = "registration_url")
    private String registrationUrl;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean finished;

    public LectureEntity() {
    }

    public LectureEntity(Long id, String title, String speaker, String description, TargetAudience targetAudience,
                         LocalDate date, String time, LectureType type, String speakerImagePath,
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

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
