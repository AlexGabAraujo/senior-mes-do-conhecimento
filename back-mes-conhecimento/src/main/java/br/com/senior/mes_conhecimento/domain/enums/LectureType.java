package br.com.senior.mes_conhecimento.domain.enums;

/**
 * Tipo de atividade da programação.
 */
public enum LectureType {
    PALESTRA("Palestra"),
    OFICINA("Oficina");

    private final String descricao;

    LectureType(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
