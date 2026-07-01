package com.healthtech.triagesystem.domain.dto.response;

public record LoginResponse(
        String token,
        String tipo,
        String nome,
        String email,
        String role
) {}
