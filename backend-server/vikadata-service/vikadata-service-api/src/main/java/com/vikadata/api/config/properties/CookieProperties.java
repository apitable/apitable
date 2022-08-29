package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.CookieProperties.PREFIX;

/**
 * <p>
 * Cookie 配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/28 20:18
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class CookieProperties {

    public static final String PREFIX = "vikadata.cookie";

    /**
     * 会话cookie标识名称
     */
    private String cookieName;

    /**
     * 会话域名作用域
     */
    private String domainName;

    /**
     * 国际化cookie名称
     */
    private String i18nCookieName;

    /**
     * 会话域名作用域（匹配正则表达式，优先使用domainName）
     */
    private String domainNamePattern;

    /**
     * 是否开启会话Https,默认: false
     */
    private Boolean secure = false;

    /**
     * 限制第三方 Cookie,可配置值：Strict，Lax，None，默认none
     */
    private String sameSite = "None";
}
