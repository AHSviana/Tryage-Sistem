package com.healthtech.triagesystem.domain.dto.request;

import com.healthtech.triagesystem.domain.model.RoleUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CadastrarUsuarioRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "Senha deve ter ao menos 6 caracteres") String senha,
        @NotNull RoleUsuario role
) {}
