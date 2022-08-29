package com.vikadata.boot.autoconfigure.mail;

import com.tencentcloudapi.ses.v20201002.SesClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.mail.CloudMailProperties.Tencent;
import com.vikadata.integration.mail.CloudMailSender;
import com.vikadata.integration.mail.TencentMailSender;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * 腾讯云邮件推送配置
 * </p>
 *
 * @author Chambers
 * @date 2022/2/9
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(SesClient.class)
@ConditionalOnProperty(value = "vikadata-starter.mail.type", havingValue = "tencent")
public class TencentMailAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(TencentMailAutoConfiguration.class);

    private final CloudMailProperties properties;

    public TencentMailAutoConfiguration(CloudMailProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public CloudMailSender cloudMailSender() {
        LOGGER.info("腾讯云邮件推送自动装配");
        Tencent tencent = properties.getTencent();
        return new TencentMailSender(properties.getRegion(), tencent.getSecretId(), tencent.getSecretKey(), properties.getFrom(), properties.getReply());
    }

}
