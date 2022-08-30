package com.vikadata.boot.autoconfigure.oss;

import java.util.Optional;

import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.oss.OssProperties.Callback;
import com.vikadata.boot.autoconfigure.oss.OssProperties.Qiniu;
import com.vikadata.integration.oss.OssClientRequestFactory;
import com.vikadata.integration.oss.qiniu.QiniuOssClientRequestFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 七牛云对象存储自动配置
 *
 * @author Shawn Deng
 * @date 2021-01-05 11:26:17
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(UploadManager.class)
@ConditionalOnProperty(value = "vikadata-starter.oss.type", havingValue = "qiniu")
public class QiniuCloudAutoConfiguration extends OssConnectionConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(QiniuCloudAutoConfiguration.class);

    QiniuCloudAutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean(OssClientRequestFactory.class)
    OssClientRequestFactory ossClientRequestFactory() {
        LOGGER.info("七牛云对象存储自动装配");
        Qiniu qiniu = getProperties().getQiniu();
        Auth auth = Auth.create(qiniu.getAccessKey(), qiniu.getSecretKey());
        Callback callback = Optional.ofNullable(qiniu.getCallback()).orElseGet(Callback::new);

        return new QiniuOssClientRequestFactory(auth, qiniu.getRegion(), qiniu.getDownloadDomain(), callback.getUrl(), callback.getBodyType(), qiniu.getUploadUrl());
    }
}
