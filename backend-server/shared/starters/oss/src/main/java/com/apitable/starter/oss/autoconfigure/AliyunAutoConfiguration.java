package com.apitable.starter.oss.autoconfigure;

import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssClientRequestFactory;
import com.apitable.starter.oss.core.aliyun.AliyunOssClientRequestFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * Aliyun Cloud OSS storage autoconfiguration
 *
 * @author johnsoyzhao zzzzhaoziye@gmail.com
 * @Date 2023/1/31
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(OssClientRequest.class)
@ConditionalOnProperty(value = "starter.oss.type", havingValue = "aliyun")
public class AliyunAutoConfiguration extends OssConnectionConfiguration{

    protected AliyunAutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean(OssClientRequestFactory.class)
    OssClientRequestFactory ossClientRequestFactory() {
        OssProperties.Aliyun aliyun = getProperties().getAliyun();
        return new AliyunOssClientRequestFactory(aliyun.getEndpoint(), aliyun.getAccessKeyId(), aliyun.getAccessKeySecret());
    }
}
