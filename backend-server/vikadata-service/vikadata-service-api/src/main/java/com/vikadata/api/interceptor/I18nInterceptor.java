package com.vikadata.api.interceptor;

import java.util.Locale;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.common.collect.Sets;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.LoginContext;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

/**
 * <p>
 * 国际化语言拦截器
 * </p>
 *
 * @author Pengap
 * @date 2021/12/14 01:18:48
 */
@Slf4j
@Configuration(proxyBeanMethods = false)
public class I18nInterceptor extends AbstractServletSupport implements HandlerInterceptor {

    private final Set<String> INCLUDE_SERVLET_PATH = Sets.newHashSet("/client/info", "/client/entry", "/user/me");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException {
        try {
            // 解析地址
            String requestPath = resolveServletPath(request);
            // 匹配拦截地址
            if (INCLUDE_SERVLET_PATH.contains(requestPath)) {
                // 获取登陆用户信息，如果没有设置就解析浏览器环境
                Locale newLocale = LoginContext.me().getLocale();

                LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
                if (localeResolver == null) {
                    throw new IllegalStateException("No LocaleResolver found: not in a DispatcherServlet request?");
                }
                localeResolver.setLocale(request, response, newLocale);
            }
        }
        catch (Exception e) {
            log.error("i18nInterceptor run error", e);
        }
        return true;
    }

}
