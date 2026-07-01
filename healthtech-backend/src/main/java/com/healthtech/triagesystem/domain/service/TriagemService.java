package com.healthtech.triagesystem.domain.service;

import com.healthtech.triagesystem.domain.dto.request.AtualizarStatusRequest;
import com.healthtech.triagesystem.domain.dto.request.CriarTriagemRequest;
import com.healthtech.triagesystem.domain.dto.response.TriagemResponse;
import com.healthtech.triagesystem.domain.model.*;
import com.healthtech.triagesystem.domain.repository.FichaSintomaRepository;
import com.healthtech.triagesystem.domain.repository.UsuarioRepository;
import com.healthtech.triagesystem.exception.ResourceNotFoundException;
import com.healthtech.triagesystem.infrastructure.ai.GeminiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TriagemService {

    private final FichaSintomaRepository fichaRepository;
    private final PacienteService pacienteService;
    private final UsuarioRepository usuarioRepository;
    private final GeminiClient geminiClient;

    @Transactional
    public TriagemResponse criarTriagem(CriarTriagemRequest req) {
        Paciente paciente = pacienteService.findOrThrow(req.pacienteId());

        GeminiClient.AnaliseIaResult analise = geminiClient.analisarTriagem(req, paciente);
        log.info("Gemini classificou triagem como {} para paciente {}", analise.nivelDeRisco(), paciente.getNome());

        String emailLogado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario triadoPor = usuarioRepository.findByEmail(emailLogado).orElse(null);

        FichaSintoma ficha = FichaSintoma.builder()
                .paciente(paciente)
                .sintomas(req.sintomas())
                .temperatura(req.temperatura())
                .pressaoSistolica(req.pressaoSistolica())
                .pressaoDiastolica(req.pressaoDiastolica())
                .freqCardiaca(req.freqCardiaca())
                .freqRespiratoria(req.freqRespiratoria())
                .saturacaoO2(req.saturacaoO2())
                .escalaDor(req.escalaDor())
                .nivelDeRisco(analise.nivelDeRisco())
                .justificativaIa(analise.justificativa())
                .recomendacoesIa(analise.recomendacoes())
                .status(StatusTriagem.AGUARDANDO_ATENDIMENTO)
                .triadoPor(triadoPor)
                .build();

        return TriagemResponse.from(fichaRepository.save(ficha));
    }

    public TriagemResponse buscarPorId(UUID id) {
        return TriagemResponse.from(findOrThrow(id));
    }

    public List<TriagemResponse> listarPorPaciente(UUID pacienteId) {
        return fichaRepository.findByPacienteIdOrderByCriadoEmDesc(pacienteId)
                .stream().map(TriagemResponse::from).toList();
    }

    public List<TriagemResponse> listarFilaAtendimento() {
        return fichaRepository.findByStatusOrderByNivelDeRiscoAscCriadoEmAsc(StatusTriagem.AGUARDANDO_ATENDIMENTO)
                .stream().map(TriagemResponse::from).toList();
    }

    public List<TriagemResponse> listarTodas() {
        return fichaRepository.findAll().stream().map(TriagemResponse::from).toList();
    }

    @Transactional
    public TriagemResponse atualizarStatus(UUID id, AtualizarStatusRequest req) {
        FichaSintoma ficha = findOrThrow(id);
        ficha.setStatus(req.status());
        return TriagemResponse.from(fichaRepository.save(ficha));
    }

    private FichaSintoma findOrThrow(UUID id) {
        return fichaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Triagem não encontrada: " + id));
    }
}
