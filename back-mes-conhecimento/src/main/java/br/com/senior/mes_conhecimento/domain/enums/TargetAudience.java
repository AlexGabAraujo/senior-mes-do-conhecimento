package br.com.senior.mes_conhecimento.domain.enums;

/**
 * Público-alvo da palestra/oficina.
 */
public enum TargetAudience {
    TODOS("Todos"),
    DEVS("Devs"),
    GESTORES("Gestores"),
    RH("RH"),
    NEGOCIOS("Negócios");

    private final String descricao;

    TargetAudience(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
