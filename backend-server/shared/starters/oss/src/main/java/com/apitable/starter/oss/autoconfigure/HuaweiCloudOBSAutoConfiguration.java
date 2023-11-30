package com.apitable.starter.oss.autoconfigure;

import com.apitable.starter.oss.autoconfigure.OssProperties.HuaweiCloud;
import com.apitable.starter.oss.core.OssClientRequestFactory;
import com.apitable.starter.oss.core.obs.HuaweiCloudOssClientRequestFactory;
import com.obs.services.ObsClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * huawei cloud obs auto configuration.
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(ObsClient.class)
@ConditionalOnProperty(value = "starter.oss.type", havingValue = "huawei-cloud")
public class HuaweiCloudOBSAutoConfiguration extends OssConnectionConfiguration {

    public HuaweiCloudOBSAutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean(OssClientRequestFactory.class)
    OssClientRequestFactory ossClientRequestFactory() {
        HuaweiCloud huaweicloud = getProperties().getHuaweiCloud();
        return new HuaweiCloudOssClientRequestFactory(huaweicloud.getAccessKey(),
            huaweicloud.getSecretKey(), huaweicloud.getEndpoint());
    }
}
