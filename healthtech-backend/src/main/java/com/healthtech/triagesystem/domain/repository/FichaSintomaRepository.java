package com.healthtech.triagesystem.domain.repository;

import com.healthtech.triagesystem.domain.model.FichaSintoma;
import com.healthtech.triagesystem.domain.model.NivelDeRisco;
import com.healthtech.triagesystem.domain.model.StatusTriagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FichaSintomaRepository extends JpaRepository<FichaSintoma, UUID> {

    List<FichaSintoma> findByPacienteIdOrderByCriadoEmDesc(UUID pacienteId);

    List<FichaSintoma> findByStatusOrderByNivelDeRiscoAscCriadoEmAsc(StatusTriagem status);

    List<FichaSintoma> findByNivelDeRiscoAndStatus(NivelDeRisco nivel, StatusTriagem status);

    @Query("SELECT f FROM FichaSintoma f WHERE f.criadoEm BETWEEN :inicio AND :fim ORDER BY f.nivelDeRisco ASC, f.criadoEm ASC")
    List<FichaSintoma> findByPeriodo(LocalDateTime inicio, LocalDateTime fim);

    long countByStatus(StatusTriagem status);

    long countByNivelDeRisco(NivelDeRisco nivelDeRisco);

    @Query("SELECT f.nivelDeRisco, COUNT(f) FROM FichaSintoma f GROUP BY f.nivelDeRisco")
    List<Object[]> countByNivelDeRiscoGrouped();
}
