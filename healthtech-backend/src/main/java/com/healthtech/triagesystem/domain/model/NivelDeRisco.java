package com.healthtech.triagesystem.domain.model;

public enum NivelDeRisco {
    VERMELHO("Emergência", "Risco imediato de morte. Atendimento imediato.", 0),
    LARANJA("Muito Urgente", "Risco significativo. Atendimento em até 10 minutos.", 10),
    AMARELO("Urgente", "Gravidade moderada. Atendimento em até 50 minutos.", 50),
    VERDE("Pouco Urgente", "Baixa gravidade. Atendimento em até 120 minutos.", 120),
    AZUL("Não Urgente", "Sem risco. Atendimento em até 240 minutos.", 240);

    private final String nome;
    private final String descricao;
    private final int tempoMaxAtendimentoMinutos;

    NivelDeRisco(String nome, String descricao, int tempoMaxAtendimentoMinutos) {
        this.nome = nome;
        this.descricao = descricao;
        this.tempoMaxAtendimentoMinutos = tempoMaxAtendimentoMinutos;
    }

    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public int getTempoMaxAtendimentoMinutos() { return tempoMaxAtendimentoMinutos; }
}
