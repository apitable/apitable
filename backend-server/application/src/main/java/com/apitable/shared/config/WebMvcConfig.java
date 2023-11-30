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

import com.apitable.shared.interceptor.I18nInterceptor;
import com.apitable.shared.interceptor.ResourceInterceptor;
import com.apitable.shared.util.page.PageParamHandlerMethodArgumentResolver;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * MVC config.
 */
@Configuration(proxyBeanMethods = false)
@Import({ResourceInterceptor.class, I18nInterceptor.class})
public class WebMvcConfig implements WebMvcConfigurer {

    private final ResourceInterceptor resourceInterceptor;

    private final I18nInterceptor i18nInterceptor;

    public static final List<String> INTERCEPTOR_IGNORE_PATHS = new ArrayList<>();

    static {
        INTERCEPTOR_IGNORE_PATHS.add("/");
        INTERCEPTOR_IGNORE_PATHS.add("/favicon.ico");
        INTERCEPTOR_IGNORE_PATHS.add("/error/**");
        INTERCEPTOR_IGNORE_PATHS.add("/doc.html");
        INTERCEPTOR_IGNORE_PATHS.add("/v2/api-docs-ext");
        INTERCEPTOR_IGNORE_PATHS.add("/webjars/**");
        INTERCEPTOR_IGNORE_PATHS.add("/swagger-resources/**");
        INTERCEPTOR_IGNORE_PATHS.add("/swagger-ui/**");
        INTERCEPTOR_IGNORE_PATHS.add("/swagger-ui.html");
        INTERCEPTOR_IGNORE_PATHS.add("/v3/api-docs/**");
        INTERCEPTOR_IGNORE_PATHS.add("/node/readShareInfo/**");
    }

    public WebMvcConfig(ResourceInterceptor resourceInterceptor,
                        I18nInterceptor i18nInterceptor) {
        this.resourceInterceptor = resourceInterceptor;
        this.i18nInterceptor = i18nInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(resourceInterceptor)
            .excludePathPatterns(INTERCEPTOR_IGNORE_PATHS);
        // add i18n interceptor
        registry.addInterceptor(i18nInterceptor).excludePathPatterns(INTERCEPTOR_IGNORE_PATHS);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new PageParamHandlerMethodArgumentResolver());
    }

    /**
     * adapter "/users" -> "/users/".
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseTrailingSlashMatch(true);
    }
}
