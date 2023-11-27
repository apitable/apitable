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

import com.apitable.starter.oss.autoconfigure.OssProperties.Signature;
import com.apitable.starter.oss.core.OssSignatureTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Object Storage Auto Configuration.
 *
 * @author Benson Cheung
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(OssProperties.class)
@ConditionalOnProperty(value = {"starter.oss.enabled", "starter.oss.signature.enabled"},
    havingValue = "true")
public class OssSignatureAutoConfiguration {

    private final OssProperties properties;

    public OssSignatureAutoConfiguration(OssProperties properties) {
        this.properties = properties;
    }

    /**
     * register oss signature template.
     *
     * @return oss signature template
     */
    @Bean
    @ConditionalOnMissingBean
    public OssSignatureTemplate ossSignatureTemplate() {
        Signature signature = properties.getSignature();
        return new OssSignatureTemplate(signature.getEncryptKey(),
            signature.getExpireSecond());
    }
}
