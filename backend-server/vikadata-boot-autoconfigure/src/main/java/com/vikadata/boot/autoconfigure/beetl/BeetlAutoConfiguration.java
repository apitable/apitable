package com.vikadata.boot.autoconfigure.beetl;

import org.beetl.core.GroupTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * IBeetl渲染模版
 *
 * @author Shawn Deng
 * @date 2021-01-09 01:01:41
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(GroupTemplate.class)
@EnableConfigurationProperties(BeetlProperties.class)
public class BeetlAutoConfiguration {

    private final BeetlProperties properties;

    public BeetlAutoConfiguration(BeetlProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public BeetlTemplate beetlTemplate() {
        return new BeetlTemplate(properties.getClassPath(), properties.getCharset(), properties.getPlaceholderStart(), properties.getPlaceholderEnd());
    }
}
