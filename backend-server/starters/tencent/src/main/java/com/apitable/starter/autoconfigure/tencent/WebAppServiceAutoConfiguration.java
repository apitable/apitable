package com.apitable.starter.autoconfigure.tencent;

import com.vikadata.social.qq.AppConfig;
import com.vikadata.social.qq.QQTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * autoconfiguration of tencent open platform
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(QQTemplate.class)
@ConditionalOnProperty(value = "vikadata-starter.tencent.webapp.enabled", havingValue = "true")
@EnableConfigurationProperties(WebAppProperties.class)
public class WebAppServiceAutoConfiguration {

    private final WebAppProperties properties;

    public WebAppServiceAutoConfiguration(WebAppProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public QQTemplate qqTemplate() {
        return new QQTemplate(applyConfig());
    }

    private AppConfig applyConfig() {
        AppConfig config = new AppConfig();
        config.setAppId(properties.getAppId());
        config.setAppKey(properties.getAppKey());
        config.setRedirectUri(properties.getRedirectUri());
        config.setApplyUnion(properties.isApplyUnion());
        return config;
    }
}
