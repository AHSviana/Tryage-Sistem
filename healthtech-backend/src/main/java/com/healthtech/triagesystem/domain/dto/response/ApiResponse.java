package com.healthtech.triagesystem.domain.dto.response;

public record ApiResponse<T>(
        boolean sucesso,
        String mensagem,
        T dados
) {
    public static <T> ApiResponse<T> sucesso(String mensagem, T dados) {
        return new ApiResponse<>(true, mensagem, dados);
    }

    public static <T> ApiResponse<T> erro(String mensagem) {
        return new ApiResponse<>(false, mensagem, null);
    }
}
