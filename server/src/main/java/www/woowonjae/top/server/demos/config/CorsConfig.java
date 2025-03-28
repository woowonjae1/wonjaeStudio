package www.woowonjae.top.server.demos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 允许cookies跨域
        config.setAllowCredentials(true);

        // 允许的源
        config.addAllowedOriginPattern("*");
        // next.js 端口
        config.addAllowedOrigin("http://localhost:3000");

        // 允许的HTTP方法
        config.addAllowedMethod("*");

        // 允许的头信息
        config.addAllowedHeader("*");
        // 暴露的头信息
        config.addExposedHeader("Authorization");

        // 预检请求的缓存时间（秒）
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}