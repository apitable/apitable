package com.apitable.starter.mail.autoconfigure;

import com.tencentcloudapi.ses.v20201002.SesClient;

import com.apitable.starter.mail.autoconfigure.CloudMailProperties.Tencent;
import com.apitable.starter.mail.core.CloudMailSender;
import com.apitable.starter.mail.core.TencentMailSender;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * Tencent cloud mail configuration
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(SesClient.class)
@ConditionalOnProperty(value = "vikadata-starter.mail.type", havingValue = "tencent")
public class TencentMailAutoConfiguration {

    private final CloudMailProperties properties;

    public TencentMailAutoConfiguration(CloudMailProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public CloudMailSender cloudMailSender() {
        Tencent tencent = properties.getTencent();
        return new TencentMailSender(properties.getRegion(), tencent.getSecretId(), tencent.getSecretKey(), properties.getFrom(), properties.getReply());
    }

}
