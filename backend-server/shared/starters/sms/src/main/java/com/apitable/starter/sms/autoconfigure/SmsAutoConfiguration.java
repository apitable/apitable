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

package com.apitable.starter.sms.autoconfigure;

import com.apitable.starter.sms.core.LocalSmsSenderFactory;
import com.apitable.starter.sms.core.OutlandSmsSenderFactory;
import com.apitable.starter.sms.core.SmsSenderTemplate;
import java.util.Optional;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * autoconfiguration of SMS.
 * </p>
 *
 * @author Shawn Deng
 */
@AutoConfiguration
@ConditionalOnClass(SmsSenderTemplate.class)
@EnableConfigurationProperties(SmsProperties.class)
@ConditionalOnProperty(value = "starter.sms.enabled", havingValue = "true")
@Import({TencentSmsAutoConfiguration.class, YunpianSmsAutoConfiguration.class})
public class SmsAutoConfiguration {

    private final SmsProperties properties;

    public SmsAutoConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    /**
     * register SmsSenderTemplate bean.
     *
     * @param localSmsSenderFactory   localSmsSenderFactory
     * @param outlandSmsSenderFactory outlandSmsSenderFactory
     * @return SmsSenderTemplate
     */
    @Bean
    @ConditionalOnMissingBean
    public SmsSenderTemplate smsSenderTemplate(
        Optional<LocalSmsSenderFactory> localSmsSenderFactory,
        Optional<OutlandSmsSenderFactory> outlandSmsSenderFactory) {
        SmsSenderTemplate template = new SmsSenderTemplate();
        template.setLocalAreaCode(properties.getLocalAreaCode());
        template.setLocalSmsSenderFactory(localSmsSenderFactory.orElse(null));
        template.setOutlandSmsSenderFactory(outlandSmsSenderFactory.orElse(null));
        return template;
    }
}
