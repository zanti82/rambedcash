package com.rambed.rambedcash.prestamo;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PagoPrestamoDTO {

    private Integer id;

    @NotNull(message = "El prestamo es obligatorio")
    private Integer prestamoId;

    @NotNull(message = "El valor capital es obligatorio")
    @Positive(message = "El valor capital debe ser mayor a cero")
    private BigDecimal valorCapital;

    @NotNull(message = "La fecha de pago es obligatoria")
    private LocalDate fechaPago;

    @NotNull(message = "El medio de pago es obligatorio")
    private String medioPago;

    private Integer usuarioId;
}
