/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.oss.autoconfigure;

import java.util.Optional;

import com.qiniu.util.Auth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.apitable.starter.oss.autoconfigure.OssProperties.Callback;
import com.apitable.starter.oss.autoconfigure.OssProperties.Qiniu;
import com.apitable.starter.oss.core.qiniu.QiniuOssClientRequestFactory;
import com.apitable.starter.oss.core.qiniu.QiniuTemporaryClientTemplate;

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
@ConditionalOnProperty(prefix = "starter.oss.qiniu", name = "access-key")
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
