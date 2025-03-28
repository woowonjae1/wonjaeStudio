package www.woowonjae.top.server.demos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import www.woowonjae.top.server.demos.security.PasswordMigrationService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private PasswordMigrationService passwordMigrationService;

    @PostMapping("/migrate-passwords")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> migratePasswords() {
        passwordMigrationService.migratePasswords();
        return ResponseEntity.ok().body("密码迁移完成");
    }
}