package com.vikadata.boot.autoconfigure.fundebug;

import com.fundebug.Fundebug;
import com.fundebug.SpringConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * @author Shawn Deng
 * @date 2021-01-08 22:06:44
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(FunDebugProperties.class)
@ConditionalOnClass(Fundebug.class)
@ConditionalOnProperty(value = "vikadata-starter.fundebug.enabled", havingValue = "true")
@Import(SpringConfig.class)
public class FundebugAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(FundebugAutoConfiguration.class);

    private final FunDebugProperties properties;

    public FundebugAutoConfiguration(FunDebugProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(Fundebug.class)
    public Fundebug fundebug() {
        LOGGER.info("异常上报Fundebug平台配置");
        Fundebug fundebug = new Fundebug(properties.getApiKey());
        fundebug.setReleaseStage(properties.getReleaseStage());
        fundebug.setSilent(properties.isSilent());
        return fundebug;
    }
}
