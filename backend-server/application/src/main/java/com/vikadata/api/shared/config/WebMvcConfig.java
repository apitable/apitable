package com.vikadata.api.shared.config;

import java.util.ArrayList;
import java.util.List;

import com.vikadata.api.shared.util.page.PageParamHandlerMethodArgumentResolver;
import com.vikadata.api.shared.interceptor.ExclusiveDomainNameInterceptor;
import com.vikadata.api.shared.interceptor.I18nInterceptor;
import com.vikadata.api.shared.interceptor.ResourceInterceptor;

import org.springframework.beans.factory.annotation.Autowired;
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
@Import({ ResourceInterceptor.class })
public class WebMvcConfig implements WebMvcConfigurer {

    private final ResourceInterceptor resourceInterceptor;

    private final ExclusiveDomainNameInterceptor exclusiveDomainNameInterceptor;

    private final I18nInterceptor i18nInterceptor;

    public WebMvcConfig(ResourceInterceptor resourceInterceptor,
            @Autowired(required = false) ExclusiveDomainNameInterceptor exclusiveDomainNameInterceptor,
            I18nInterceptor i18nInterceptor) {
        this.resourceInterceptor = resourceInterceptor;
        this.exclusiveDomainNameInterceptor = exclusiveDomainNameInterceptor;
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
        // for wecom
        if (null != exclusiveDomainNameInterceptor) {
            registry.addInterceptor(exclusiveDomainNameInterceptor)
                    .excludePathPatterns(excludes);
        }
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
