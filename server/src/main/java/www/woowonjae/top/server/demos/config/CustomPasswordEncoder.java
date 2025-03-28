package www.woowonjae.top.server.demos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomPasswordEncoder implements PasswordEncoder {

    private static final Logger logger = LoggerFactory.getLogger(CustomPasswordEncoder.class);
    private final BCryptPasswordEncoder bCryptEncoder = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawPassword) {
        // 始终使用BCrypt进行新密码编码
        return bCryptEncoder.encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // 检查是否是BCrypt格式
        if (encodedPassword != null && (encodedPassword.startsWith("$2a$") ||
                encodedPassword.startsWith("$2b$") ||
                encodedPassword.startsWith("$2y$"))) {
            return bCryptEncoder.matches(rawPassword, encodedPassword);
        } else {
            // 如果不是BCrypt格式，假设是明文存储
            logger.info("使用明文密码比较: {}", encodedPassword);
            return rawPassword.toString().equals(encodedPassword);
        }
    }
}