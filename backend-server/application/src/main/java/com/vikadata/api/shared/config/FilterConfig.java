package com.vikadata.api.shared.config;

import java.util.Arrays;
import java.util.Collections;

import ch.qos.logback.classic.helpers.MDCInsertingServletFilter;
import cn.hutool.core.util.ArrayUtil;

import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.config.properties.CorsProperties;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static com.vikadata.api.shared.constants.FilterConstants.MDC_INSERTING_SERVLET_FILTER;

/**
 * <p>
 * filter config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class FilterConfig {

    private static final String DEFAULT_CSRF_HEADER_NAME = "X-XSRF-TOKEN";

    public static final String X_ORIGINAL_URI = "X-Original-URI";

    private final CorsProperties corsProperties;

    public FilterConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Bean
    public FilterRegistrationBean<MDCInsertingServletFilter> filterMdcBean() {
        FilterRegistrationBean<MDCInsertingServletFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new MDCInsertingServletFilter());
        registrationBean.setOrder(MDC_INSERTING_SERVLET_FILTER);
        return registrationBean;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // Dynamic configuration
        config.setAllowedOriginPatterns(ArrayUtil.isEmpty(corsProperties.getOrigins()) ? Collections.singletonList("*")
                : Arrays.asList(corsProperties.getOrigins()));
        config.setAllowCredentials(true);
        // Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With
        // X-XSRF-TOKEN, X-Original-URI
        config.setAllowedHeaders(Arrays.asList(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION,
            HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ParamsConstants.SPACE_ID,
            FilterConfig.DEFAULT_CSRF_HEADER_NAME, FilterConfig.X_ORIGINAL_URI));
        config.setAllowedMethods(Arrays.asList(HttpMethod.GET.name(), HttpMethod.OPTIONS.name(), HttpMethod.POST.name(),
            HttpMethod.PUT.name(), HttpMethod.PATCH.name(), HttpMethod.DELETE.name()));
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Cross domain filtering and interception of all paths
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
