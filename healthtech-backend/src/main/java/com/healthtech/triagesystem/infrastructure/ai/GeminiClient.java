package com.healthtech.triagesystem.infrastructure.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthtech.triagesystem.domain.dto.request.CriarTriagemRequest;
import com.healthtech.triagesystem.domain.model.NivelDeRisco;
import com.healthtech.triagesystem.domain.model.Paciente;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {


    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash-lite}")
    private String model;

    private final WebClient geminiWebClient;
    private final ObjectMapper objectMapper;

    public AnaliseIaResult analisarTriagem(CriarTriagemRequest req, Paciente paciente) {
        log.info("==> Chave Gemini recebida: [{}]", apiKey);
        String prompt = buildPrompt(req, paciente);
        log.info("Enviando triagem para análise via Gemini - paciente: {}", paciente.getNome());

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + model + ":generateContent?key=" + apiKey;

            Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                    "temperature", 0.2,
                    "maxOutputTokens", 1024
                )
            );

            String responseStr = geminiWebClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseResponse(responseStr);

        } catch (Exception e) {
            log.error("Erro ao chamar Gemini API: {}", e.getMessage());
            return fallbackAnalise(req);
        }
    }

    private String buildPrompt(CriarTriagemRequest req, Paciente paciente) {
        int idade = Period.between(paciente.getDataNascimento(), LocalDate.now()).getYears();

        return """
                Você é um sistema especialista em triagem hospitalar seguindo o Protocolo de Manchester.
                Analise os dados clínicos abaixo e classifique o nível de urgência.

                DADOS DO PACIENTE:
                - Nome: %s
                - Idade: %d anos
                - Sexo: %s
                - Alergias: %s
                - Medicamentos em uso: %s
                - Histórico médico: %s

                SINAIS VITAIS E SINTOMAS:
                - Sintomas relatados: %s
                - Temperatura: %.1f°C
                - Pressão arterial: %s/%s mmHg
                - Frequência cardíaca: %s bpm
                - Frequência respiratória: %s irpm
                - Saturação O2: %s%%
                - Escala de dor (0-10): %s

                INSTRUÇÃO:
                Classifique o nível de urgência usando EXATAMENTE uma destas opções:
                - VERMELHO: Emergência - Risco imediato de vida
                - LARANJA: Muito Urgente - Condição muito urgente
                - AMARELO: Urgente - Condição urgente
                - VERDE: Pouco Urgente - Baixa gravidade
                - AZUL: Não Urgente - Sem urgência

                Responda APENAS em formato JSON válido, sem texto fora do JSON, sem markdown:
                {"nivelDeRisco":"VERMELHO","justificativa":"...","recomendacoes":"..."}
                """.formatted(
                paciente.getNome(), idade,
                paciente.getSexo() != null ? paciente.getSexo() : "Não informado",
                paciente.getAlergias() != null ? paciente.getAlergias() : "Nenhuma",
                paciente.getMedicamentosEmUso() != null ? paciente.getMedicamentosEmUso() : "Nenhum",
                paciente.getHistoricoMedico() != null ? paciente.getHistoricoMedico() : "Sem histórico",
                req.sintomas(), req.temperatura(),
                req.pressaoSistolica() != null ? req.pressaoSistolica() : "N/I",
                req.pressaoDiastolica() != null ? req.pressaoDiastolica() : "N/I",
                req.freqCardiaca() != null ? req.freqCardiaca() : "N/I",
                req.freqRespiratoria() != null ? req.freqRespiratoria() : "N/I",
                req.saturacaoO2() != null ? req.saturacaoO2() : "N/I",
                req.escalaDor() != null ? req.escalaDor() : "N/I"
        );
    }

    private AnaliseIaResult parseResponse(String responseStr) throws Exception {
        JsonNode root = objectMapper.readTree(responseStr);
        String content = root
                .path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

        // Limpa possível markdown
        String json = content.trim()
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();

        // Extrai apenas o JSON se houver texto antes/depois
        int start = json.indexOf('{');
        int end = json.lastIndexOf('}');
        if (start >= 0 && end > start) {
            json = json.substring(start, end + 1);
        }

        JsonNode result = objectMapper.readTree(json);
        String nivel = result.path("nivelDeRisco").asText("AMARELO");
        String justificativa = result.path("justificativa").asText("");
        String recomendacoes = result.path("recomendacoes").asText("");

        NivelDeRisco nivelDeRisco;
        try {
            nivelDeRisco = NivelDeRisco.valueOf(nivel.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            log.warn("Nível inválido retornado pela IA: {}. Usando AMARELO.", nivel);
            nivelDeRisco = NivelDeRisco.AMARELO;
        }

        return new AnaliseIaResult(nivelDeRisco, justificativa, recomendacoes);
    }

    private AnaliseIaResult fallbackAnalise(CriarTriagemRequest req) {
        log.warn("Usando lógica de fallback para classificação de triagem");
        NivelDeRisco nivel = NivelDeRisco.AMARELO;

        if (req.temperatura() >= 39.5 || (req.saturacaoO2() != null && req.saturacaoO2() < 90)) {
            nivel = NivelDeRisco.LARANJA;
        } else if (req.temperatura() < 35.0 || (req.escalaDor() != null && req.escalaDor() >= 8)) {
            nivel = NivelDeRisco.LARANJA;
        } else if (req.temperatura() >= 38.0 || (req.escalaDor() != null && req.escalaDor() >= 5)) {
            nivel = NivelDeRisco.AMARELO;
        } else if (req.temperatura() < 37.5 && (req.escalaDor() == null || req.escalaDor() < 3)) {
            nivel = NivelDeRisco.VERDE;
        }

        return new AnaliseIaResult(nivel,
                "Classificação automática (IA indisponível). Revise com o médico responsável.",
                "Avaliar manualmente os sinais vitais e sintomas relatados.");
    }

    public record AnaliseIaResult(
            NivelDeRisco nivelDeRisco,
            String justificativa,
            String recomendacoes
    ) {}
}
