package com.rambed.rambedcash.movimiento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MovimientoRepository extends JpaRepository<Movimiento, Integer> {

    List<Movimiento> findByFechaBetweenOrderByFechaDesc(
            LocalDate fechaInicio,
            LocalDate fechaFin);

    List<Movimiento> findByCategoriaIdOrderByFechaDesc(Integer categoriaId);

    List<Movimiento> findByTipoOrderByFechaDesc(Movimiento.Tipo tipo);

    @Query("SELECT SUM(m.valor) FROM Movimiento m " +
           "WHERE m.tipo = :tipo " +
           "AND m.medioPago = :medioPago " +
           "AND m.fecha BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumarPorTipoYMedioPago(
            @Param("tipo") Movimiento.Tipo tipo,
            @Param("medioPago") Movimiento.MedioPago medioPago,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT SUM(m.valor) FROM Movimiento m " +
           "WHERE m.tipo = :tipo " +
           "AND m.fecha BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumarPorTipo(
            @Param("tipo") Movimiento.Tipo tipo,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);
}