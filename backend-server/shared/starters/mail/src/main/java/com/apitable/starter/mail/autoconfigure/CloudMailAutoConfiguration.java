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

import com.apitable.starter.mail.core.CloudMailSender;
import com.apitable.starter.mail.core.MailSenderFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * Cloud platform email push automation configuration.
 * </p>
 *
 * @author Chambers
 */
@AutoConfiguration
@ConditionalOnClass(CloudMailSender.class)
@ConditionalOnBean(MailSenderFactory.class)
@EnableConfigurationProperties(CloudMailProperties.class)
@ConditionalOnProperty(value = "starter.mail.enabled", havingValue = "true")
@Import({TencentMailAutoConfiguration.class})
public class CloudMailAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public CloudMailSender cloudMailSender(final MailSenderFactory mailSenderFactory) {
        return mailSenderFactory.createSender();
    }

}
