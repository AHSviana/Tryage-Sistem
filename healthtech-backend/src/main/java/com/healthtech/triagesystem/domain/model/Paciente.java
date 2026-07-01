package com.healthtech.triagesystem.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_pacientes")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(nullable = false, length = 150)
    private String nome;

    @NotNull(message = "A data de nascimento é obrigatória")
    private LocalDate dataNascimento;

    @Column(unique = true, nullable = false, length = 11)
    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @Column(length = 15)
    private String telefone;

    @Column(length = 1)
    private String sexo; // M, F

    @Column(length = 500)
    private String alergias;

    @Column(length = 500)
    private String medicamentosEmUso;

    @Column(length = 500)
    private String historicoMedico;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;
}
