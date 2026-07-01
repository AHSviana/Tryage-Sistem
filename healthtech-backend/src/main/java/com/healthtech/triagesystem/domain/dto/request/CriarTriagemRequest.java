package com.healthtech.triagesystem.domain.dto.request;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record CriarTriagemRequest(
        @NotNull(message = "ID do paciente é obrigatório") UUID pacienteId,
        @NotBlank(message = "Os sintomas devem ser informados") String sintomas,
        @NotNull @DecimalMin("30.0") @DecimalMax("45.0") Double temperatura,
        Integer pressaoSistolica,
        Integer pressaoDiastolica,
        Integer freqCardiaca,
        Integer freqRespiratoria,
        @Min(70) @Max(100) Integer saturacaoO2,
        @Min(0) @Max(10) Integer escalaDor
) {}
