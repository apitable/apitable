/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.config;

import static org.springframework.security.config.Customizer.withDefaults;

import cn.hutool.core.util.ArrayUtil;
import com.apitable.shared.config.security.CsrfBeforeFilter;
import com.apitable.shared.util.IgnorePathHelper;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;

/**
 * <p>
 * spring Security config.
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig<S extends Session> {

    @Resource
    private FindByIndexNameSessionRepository<S> sessionRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SpringSessionBackedSessionRegistry<S> sessionRegistry() {
        return new SpringSessionBackedSessionRegistry<>(this.sessionRepository);
    }

    /**
     * configure security filter chain.
     *
     * @param http http security
     * @return security filter chain
     * @throws Exception exception
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CookieCsrfTokenRepository cookieCsrfTokenRepository = new CookieCsrfTokenRepository();
        cookieCsrfTokenRepository.setCookieCustomizer((cookie) -> cookie.httpOnly(false));
        cookieCsrfTokenRepository.setCookiePath("/");
        // opt-out of deferred csrf tokens
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null);
        http
            .cors(withDefaults())
            .sessionManagement((sessionManagement) -> sessionManagement
                .sessionFixation().migrateSession()
                .maximumSessions(5)
                .sessionRegistry(sessionRegistry())
            )
            .authorizeHttpRequests((auth) -> auth.anyRequest().permitAll())
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .logout(AbstractHttpConfigurer::disable)
            .headers(
                (headers) -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
            .csrf((csrf) ->
                csrf.csrfTokenRepository(cookieCsrfTokenRepository)
                    .csrfTokenRequestHandler(requestHandler)
                    .ignoringRequestMatchers(
                        ArrayUtil.toArray(IgnorePathHelper.getInstant().iterator(), String.class)
                    )
                    .ignoringRequestMatchers(
                        "/internal/**",
                        "/actuator/**",
                        "/social/**",
                        "/wechat/**",
                        "/feishu/**",
                        "/lark/event/**",
                        "/lark/idp/**",
                        "/vcode/**",
                        "/dingtalk/**",
                        "/auth0/**",
                        "/idaas/**",
                        "/ai/**",
                        "/airagent/**",
                        "/appsumo/**",
                        "/invitation/**"
                    )
            )
            .addFilterBefore(new CsrfBeforeFilter(), CsrfFilter.class);
        return http.build();
    }
}
