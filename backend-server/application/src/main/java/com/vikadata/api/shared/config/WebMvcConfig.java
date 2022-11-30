package com.vikadata.api.shared.config;

import java.util.ArrayList;
import java.util.List;

import com.vikadata.api.shared.interceptor.I18nInterceptor;
import com.vikadata.api.shared.interceptor.ResourceInterceptor;
import com.vikadata.api.shared.util.page.PageParamHandlerMethodArgumentResolver;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * <p>
 * MVC config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@Import({ ResourceInterceptor.class, I18nInterceptor.class })
public class WebMvcConfig implements WebMvcConfigurer {

    private final ResourceInterceptor resourceInterceptor;

    private final I18nInterceptor i18nInterceptor;

    public WebMvcConfig(ResourceInterceptor resourceInterceptor,
            I18nInterceptor i18nInterceptor) {
        this.resourceInterceptor = resourceInterceptor;
        this.i18nInterceptor = i18nInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        List<String> excludes = new ArrayList<>();
        excludes.add("/");
        excludes.add("/favicon.ico");
        excludes.add("/error/**");
        excludes.add("/doc.html");
        excludes.add("/v2/api-docs-ext");
        excludes.add("/webjars/**");
        excludes.add("/swagger-resources/**");
        excludes.add("/swagger-ui/**");
        excludes.add("/v3/api-docs");
        registry.addInterceptor(resourceInterceptor)
                .excludePathPatterns(excludes);
        // add i18n interceptor
        registry.addInterceptor(i18nInterceptor).excludePathPatterns(excludes);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new PageParamHandlerMethodArgumentResolver());
    }

    /**
     * adapter "/users" -> "/users/"
     *
     * @param configurer path configurer
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseTrailingSlashMatch(true);
    }
}
