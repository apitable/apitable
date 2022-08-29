package com.vikadata.boot.autoconfigure.qq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.qq.AppConfig;
import com.vikadata.social.qq.QQTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * QQ互联-网站应用 相关服务自动配置
 *
 * @author Chambers
 * @date 2020/10/16
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(QQTemplate.class)
@ConditionalOnProperty(value = "vikadata-starter.tencent.webapp.enabled", havingValue = "true")
@EnableConfigurationProperties(WebAppProperties.class)
public class WebAppServiceAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebAppServiceAutoConfiguration.class);

    private final WebAppProperties properties;

    public WebAppServiceAutoConfiguration(WebAppProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public QQTemplate qqTemplate() {
        LOGGER.info("QQ互联-网站应用自动装配");
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
