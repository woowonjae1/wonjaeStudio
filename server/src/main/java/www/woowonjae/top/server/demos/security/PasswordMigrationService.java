package www.woowonjae.top.server.demos.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import www.woowonjae.top.server.demos.mapper.UserMapper;
import www.woowonjae.top.server.demos.model.User;

import java.util.List;

@Service
public class PasswordMigrationService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void migratePasswords() {
        List<User> users = userMapper.findAll();

        for (User user : users) {
            // 获取明文密码
            String plainPassword = user.getPassword();

            // 如果密码不是BCrypt格式，则加密
            if (!plainPassword.startsWith("$2a$") &&
                    !plainPassword.startsWith("$2b$") &&
                    !plainPassword.startsWith("$2y$")) {

                // 加密密码
                String encodedPassword = passwordEncoder.encode(plainPassword);

                // 更新用户密码
                userMapper.updatePassword(user.getId(), encodedPassword);
            }
        }
    }
}