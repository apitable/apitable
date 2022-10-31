package com.vikadata.boot.autoconfigure.sms;

import com.github.qcloudsms.SmsMultiSender;
import com.github.qcloudsms.SmsSingleSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.sms.SmsProperties.SmsServer.Tencent;
import com.vikadata.integration.sms.LocalSmsSenderFactory;
import com.vikadata.integration.sms.OutlandSmsSenderFactory;
import com.vikadata.integration.sms.TencentLocalSmsSenderFactory;
import com.vikadata.integration.sms.TencentOutlandSmsSenderFactory;

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
