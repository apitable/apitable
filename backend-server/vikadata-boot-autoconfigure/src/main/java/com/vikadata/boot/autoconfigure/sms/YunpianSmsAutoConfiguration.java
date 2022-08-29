package com.vikadata.boot.autoconfigure.sms;

import com.yunpian.sdk.YunpianClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.oss.QiniuCloudAutoConfiguration;
import com.vikadata.boot.autoconfigure.sms.SmsProperties.SmsServer.Yunpian;
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
 * 云片短信自动配置
 * </p>
 *
 * @author Chambers
 * @date 2021/5/10
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(YunpianClient.class)
public class YunpianSmsAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(YunpianSmsAutoConfiguration.class);

    private final SmsProperties properties;

    public YunpianSmsAutoConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(LocalSmsSenderFactory.class)
    @ConditionalOnProperty(name = "vikadata-starter.sms.local.type", havingValue = "yunpian")
    LocalSmsSenderFactory localSmsSenderFactory() {
        LOGGER.info("云片本地短信自动装配");
        Yunpian yunpian = properties.getLocal().getYunpian();
        return new YunpianLocalSmsSenderFactory(yunpian.getApikey());
    }

    @Bean
    @ConditionalOnMissingBean(OutlandSmsSenderFactory.class)
    @ConditionalOnProperty(name = "vikadata-starter.sms.outland.type", havingValue = "yunpian")
    OutlandSmsSenderFactory smsSenderFactory() {
        LOGGER.info("云片外地短信自动装配");
        Yunpian yunpian = properties.getOutland().getYunpian();
        return new YunpianOutlandSmsSenderFactory(yunpian.getApikey());
    }
}
