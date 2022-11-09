package com.apitable.starter.connector.k11.autoconfigure;

import com.apitable.starter.connector.k11.K11Connector;
import com.apitable.starter.connector.k11.K11Template;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * k11 connector autoconfiguration
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "vikadata-connector.k11.enabled", havingValue = "true")
@EnableConfigurationProperties(K11Properties.class)
public class K11AutoConfiguration {

    private final K11Properties properties;

    public K11AutoConfiguration(K11Properties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public K11Connector connector() {
        return new K11Template(properties.getDomain(), properties.getAppId(), properties.getAppSecret(), properties.getSmsTempCode());
    }
}
