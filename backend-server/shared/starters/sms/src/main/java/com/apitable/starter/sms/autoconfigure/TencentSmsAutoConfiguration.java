package com.apitable.starter.sms.autoconfigure;

import com.github.qcloudsms.SmsMultiSender;
import com.github.qcloudsms.SmsSingleSender;

import com.apitable.starter.sms.autoconfigure.SmsProperties.SmsServer.Tencent;
import com.apitable.starter.sms.core.LocalSmsSenderFactory;
import com.apitable.starter.sms.core.OutlandSmsSenderFactory;
import com.apitable.starter.sms.core.TencentLocalSmsSenderFactory;
import com.apitable.starter.sms.core.TencentOutlandSmsSenderFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * autoconfiguration of Tencent cloud SMS
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({SmsSingleSender.class, SmsMultiSender.class})
public class TencentSmsAutoConfiguration {

    private final SmsProperties properties;

    public TencentSmsAutoConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(LocalSmsSenderFactory.class)
    @ConditionalOnProperty(name = "vikadata-starter.sms.local.type", havingValue = "tencent")
    LocalSmsSenderFactory localSmsSenderFactory() {
        Tencent tencent = properties.getLocal().getTencent();
        return new TencentLocalSmsSenderFactory(tencent.getAppId(), tencent.getAppKey(), tencent.getSign());
    }

    @Bean
    @ConditionalOnMissingBean(OutlandSmsSenderFactory.class)
    @ConditionalOnProperty(name = "vikadata-starter.sms.outland.type", havingValue = "tencent")
    OutlandSmsSenderFactory smsSenderFactory() {
        Tencent tencent = properties.getOutland().getTencent();
        return new TencentOutlandSmsSenderFactory(tencent.getAppId(), tencent.getAppKey(), tencent.getSign());
    }
}
