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

package com.apitable.shared.interceptor;

import com.apitable.shared.context.LoginContext;
import com.google.common.collect.Sets;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Locale;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

/**
 * <p>
 * Internationalized language interceptor.
 * </p>
 *
 * @author Pengap
 */
@Slf4j
public class I18nInterceptor extends AbstractServletSupport implements HandlerInterceptor {

    private static final Set<String> INCLUDE_SERVLET_PATH =
        Sets.newHashSet("/client/info", "/client/entry", "/user/me", "/user/update");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        try {
            String requestPath = resolveServletPath(request);
            if (INCLUDE_SERVLET_PATH.contains(requestPath)) {
                Locale newLocale = LoginContext.me().getLocale();
                LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
                if (localeResolver == null) {
                    throw new IllegalStateException(
                        "No LocaleResolver found: not in a DispatcherServlet request?");
                }
                localeResolver.setLocale(request, response, newLocale);
            }
        } catch (Exception e) {
            log.error("i18nInterceptor run error", e);
        }
        return true;
    }

}
