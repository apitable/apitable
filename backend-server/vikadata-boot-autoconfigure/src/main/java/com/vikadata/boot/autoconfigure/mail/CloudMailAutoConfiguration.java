package com.vikadata.boot.autoconfigure.mail;

import com.vikadata.integration.mail.CloudMailSender;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * 云平台邮件推送自动化配置
 * </p>
 *
 * @author Chambers
 * @date 2022/2/9
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(CloudMailSender.class)
@EnableConfigurationProperties(CloudMailProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.mail.enabled", havingValue = "true")
@Import({ TencentMailAutoConfiguration.class })
public class CloudMailAutoConfiguration {


}
