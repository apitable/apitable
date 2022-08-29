package com.vikadata.boot.autoconfigure.connector;

import com.vikadata.connector.k11.K11Connector;
import com.vikadata.connector.k11.K11Template;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * 新世界 k11 连接器自动配置
 * </p>
 *
 * @author Chambers
 * @date 2021/6/21
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
