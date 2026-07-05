package com.rambed.rambedcash.saldo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "saldos")
public class Saldo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "saldo_efectivo", nullable = false, precision = 15, scale = 2)
    private BigDecimal saldoEfectivo = BigDecimal.ZERO;

    @Column(name = "saldo_banco", nullable = false, precision = 15, scale = 2)
    private BigDecimal saldoBanco = BigDecimal.ZERO;

    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
}
