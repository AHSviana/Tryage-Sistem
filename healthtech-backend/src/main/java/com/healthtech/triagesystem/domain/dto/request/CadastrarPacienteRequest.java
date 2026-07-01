package com.healthtech.triagesystem.domain.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CadastrarPacienteRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotNull(message = "Data de nascimento é obrigatória") LocalDate dataNascimento,
        @NotBlank(message = "CPF é obrigatório") @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos") String cpf,
        String telefone,
        String sexo,
        String alergias,
        String medicamentosEmUso,
        String historicoMedico
) {}
