package com.vikadata.boot.autoconfigure.oss;

import com.vikadata.integration.oss.OssClientRequestFactory;
import com.vikadata.integration.oss.OssClientTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;


/**
 * Object Storage Auto Configuration
 *
 * @author Benson Cheung
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(OssProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.oss.enabled", havingValue = "true")
@ConditionalOnClass(OssClientTemplate.class)
@Import({ AwsS3AutoConfiguration.class,
        QiniuCloudAutoConfiguration.class,
        MinioAutoConfiguration.class })
public class OssAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public OssClientTemplate ossClientTemplate(OssClientRequestFactory factory) {
        OssClientTemplate template = new OssClientTemplate();
        template.setOssClientRequestFactory(factory);
        return template;
    }
}
