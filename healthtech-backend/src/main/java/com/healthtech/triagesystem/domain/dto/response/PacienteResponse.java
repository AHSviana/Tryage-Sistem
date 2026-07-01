package com.healthtech.triagesystem.domain.dto.response;

import com.healthtech.triagesystem.domain.model.Paciente;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PacienteResponse(
        UUID id,
        String nome,
        LocalDate dataNascimento,
        String cpf,
        String telefone,
        String sexo,
        String alergias,
        String medicamentosEmUso,
        String historicoMedico,
        LocalDateTime criadoEm
) {
    public static PacienteResponse from(Paciente p) {
        return new PacienteResponse(
                p.getId(), p.getNome(), p.getDataNascimento(), p.getCpf(),
                p.getTelefone(), p.getSexo(), p.getAlergias(),
                p.getMedicamentosEmUso(), p.getHistoricoMedico(), p.getCriadoEm()
        );
    }
}
