package com.apitable.starter.teg.autoconfigure;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.boot.autoconfigure.web.servlet.ConditionalOnMissingFilterBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

/**
 * Tencent Teg SmartProxy authorized access
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(TegProperties.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnProperty(value = "vikadata-starter.teg.enabled", havingValue = "true")
public class SmartProxyAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(SmartProxyAutoConfiguration.class);

    @Bean
    @ConditionalOnMissingBean
    public UnauthorizedResponseCustomizer unauthorizedResponseCustomizer() {
        return new DefaultUnauthorizedResponseCustomizer();
    }

    @Bean
    @ConditionalOnMissingFilterBean
    public SmartProxyFilter SmartProxyFilter(TegProperties tegProperties, ObjectProvider<UnauthorizedResponseCustomizer> customizers) {
        customizerTeg(tegProperties);
        return new SmartProxyFilter(customizers.getIfAvailable(), tegProperties);
    }

    private void customizerTeg(TegProperties properties) {
        if (!StringUtils.hasLength(properties.getTokenKey())) {
            throw new IllegalStateException("teg token key must config");
        }
        LOGGER.info("TegProperties init finish,{} public key", properties);
    }
}
