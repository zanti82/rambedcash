package com.rambed.rambedcash.prestamo;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PrestamoDTO {

    private Integer id;

    @NotBlank(message = "La descripcion es obligatoria")
    private String descripcion;

    @NotBlank(message = "La entidad es obligatoria")
    private String entidad;

    @NotNull(message = "El valor original es obligatorio")
    @Positive(message = "El valor original debe ser mayor a cero")
    private BigDecimal valorOriginal;

    @NotNull(message = "La tasa de interes es obligatoria")
    @Positive(message = "La tasa de interes debe ser mayor a cero")
    private BigDecimal tasaInteres;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    private LocalDate fechaVencimiento;

    private Boolean activo;
}
