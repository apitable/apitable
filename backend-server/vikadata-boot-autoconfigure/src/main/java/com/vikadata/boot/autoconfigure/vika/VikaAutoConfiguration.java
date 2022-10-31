package com.vikadata.boot.autoconfigure.vika;


import cn.vika.client.api.VikaApiClient;

import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.VikaTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * autoconfiguration of vika sdk
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(VikaApiClient.class)
@EnableConfigurationProperties(VikaProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.vika.enabled", havingValue = "true")
public class VikaAutoConfiguration {

    private final VikaProperties properties;

    public VikaAutoConfiguration(VikaProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(VikaOperations.class)
    public VikaOperations vikaOperations() {
        return new VikaTemplate(properties.getHost(), properties.getToken());
    }
}
