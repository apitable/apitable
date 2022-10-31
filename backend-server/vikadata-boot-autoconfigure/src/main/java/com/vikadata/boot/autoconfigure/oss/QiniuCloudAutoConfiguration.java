package com.vikadata.boot.autoconfigure.oss;

import java.util.Optional;

import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;

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
 * autoconfiguration of Qiniu Cloud object storage
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(UploadManager.class)
@ConditionalOnProperty(value = "vikadata-starter.oss.type", havingValue = "qiniu")
public class QiniuCloudAutoConfiguration extends OssConnectionConfiguration {

    QiniuCloudAutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean(OssClientRequestFactory.class)
    OssClientRequestFactory ossClientRequestFactory() {
        Qiniu qiniu = getProperties().getQiniu();
        Auth auth = Auth.create(qiniu.getAccessKey(), qiniu.getSecretKey());
        Callback callback = Optional.ofNullable(qiniu.getCallback()).orElseGet(Callback::new);

        return new QiniuOssClientRequestFactory(auth, qiniu.getRegion(), qiniu.getDownloadDomain(), callback.getUrl(), callback.getBodyType(), qiniu.getUploadUrl());
    }
}
