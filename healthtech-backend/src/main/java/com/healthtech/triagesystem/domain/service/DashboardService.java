package com.healthtech.triagesystem.domain.service;

import com.healthtech.triagesystem.domain.dto.response.DashboardResponse;
import com.healthtech.triagesystem.domain.model.NivelDeRisco;
import com.healthtech.triagesystem.domain.model.StatusTriagem;
import com.healthtech.triagesystem.domain.repository.FichaSintomaRepository;
import com.healthtech.triagesystem.domain.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FichaSintomaRepository fichaRepository;
    private final PacienteRepository pacienteRepository;

    public DashboardResponse getDashboard() {
        Map<String, Long> distribuicao = new HashMap<>();
        fichaRepository.countByNivelDeRiscoGrouped().forEach(row -> {
            NivelDeRisco nivel = (NivelDeRisco) row[0];
            Long count = (Long) row[1];
            distribuicao.put(nivel.getNome(), count);
        });

        return new DashboardResponse(
                fichaRepository.count(),
                fichaRepository.countByStatus(StatusTriagem.AGUARDANDO_ATENDIMENTO),
                fichaRepository.countByStatus(StatusTriagem.EM_ATENDIMENTO),
                fichaRepository.countByStatus(StatusTriagem.ATENDIDO),
                pacienteRepository.count(),
                distribuicao
        );
    }
}
