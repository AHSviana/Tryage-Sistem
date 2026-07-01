package com.healthtech.triagesystem.domain.dto.response;

import com.healthtech.triagesystem.domain.model.FichaSintoma;
import com.healthtech.triagesystem.domain.model.NivelDeRisco;
import com.healthtech.triagesystem.domain.model.StatusTriagem;

import java.time.LocalDateTime;
import java.util.UUID;

public record TriagemResponse(
        UUID id,
        UUID pacienteId,
        String pacienteNome,
        String sintomas,
        Double temperatura,
        Integer pressaoSistolica,
        Integer pressaoDiastolica,
        Integer freqCardiaca,
        Integer freqRespiratoria,
        Integer saturacaoO2,
        Integer escalaDor,
        NivelDeRisco nivelDeRisco,
        String nivelNome,
        String nivelDescricao,
        int tempoMaxAtendimento,
        String justificativaIa,
        String recomendacoesIa,
        StatusTriagem status,
        String triadoPorNome,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static TriagemResponse from(FichaSintoma f) {
        return new TriagemResponse(
                f.getId(),
                f.getPaciente().getId(),
                f.getPaciente().getNome(),
                f.getSintomas(),
                f.getTemperatura(),
                f.getPressaoSistolica(),
                f.getPressaoDiastolica(),
                f.getFreqCardiaca(),
                f.getFreqRespiratoria(),
                f.getSaturacaoO2(),
                f.getEscalaDor(),
                f.getNivelDeRisco(),
                f.getNivelDeRisco().getNome(),
                f.getNivelDeRisco().getDescricao(),
                f.getNivelDeRisco().getTempoMaxAtendimentoMinutos(),
                f.getJustificativaIa(),
                f.getRecomendacoesIa(),
                f.getStatus(),
                f.getTriadoPor() != null ? f.getTriadoPor().getNome() : null,
                f.getCriadoEm(),
                f.getAtualizadoEm()
        );
    }
}
