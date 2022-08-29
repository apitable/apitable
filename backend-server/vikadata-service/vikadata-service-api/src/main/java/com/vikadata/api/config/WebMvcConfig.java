package com.vikadata.api.config;

import java.util.ArrayList;
import java.util.List;

import com.vikadata.api.handler.PageParamHandlerMethodArgumentResolver;
import com.vikadata.api.handler.StringObjectParamHandlerMethodArgumentResolver;
import com.vikadata.api.interceptor.ExclusiveDomainNameInterceptor;
import com.vikadata.api.interceptor.I18nInterceptor;
import com.vikadata.api.interceptor.ResourceInterceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * <p>
 * MVC 配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 15:08
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
        //1.加入的顺序就是拦截器执行的顺序
        //2.按顺序执行所有拦截器的preHandle
        //3.所有的preHandle 执行完再按序执行postHandle 最后是按序执行afterCompletion
        //资源请求拦截
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
        // 资源拦截器
        registry.addInterceptor(resourceInterceptor)
                .excludePathPatterns(excludes);
        // 专属域名拦截器（为了方便调试，只有在配置指定环境下才会激活）
        if (null != exclusiveDomainNameInterceptor) {
            registry.addInterceptor(exclusiveDomainNameInterceptor)
                    .excludePathPatterns(excludes);
        }
        // i18n国际化参数拦截器
        registry.addInterceptor(i18nInterceptor).excludePathPatterns(excludes);
    }

    /**
     * 控制器参数转换器
     */
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        // 字符串参数转换分页对象
        resolvers.add(new PageParamHandlerMethodArgumentResolver());
        // 字符串参数转对象
        resolvers.add(new StringObjectParamHandlerMethodArgumentResolver());
    }

    /**
     * 适配 "/users" -> "/users/"
     *
     * @param configurer 路径配置器
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseTrailingSlashMatch(true);
    }

}
