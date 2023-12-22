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

import static com.apitable.shared.constants.FilterConstants.MDC_INSERTING_SERVLET_FILTER;

import ch.qos.logback.classic.helpers.MDCInsertingServletFilter;
import cn.hutool.core.util.StrUtil;
import com.apitable.shared.constants.ParamsConstants;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * <p>
 * filter config.
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class FilterConfig {

    private static final String DEFAULT_CSRF_HEADER_NAME = "X-XSRF-TOKEN";

    public static final String X_ORIGINAL_URI = "X-Original-URI";

    @Value("${CORS_ORIGINS:*}")
    private String origins;

    /**
     * register filter.
     *
     * @return filter registration bean
     */
    @Bean
    public FilterRegistrationBean<MDCInsertingServletFilter> filterMdcBean() {
        FilterRegistrationBean<MDCInsertingServletFilter> registrationBean =
            new FilterRegistrationBean<>();
        registrationBean.setFilter(new MDCInsertingServletFilter());
        registrationBean.setOrder(MDC_INSERTING_SERVLET_FILTER);
        return registrationBean;
    }

    /**
     * define cors filter.
     *
     * @return cors filter
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // Dynamic configuration
        config.setAllowedOriginPatterns(StrUtil.isBlank(origins) ? Collections.singletonList("*")
            : StrUtil.splitTrim(origins, ','));
        config.setAllowCredentials(true);
        // Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With
        // X-XSRF-TOKEN, X-Original-URI
        config.setAllowedHeaders(Arrays.asList(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION,
            HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ParamsConstants.SPACE_ID,
            DEFAULT_CSRF_HEADER_NAME, X_ORIGINAL_URI));
        config.setAllowedMethods(
            Arrays.asList(HttpMethod.GET.name(), HttpMethod.OPTIONS.name(), HttpMethod.POST.name(),
                HttpMethod.PUT.name(), HttpMethod.PATCH.name(), HttpMethod.DELETE.name()));
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Cross domain filtering and interception of all paths
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
