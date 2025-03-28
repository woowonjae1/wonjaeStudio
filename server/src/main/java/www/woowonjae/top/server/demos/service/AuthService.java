package www.woowonjae.top.server.demos.service;

import jakarta.security.auth.message.AuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import www.woowonjae.top.server.demos.dto.JwtResponse;
import www.woowonjae.top.server.demos.dto.LoginRequest;
import www.woowonjae.top.server.demos.dto.RegisterRequest;
import www.woowonjae.top.server.demos.mapper.RoleMapper;
import www.woowonjae.top.server.demos.mapper.UserMapper;
import www.woowonjae.top.server.demos.model.Role;
import www.woowonjae.top.server.demos.model.User;
import www.woowonjae.top.server.demos.security.JwtTokenProvider;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userMapper.findByUsername(userDetails.getUsername());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return new JwtResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles);
    }

    @Transactional
    public void register(RegisterRequest registerRequest) throws AuthException {
        // 检查用户名是否已存在
        if (userMapper.existsByUsername(registerRequest.getUsername())) {
            throw new AuthException("用户名已被使用");
        }

        // 检查邮箱是否已存在
        if (userMapper.existsByEmail(registerRequest.getEmail())) {
            throw new AuthException("邮箱已被使用");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        userMapper.insert(user);

        // 分配默认角色 ROLE_USER
        Role userRole = roleMapper.findByName("ROLE_USER");
        roleMapper.addRoleToUser(user.getId(), userRole.getId());
    }
}