package com.healthtech.triagesystem.domain.service;

import com.healthtech.triagesystem.domain.dto.request.CadastrarUsuarioRequest;
import com.healthtech.triagesystem.domain.dto.request.LoginRequest;
import com.healthtech.triagesystem.domain.dto.response.LoginResponse;
import com.healthtech.triagesystem.domain.model.Usuario;
import com.healthtech.triagesystem.domain.repository.UsuarioRepository;
import com.healthtech.triagesystem.exception.BusinessException;
import com.healthtech.triagesystem.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public LoginResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.senha()));

        Usuario usuario = usuarioRepository.findByEmail(req.email())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getRole().name());
        return new LoginResponse(token, "Bearer", usuario.getNome(), usuario.getEmail(), usuario.getRole().name());
    }

    @Transactional
    public void cadastrarUsuario(CadastrarUsuarioRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new BusinessException("E-mail já cadastrado: " + req.email());
        }

        Usuario usuario = Usuario.builder()
                .nome(req.nome())
                .email(req.email())
                .senha(passwordEncoder.encode(req.senha()))
                .role(req.role())
                .build();

        usuarioRepository.save(usuario);
    }
}
