package com.vikadata.boot.autoconfigure.security.afs;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * 人机验证服务自动配置
 * </p>
 *
 * @author Chambers
 * @date 2020/3/2
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(AfsProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.afs.enabled", havingValue = "true")
@Import({ AliyunAfsAutoConfiguration.class })
public class AfsAutoConfiguration {

}
