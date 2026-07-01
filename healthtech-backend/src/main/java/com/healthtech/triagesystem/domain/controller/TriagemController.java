package com.healthtech.triagesystem.domain.controller;

import com.healthtech.triagesystem.domain.dto.request.AtualizarStatusRequest;
import com.healthtech.triagesystem.domain.dto.request.CriarTriagemRequest;
import com.healthtech.triagesystem.domain.dto.response.ApiResponse;
import com.healthtech.triagesystem.domain.dto.response.TriagemResponse;
import com.healthtech.triagesystem.domain.service.TriagemService;
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
@RequestMapping("/api/triagens")
@RequiredArgsConstructor
@Tag(name = "Triagens", description = "Criação e gerenciamento de triagens com análise por IA")
@SecurityRequirement(name = "BearerAuth")
public class TriagemController {

    private final TriagemService triagemService;

    @PostMapping
    @Operation(summary = "Criar nova triagem — a IA classifica automaticamente o nível de urgência")
    public ResponseEntity<ApiResponse<TriagemResponse>> criarTriagem(@RequestBody @Valid CriarTriagemRequest req) {
        TriagemResponse resp = triagemService.criarTriagem(req);
        return ResponseEntity.status(201).body(ApiResponse.sucesso("Triagem criada e classificada pela IA", resp));
    }

    @GetMapping
    @Operation(summary = "Listar todas as triagens")
    public ResponseEntity<ApiResponse<List<TriagemResponse>>> listar() {
        return ResponseEntity.ok(ApiResponse.sucesso("Triagens listadas", triagemService.listarTodas()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar triagem por ID")
    public ResponseEntity<ApiResponse<TriagemResponse>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso("Triagem encontrada", triagemService.buscarPorId(id)));
    }

    @GetMapping("/paciente/{pacienteId}")
    @Operation(summary = "Histórico de triagens do paciente")
    public ResponseEntity<ApiResponse<List<TriagemResponse>>> porPaciente(@PathVariable UUID pacienteId) {
        return ResponseEntity.ok(ApiResponse.sucesso("Histórico carregado", triagemService.listarPorPaciente(pacienteId)));
    }

    @GetMapping("/fila")
    @Operation(summary = "Fila de atendimento — ordenada por urgência")
    public ResponseEntity<ApiResponse<List<TriagemResponse>>> fila() {
        return ResponseEntity.ok(ApiResponse.sucesso("Fila de atendimento", triagemService.listarFilaAtendimento()));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status da triagem")
    public ResponseEntity<ApiResponse<TriagemResponse>> atualizarStatus(
            @PathVariable UUID id, @RequestBody @Valid AtualizarStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.sucesso("Status atualizado", triagemService.atualizarStatus(id, req)));
    }
}
