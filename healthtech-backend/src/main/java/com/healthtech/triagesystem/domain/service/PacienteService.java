package com.healthtech.triagesystem.domain.service;

import com.healthtech.triagesystem.domain.dto.request.CadastrarPacienteRequest;
import com.healthtech.triagesystem.domain.dto.response.PacienteResponse;
import com.healthtech.triagesystem.domain.model.Paciente;
import com.healthtech.triagesystem.domain.repository.PacienteRepository;
import com.healthtech.triagesystem.exception.BusinessException;
import com.healthtech.triagesystem.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    @Transactional
    public PacienteResponse cadastrar(CadastrarPacienteRequest req) {
        if (pacienteRepository.existsByCpf(req.cpf())) {
            throw new BusinessException("CPF já cadastrado: " + req.cpf());
        }

        Paciente paciente = Paciente.builder()
                .nome(req.nome())
                .dataNascimento(req.dataNascimento())
                .cpf(req.cpf())
                .telefone(req.telefone())
                .sexo(req.sexo())
                .alergias(req.alergias())
                .medicamentosEmUso(req.medicamentosEmUso())
                .historicoMedico(req.historicoMedico())
                .build();

        paciente = pacienteRepository.save(paciente);
        log.info("Paciente cadastrado: {} - CPF: {}", paciente.getNome(), paciente.getCpf());
        return PacienteResponse.from(paciente);
    }

    public PacienteResponse buscarPorId(UUID id) {
        return PacienteResponse.from(findOrThrow(id));
    }

    public PacienteResponse buscarPorCpf(String cpf) {
        Paciente p = pacienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com CPF: " + cpf));
        return PacienteResponse.from(p);
    }

    public List<PacienteResponse> listarTodos() {
        return pacienteRepository.findAll().stream()
                .map(PacienteResponse::from)
                .toList();
    }

    @Transactional
    public PacienteResponse atualizar(UUID id, CadastrarPacienteRequest req) {
        Paciente paciente = findOrThrow(id);
        paciente.setNome(req.nome());
        paciente.setDataNascimento(req.dataNascimento());
        paciente.setTelefone(req.telefone());
        paciente.setSexo(req.sexo());
        paciente.setAlergias(req.alergias());
        paciente.setMedicamentosEmUso(req.medicamentosEmUso());
        paciente.setHistoricoMedico(req.historicoMedico());
        return PacienteResponse.from(pacienteRepository.save(paciente));
    }

    @Transactional
    public void deletar(UUID id) {
        if (!pacienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paciente não encontrado: " + id);
        }
        pacienteRepository.deleteById(id);
        log.info("Paciente removido: {}", id);
    }

    public Paciente findOrThrow(UUID id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado: " + id));
    }
}
