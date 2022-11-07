package com.apitable.starter.autoconfigure.oss;

import java.util.Optional;

import com.qiniu.util.Auth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.apitable.starter.autoconfigure.oss.OssProperties.Callback;
import com.apitable.starter.autoconfigure.oss.OssProperties.Qiniu;
import com.vikadata.integration.oss.qiniu.QiniuOssClientRequestFactory;
import com.vikadata.integration.oss.qiniu.QiniuTemporaryClientTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * Qiniu cloud temporary object storage automatic configuration
 * (temporary use, widget-cli update cancels the use of multi-file Key upload and then off the shelf)
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(OssProperties.class)
@ConditionalOnClass(QiniuTemporaryClientTemplate.class)
@ConditionalOnProperty(prefix = "vikadata-starter.oss.qiniu", name = "access-key")
public class QiniuTemporaryAutoConfiguration extends OssConnectionConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(QiniuTemporaryAutoConfiguration.class);

    QiniuTemporaryAutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean
    public QiniuTemporaryClientTemplate qiniuTemporaryClientTemplate() {
        LOGGER.info("Qiniu cloud temporary object storage automatic configuration.");
        Qiniu qiniu = getProperties().getQiniu();
        Auth auth = Auth.create(qiniu.getAccessKey(), qiniu.getSecretKey());
        Callback callback = Optional.ofNullable(qiniu.getCallback()).orElseGet(Callback::new);
        QiniuOssClientRequestFactory factory = new QiniuOssClientRequestFactory(auth, qiniu.getRegion(), qiniu.getDownloadDomain(), callback.getUrl(), callback.getBodyType(), qiniu.getUploadUrl());
        return new QiniuTemporaryClientTemplate(factory);
    }
}
