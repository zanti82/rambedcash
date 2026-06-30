package com.rambed.rambedcash.categoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoriaDTO {

    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "El tipo de movimiento es obligatorio")
    private Categoria.TipoMovimiento tipoMovimiento;

    @NotNull(message = "La clasificacion es obligatoria")
    private Categoria.Clasificacion clasificacion;

    private Boolean activa;
}