package com.vikadata.api.config;

import cn.hutool.core.util.ArrayUtil;

import com.vikadata.api.config.security.CsrfBeforeFilter;
import com.vikadata.api.helper.IgnorePathHelper;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * <p>
 * Security 配置 这里配置应用安全的参数
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * BCrypt 自定义密码的编码方式
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Http 安全配置
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 开启跨域，点击进去了解源码，自动查找Bean: CorsConfigurationSource | CorsFilter
        // cors(withDefaults())设置代表返回HttpSecurity
        http.cors(withDefaults());
        // Session管理策略
        http.sessionManagement()
                .sessionFixation().migrateSession()
                .maximumSessions(5);
        // 所有请求放行，自己实现拦截器，不使用过滤器
        http.authorizeRequests().anyRequest().permitAll();
        // 关闭HTTP Basic 认证
        http.httpBasic().disable();
        // 关闭默认登录路径拦截：/login
        http.formLogin().disable();
        // 关闭默认注销登录路径拦截:/logout
        http.logout().disable();
        // 关闭iframe拦截，允许第三方网站用iframe方式嵌入
        http.headers().frameOptions().disable();
        // 有效期默认为当前会话，完全关闭浏览器清除
        CookieCsrfTokenRepository cookieCsrfTokenRepository = new CookieCsrfTokenRepository();
        cookieCsrfTokenRepository.setCookiePath("/");
        cookieCsrfTokenRepository.setCookieHttpOnly(false);
        http.csrf().csrfTokenRepository(cookieCsrfTokenRepository)
                .ignoringAntMatchers(ArrayUtil.toArray(IgnorePathHelper.getInstant().iterator(), String.class))
                .ignoringAntMatchers("/internal/**")
                .ignoringAntMatchers("/actuator/**")
                .ignoringAntMatchers("/social/**")
                .ignoringAntMatchers("/wechat/**")
                .ignoringAntMatchers("/feishu/**")
                .ignoringAntMatchers("/lark/event/**")
                .ignoringAntMatchers("/lark/idp/**")
                .ignoringAntMatchers("/vcode/**")
                .ignoringAntMatchers("/dingtalk/**")
                .ignoringAntMatchers("/auth0/**")
                .ignoringAntMatchers("/idaas/**");
        http.addFilterBefore(new CsrfBeforeFilter(), CsrfFilter.class);
    }
}
