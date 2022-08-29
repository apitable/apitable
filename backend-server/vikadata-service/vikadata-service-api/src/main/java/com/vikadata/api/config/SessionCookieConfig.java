package com.vikadata.api.config;

import java.time.Duration;

import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.config.properties.CookieProperties;

import org.springframework.boot.autoconfigure.session.DefaultCookieSerializerCustomizer;
import org.springframework.boot.autoconfigure.session.SessionProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

/**
 * <p>
 * session cookie配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/28 20:22
 */
@Configuration(proxyBeanMethods = false)
public class SessionCookieConfig {

    private final CookieProperties cookieProperties;

    private final SessionProperties sessionProperties;

    public SessionCookieConfig(CookieProperties cookieProperties, SessionProperties sessionProperties) {
        this.cookieProperties = cookieProperties;
        this.sessionProperties = sessionProperties;
    }

    @Bean
    public DefaultCookieSerializerCustomizer customizer() {
        return cookieSerializer -> {
            cookieSerializer.setCookiePath("/");
            // 设置cookie标识名称
            String cookieName = cookieProperties.getCookieName();
            if (null != cookieName) {
                cookieSerializer.setCookieName(cookieName);
            }
            cookieSerializer.setDomainName(cookieProperties.getDomainName());
            cookieSerializer.setUseHttpOnlyCookie(true);
            cookieSerializer.setUseSecureCookie(cookieProperties.getSecure());
            // SamSite 设置为空，旧版本浏览器不带回该属性，新版本启用默认值 Lax
            cookieSerializer.setSameSite(null);
            // 设置返回cookie过期时间
            Duration timeout = sessionProperties.getTimeout();
            if (timeout != null) {
                cookieSerializer.setCookieMaxAge((int) timeout.getSeconds());
            }
        };
    }

    @Bean
    public LocaleResolver localeResolver() {
        // 使用Cookies方式缓存国际化信息，也可以使用session
        CookieLocaleResolver localeResolver = new CookieLocaleResolver();
        localeResolver.setDefaultLocale(LanguageManager.me().getDefaultLanguage());
        localeResolver.setCookieName(cookieProperties.getI18nCookieName());
        localeResolver.setCookieDomain(cookieProperties.getDomainName());
        // 设置返回cookie过期时间
        Duration timeout = sessionProperties.getTimeout();
        if (timeout != null) {
            localeResolver.setCookieMaxAge((int) timeout.getSeconds());
        }
        return localeResolver;
    }

}
