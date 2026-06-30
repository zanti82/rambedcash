package com.rambed.rambedcash.categoria;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false, length = 10)
    private TipoMovimiento tipoMovimiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Clasificacion clasificacion;

    @Column(nullable = false)
    private Boolean activa = true;

    public enum TipoMovimiento {
        INGRESO,
        EGRESO
    }

    public enum Clasificacion {
        INGRESO_OPERACIONAL,
        INGRESO_NO_OPERACIONAL,
        COSTO_VENTA,
        GASTO_FIJO,
        GASTO_ADMINISTRATIVO,
        GASTO_VENTAS,
        PAGO_DEUDA_ANTERIOR,
        RETIRO_INVERSIONISTA
    }
}