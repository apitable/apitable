package com.apitable.starter.autoconfigure.sms;

import com.yunpian.sdk.YunpianClient;

import com.apitable.starter.autoconfigure.sms.SmsProperties.SmsServer.Yunpian;
import com.vikadata.integration.sms.LocalSmsSenderFactory;
import com.vikadata.integration.sms.OutlandSmsSenderFactory;
import com.vikadata.integration.sms.YunpianLocalSmsSenderFactory;
import com.vikadata.integration.sms.YunpianOutlandSmsSenderFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * autoconfiguration of yunpian sms
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(YunpianClient.class)
public class YunpianSmsAutoConfiguration {

    private final SmsProperties properties;

    public YunpianSmsAutoConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(LocalSmsSenderFactory.class)
    @ConditionalOnProperty(name = "vikadata-starter.sms.local.type", havingValue = "yunpian")
    LocalSmsSenderFactory localSmsSenderFactory() {
        Yunpian yunpian = properties.getLocal().getYunpian();
        return new YunpianLocalSmsSenderFactory(yunpian.getApikey());
    }

    @Bean
    @ConditionalOnMissingBean(OutlandSmsSenderFactory.class)
    @ConditionalOnProperty(name = "vikadata-starter.sms.outland.type", havingValue = "yunpian")
    OutlandSmsSenderFactory smsSenderFactory() {
        Yunpian yunpian = properties.getOutland().getYunpian();
        return new YunpianOutlandSmsSenderFactory(yunpian.getApikey());
    }
}
