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

package com.apitable.starter.mail.autoconfigure;

import com.apitable.starter.mail.autoconfigure.CloudMailProperties.Tencent;
import com.apitable.starter.mail.core.MailSenderFactory;
import com.apitable.starter.mail.core.TencentMailSenderFactory;
import com.tencentcloudapi.ses.v20201002.SesClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * Tencent cloud mail configuration.
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(SesClient.class)
@ConditionalOnProperty(value = "starter.mail.type", havingValue = "tencent")
public class TencentMailAutoConfiguration {

    private final CloudMailProperties properties;

    public TencentMailAutoConfiguration(CloudMailProperties properties) {
        this.properties = properties;
    }

    /**
     * register mail sender factory.
     *
     * @return mail sender factory
     */
    @Bean
    @ConditionalOnMissingBean
    public MailSenderFactory mailSenderFactory() {
        Tencent tencent = properties.getTencent();
        return new TencentMailSenderFactory(properties.getRegion(), tencent.getSecretId(),
            tencent.getSecretKey(), properties.getFrom(), properties.getReply());
    }

}
