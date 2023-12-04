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

import jakarta.activation.MimeType;
import jakarta.mail.internet.MimeMessage;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * <p>
 * autoconfiguration of mail components.
 * </p>
 *
 * @author Benson Cheung
 */
@AutoConfiguration
@AutoConfigureAfter(MailSenderAutoConfiguration.class)
@ConditionalOnExpression("T(org.springframework.util.StringUtils).hasText('${spring.mail.host}')")
@ConditionalOnClass({MimeMessage.class, MimeType.class, MailSender.class})
@ConditionalOnBean(JavaMailSender.class)
public class MailAutoConfiguration {

    private final MailProperties mailProperties;

    private final JavaMailSender mailSender;

    public MailAutoConfiguration(MailProperties mailProperties, JavaMailSender mailSender) {
        this.mailProperties = mailProperties;
        this.mailSender = mailSender;
    }

    @Bean
    @ConditionalOnMissingBean(MailTemplate.class)
    public MailTemplate mailTemplate() {
        return new MailSendService(mailProperties, mailSender);
    }
}
