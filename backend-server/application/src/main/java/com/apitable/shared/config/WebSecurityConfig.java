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
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;

/**
 * <p>
 * spring Security config.
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
            .ignoringAntMatchers(
                ArrayUtil.toArray(IgnorePathHelper.getInstant().iterator(), String.class))
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
            .ignoringAntMatchers("/idaas/**")
            .ignoringAntMatchers("/ai/**")
            .ignoringAntMatchers("/airagent/**")
            .ignoringAntMatchers("/appsumo/**");
        http.addFilterBefore(new CsrfBeforeFilter(), CsrfFilter.class);
    }
}
