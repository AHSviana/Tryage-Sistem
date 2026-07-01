package com.healthtech.triagesystem.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_triagens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichaSintoma {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Os sintomas devem ser informados")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String sintomas;

    @NotNull(message = "A temperatura é obrigatória")
    @DecimalMin(value = "30.0", message = "Temperatura impossível")
    @DecimalMax(value = "45.0", message = "Temperatura impossível")
    private Double temperatura;

    @Min(value = 0) @Max(value = 300)
    private Integer pressaoSistolica;

    @Min(value = 0) @Max(value = 200)
    private Integer pressaoDiastolica;

    @Min(value = 20) @Max(value = 300)
    private Integer freqCardiaca;

    @Min(value = 5) @Max(value = 60)
    private Integer freqRespiratoria;

    @Min(value = 70) @Max(value = 100)
    private Integer saturacaoO2;

    // Escala de dor 0-10
    @Min(value = 0) @Max(value = 10)
    private Integer escalaDor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NivelDeRisco nivelDeRisco;

    @Column(columnDefinition = "TEXT")
    private String justificativaIa; // Justificativa retornada pela IA

    @Column(columnDefinition = "TEXT")
    private String recomendacoesIa; // Recomendações da IA

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatusTriagem status = StatusTriagem.AGUARDANDO_ATENDIMENTO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "triado_por_id")
    private Usuario triadoPor;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    private LocalDateTime atualizadoEm;
}
