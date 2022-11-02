package com.vikadata.api.config;

import java.io.IOException;
import java.io.Writer;
import java.nio.charset.StandardCharsets;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.component.ApiResourceFactory;
import com.vikadata.api.constants.FilterConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.component.ResourceDefinition;
import com.vikadata.api.modular.social.mapper.SocialUserBindMapper;
import com.vikadata.boot.autoconfigure.teg.TegProperties.SmartProxyHeaderProperty;
import com.vikadata.boot.autoconfigure.xiaomi.UnauthorizedResponseCustomizer;
import com.vikadata.core.support.ResponseData;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.api.enums.exception.AuthException.UNAUTHORIZED;

/**
 *  Teg Adapter config
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "vikadata-starter.teg.enabled", havingValue = "true")
public class TegAdapterConfig {

    @Primary
    @Bean
    public UnauthorizedResponseCustomizer noAuthResponseCustomizer(ObjectMapper objectMapper) {
        return response -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            try (Writer writer = response.getWriter()) {
                objectMapper.writeValue(writer, ResponseData.error(UNAUTHORIZED.getCode(), UNAUTHORIZED.getMessage()));
                writer.flush();
            }
            catch (IOException e) {
                throw new ServletException(e);
            }
        };
    }

    @Bean
    FilterRegistrationBean<JwtProxyUserDetailFilter> JwtProxyUserDetailFilter(BeanFactory beanFactory, ApiResourceFactory resourceFactory) {
        FilterRegistrationBean<JwtProxyUserDetailFilter> filterRegistrationBean =
            new FilterRegistrationBean<>(new JwtProxyUserDetailFilter(beanFactory, resourceFactory));
        filterRegistrationBean.setOrder(FilterConstants.TRACE_REQUEST_FILTER);
        filterRegistrationBean.setOrder(Ordered.LOWEST_PRECEDENCE);
        return filterRegistrationBean;
    }
}

@Slf4j
final class JwtProxyUserDetailFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtProxyUserDetailFilter.class);

    private final BeanFactory beanFactory;

    private final ApiResourceFactory apiResourceFactory;

    public JwtProxyUserDetailFilter(BeanFactory beanFactory, ApiResourceFactory apiResourceFactory) {
        this.beanFactory = beanFactory;
        this.apiResourceFactory = apiResourceFactory;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String serverPath = request.getServletPath();
        ResourceDefinition resourceDef = apiResourceFactory.getResourceByUrl(serverPath);
        String ignoreUrl = (String)request.getAttribute(SmartProxyHeaderProperty.REQUEST_IGNORE_URL);
        if (serverPath.equals(ignoreUrl)){
            LOGGER.info("Service check to Smart Proxy ignore path: {}", serverPath);
            filterChain.doFilter(request, response);
            return;
        }

        if (resourceDef != null) {
            if (!resourceDef.getRequiredLogin()) {
                LOGGER.info("No session path required: {}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
        }

        // Get Identity Single Sign On
        String jwtStaffName = request.getHeader(SmartProxyHeaderProperty.REQUEST_STAFFNAME);
        if (StrUtil.isBlank(jwtStaffName)) {
            throw new ServletException(UNAUTHORIZED.getMessage());
        }
        SocialUserBindMapper socialUserBindMapper = beanFactory.getBean(SocialUserBindMapper.class);
        Long userId = socialUserBindMapper.selectUserIdByUnionId(jwtStaffName);
        if (userId == null) {
            // Unsynced users are not allowed to log in
            log.info("User does not exist, please create user first[{}]",jwtStaffName);
            throw new ServletException(UNAUTHORIZED.getMessage());
        }
        SessionContext.setExternalId(userId, jwtStaffName);
        filterChain.doFilter(request, response);
    }
}