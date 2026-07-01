package com.healthtech.triagesystem.domain.controller;

import com.healthtech.triagesystem.domain.dto.request.CadastrarUsuarioRequest;
import com.healthtech.triagesystem.domain.dto.request.LoginRequest;
import com.healthtech.triagesystem.domain.dto.response.ApiResponse;
import com.healthtech.triagesystem.domain.dto.response.LoginResponse;
import com.healthtech.triagesystem.domain.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Login e registro de usuários")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Fazer login e obter token JWT")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.sucesso("Login realizado com sucesso", authService.login(req)));
    }

    @PostMapping("/registrar")
    @Operation(summary = "Registrar novo usuário (acesso público apenas para setup inicial)")
    public ResponseEntity<ApiResponse<Void>> registrar(@RequestBody @Valid CadastrarUsuarioRequest req) {
        authService.cadastrarUsuario(req);
        return ResponseEntity.status(201).body(ApiResponse.sucesso("Usuário cadastrado com sucesso", null));
    }
}
