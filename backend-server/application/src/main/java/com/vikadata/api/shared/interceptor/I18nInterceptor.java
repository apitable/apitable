package com.vikadata.api.shared.interceptor;

import java.util.Locale;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.common.collect.Sets;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.context.LoginContext;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

/**
 * <p>
 * Internationalized language interceptor
 * </p>
 *
 * @author Pengap
 */
@Slf4j
public class I18nInterceptor extends AbstractServletSupport implements HandlerInterceptor {

    private final Set<String> INCLUDE_SERVLET_PATH = Sets.newHashSet("/client/info", "/client/entry", "/user/me", "/user/update");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException {
        try {
            String requestPath = resolveServletPath(request);
            if (INCLUDE_SERVLET_PATH.contains(requestPath)) {
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
