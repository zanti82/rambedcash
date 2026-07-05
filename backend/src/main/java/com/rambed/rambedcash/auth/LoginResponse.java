package com.rambed.rambedcash.auth;

import lombok.Data;

@Data
public class LoginResponse {

    private String token;
    private String nombre;
    private String email;
    private String rol;
}