package com.vikadata.api.config;

import cn.hutool.core.util.ArrayUtil;

import com.vikadata.api.config.security.CsrfBeforeFilter;
import com.vikadata.api.util.IgnorePathHelper;

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
 * spring Security config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors(withDefaults());
        http.sessionManagement()
                .sessionFixation().migrateSession()
                .maximumSessions(5);
        http.authorizeRequests().anyRequest().permitAll();
        http.httpBasic().disable();
        http.formLogin().disable();
        http.logout().disable();
        http.headers().frameOptions().disable();
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
