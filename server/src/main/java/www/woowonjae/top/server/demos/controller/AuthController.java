package www.woowonjae.top.server.demos.controller;

import jakarta.security.auth.message.AuthException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import www.woowonjae.top.server.demos.dto.JwtResponse;
import www.woowonjae.top.server.demos.dto.LoginRequest;
import www.woowonjae.top.server.demos.dto.RegisterRequest;
import www.woowonjae.top.server.demos.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) throws AuthException {
        authService.register(registerRequest);
        return ResponseEntity.ok().body("用户注册成功");
    }
}