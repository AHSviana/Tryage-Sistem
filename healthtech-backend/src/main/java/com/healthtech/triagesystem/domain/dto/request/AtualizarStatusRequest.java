package com.healthtech.triagesystem.domain.dto.request;

import com.healthtech.triagesystem.domain.model.StatusTriagem;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(
        @NotNull(message = "Status é obrigatório") StatusTriagem status
) {}
