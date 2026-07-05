package com.rambed.rambedcash.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioDTO {

    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato valido")
    private String email;

    @NotBlank(message = "La password es obligatoria")
    @Size(min = 4, message = "La password debe tener minimo 4 caracteres")
    private String password;

    @NotNull(message = "El rol es obligatorio")
    private Usuario.Rol rol;
}