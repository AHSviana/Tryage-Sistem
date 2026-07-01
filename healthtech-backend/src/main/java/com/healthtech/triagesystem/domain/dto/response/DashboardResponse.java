package com.healthtech.triagesystem.domain.dto.response;

import java.util.Map;

public record DashboardResponse(
        long totalTriagens,
        long aguardandoAtendimento,
        long emAtendimento,
        long atendidos,
        long pacientesCadastrados,
        Map<String, Long> distribuicaoNivelRisco
) {}
