package com.rambed.rambedcash.movimiento;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class MovimientoDTO {

    private Integer id;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @NotNull(message = "El valor es obligatorio")
    @Positive(message = "El valor debe ser mayor a cero")
    private BigDecimal valor;

    @NotNull(message = "El tipo es obligatorio")
    private Movimiento.Tipo tipo;

    @NotNull(message = "El medio de pago es obligatorio")
    private Movimiento.MedioPago medioPago;

    @NotNull(message = "La categoria es obligatoria")
    private Integer categoriaId;

    private Integer usuarioId;

    private String categoriaNombre;

    private String usuarioNombre;
}