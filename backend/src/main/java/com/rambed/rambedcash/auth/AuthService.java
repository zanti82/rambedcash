package com.rambed.rambedcash.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.rambed.rambedcash.config.JwtUtil;
import com.rambed.rambedcash.usuario.Usuario;
import com.rambed.rambedcash.usuario.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales invalidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales invalidas");
        }

        String token = jwtUtil.generarToken(
                usuario.getEmail(),
                usuario.getRol().name()
        );

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setNombre(usuario.getNombre());
        response.setEmail(usuario.getEmail());
        response.setRol(usuario.getRol().name());

        return response;
    }
}
