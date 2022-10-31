package com.vikadata.api.config;

import java.time.Duration;
import java.util.Locale;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.CookieProperties;

import org.springframework.boot.autoconfigure.session.DefaultCookieSerializerCustomizer;
import org.springframework.boot.autoconfigure.session.SessionProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

/**
 * <p>
 * session cookie config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class SessionCookieConfig {

    private final ConstProperties constProperties;

    private final CookieProperties cookieProperties;

    private final SessionProperties sessionProperties;

    public SessionCookieConfig(ConstProperties constProperties, CookieProperties cookieProperties, SessionProperties sessionProperties) {
        this.constProperties = constProperties;
        this.cookieProperties = cookieProperties;
        this.sessionProperties = sessionProperties;
    }

    @Bean
    public DefaultCookieSerializerCustomizer customizer() {
        return cookieSerializer -> {
            cookieSerializer.setCookiePath("/");
            String cookieName = cookieProperties.getCookieName();
            if (null != cookieName) {
                cookieSerializer.setCookieName(cookieName);
            }
            cookieSerializer.setDomainName(cookieProperties.getDomainName());
            cookieSerializer.setUseHttpOnlyCookie(true);
            cookieSerializer.setUseSecureCookie(cookieProperties.getSecure());
            // SamSite set null，old browser not support，default Lax
            cookieSerializer.setSameSite(null);
            Duration timeout = sessionProperties.getTimeout();
            if (timeout != null) {
                cookieSerializer.setCookieMaxAge((int) timeout.getSeconds());
            }
        };
    }

    @Bean
    public LocaleResolver localeResolver() {
        // cache locale using cookies
        CookieLocaleResolver localeResolver = new CookieLocaleResolver();
        localeResolver.setDefaultLocale(Locale.forLanguageTag(constProperties.getLanguageTag()));
        localeResolver.setCookieName(cookieProperties.getI18nCookieName());
        localeResolver.setCookieDomain(cookieProperties.getDomainName());
        Duration timeout = sessionProperties.getTimeout();
        if (timeout != null) {
            localeResolver.setCookieMaxAge((int) timeout.getSeconds());
        }
        return localeResolver;
    }

}
