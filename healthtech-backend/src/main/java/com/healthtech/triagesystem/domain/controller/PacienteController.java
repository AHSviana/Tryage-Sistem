package com.healthtech.triagesystem.domain.controller;

import com.healthtech.triagesystem.domain.dto.request.CadastrarPacienteRequest;
import com.healthtech.triagesystem.domain.dto.response.ApiResponse;
import com.healthtech.triagesystem.domain.dto.response.PacienteResponse;
import com.healthtech.triagesystem.domain.service.PacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
@Tag(name = "Pacientes", description = "Gerenciamento de pacientes")
@SecurityRequirement(name = "BearerAuth")
public class PacienteController {

    private final PacienteService pacienteService;

    @PostMapping
    @Operation(summary = "Cadastrar novo paciente")
    public ResponseEntity<ApiResponse<PacienteResponse>> cadastrar(@RequestBody @Valid CadastrarPacienteRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.sucesso("Paciente cadastrado", pacienteService.cadastrar(req)));
    }

    @GetMapping
    @Operation(summary = "Listar todos os pacientes")
    public ResponseEntity<ApiResponse<List<PacienteResponse>>> listar() {
        return ResponseEntity.ok(ApiResponse.sucesso("Pacientes listados", pacienteService.listarTodos()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar paciente por ID")
    public ResponseEntity<ApiResponse<PacienteResponse>> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso("Paciente encontrado", pacienteService.buscarPorId(id)));
    }

    @GetMapping("/cpf/{cpf}")
    @Operation(summary = "Buscar paciente por CPF")
    public ResponseEntity<ApiResponse<PacienteResponse>> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(ApiResponse.sucesso("Paciente encontrado", pacienteService.buscarPorCpf(cpf)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados do paciente")
    public ResponseEntity<ApiResponse<PacienteResponse>> atualizar(
            @PathVariable UUID id, @RequestBody @Valid CadastrarPacienteRequest req) {
        return ResponseEntity.ok(ApiResponse.sucesso("Paciente atualizado", pacienteService.atualizar(id, req)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover paciente")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable UUID id) {
        pacienteService.deletar(id);
        return ResponseEntity.ok(ApiResponse.sucesso("Paciente removido", null));
    }
}
