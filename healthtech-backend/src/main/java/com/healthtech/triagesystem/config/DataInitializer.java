package com.healthtech.triagesystem.config;

import com.healthtech.triagesystem.domain.model.RoleUsuario;
import com.healthtech.triagesystem.domain.model.Usuario;
import com.healthtech.triagesystem.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByEmail("admin@healthtech.com")) {
            Usuario admin = Usuario.builder()
                    .nome("Administrador")
                    .email("admin@healthtech.com")
                    .senha(passwordEncoder.encode("admin123"))
                    .role(RoleUsuario.ADMIN)
                    .build();
            usuarioRepository.save(admin);
            log.info("=== Usuário admin criado: admin@healthtech.com / admin123 ===");
        }
    }
}
