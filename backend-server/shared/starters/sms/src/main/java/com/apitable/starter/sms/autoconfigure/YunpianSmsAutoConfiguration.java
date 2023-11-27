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

import com.apitable.starter.sms.autoconfigure.SmsProperties.SmsServer.Yunpian;
import com.apitable.starter.sms.core.LocalSmsSenderFactory;
import com.apitable.starter.sms.core.OutlandSmsSenderFactory;
import com.apitable.starter.sms.core.YunpianLocalSmsSenderFactory;
import com.apitable.starter.sms.core.YunpianOutlandSmsSenderFactory;
import com.yunpian.sdk.YunpianClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * autoconfiguration of yunpian sms.
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(YunpianClient.class)
public class YunpianSmsAutoConfiguration {

    private final SmsProperties properties;

    public YunpianSmsAutoConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(LocalSmsSenderFactory.class)
    @ConditionalOnProperty(name = "starter.sms.local.type", havingValue = "yunpian")
    LocalSmsSenderFactory localSmsSenderFactory() {
        Yunpian yunpian = properties.getLocal().getYunpian();
        return new YunpianLocalSmsSenderFactory(yunpian.getApikey());
    }

    @Bean
    @ConditionalOnMissingBean(OutlandSmsSenderFactory.class)
    @ConditionalOnProperty(name = "starter.sms.outland.type", havingValue = "yunpian")
    OutlandSmsSenderFactory smsSenderFactory() {
        Yunpian yunpian = properties.getOutland().getYunpian();
        return new YunpianOutlandSmsSenderFactory(yunpian.getApikey());
    }
}
