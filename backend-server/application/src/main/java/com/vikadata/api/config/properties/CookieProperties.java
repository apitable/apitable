package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.CookieProperties.PREFIX;

/**
 * <p>
 * Cookie properties
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class CookieProperties {

    public static final String PREFIX = "vikadata.cookie";

    /**
     * cookies name
     */
    private String cookieName;

    /**
     * Session Domain Name Scope
     */
    private String domainName;

    /**
     * locale 118n cookies name
     */
    private String i18nCookieName;

    /**
     * Session Domain Name Scope（use regex pattern，use domainName first if existed）
     */
    private String domainNamePattern;

    /**
     * Whether to open the session https, default: false
     */
    private Boolean secure = false;

    /**
     * Available values：Strict，Lax，None，default: none
     */
    private String sameSite = "None";
}
