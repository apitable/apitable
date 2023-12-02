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

import com.apitable.starter.sms.autoconfigure.SmsProperties.SmsServer.Tencent;
import com.apitable.starter.sms.core.LocalSmsSenderFactory;
import com.apitable.starter.sms.core.OutlandSmsSenderFactory;
import com.apitable.starter.sms.core.TencentLocalSmsSenderFactory;
import com.apitable.starter.sms.core.TencentOutlandSmsSenderFactory;
import com.github.qcloudsms.SmsMultiSender;
import com.github.qcloudsms.SmsSingleSender;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * autoconfiguration of Tencent cloud SMS.
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({SmsSingleSender.class, SmsMultiSender.class})
public class TencentSmsAutoConfiguration {

    private final SmsProperties properties;

    public TencentSmsAutoConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(LocalSmsSenderFactory.class)
    @ConditionalOnProperty(name = "starter.sms.local.type", havingValue = "tencent")
    LocalSmsSenderFactory localSmsSenderFactory() {
        Tencent tencent = properties.getLocal().getTencent();
        return new TencentLocalSmsSenderFactory(tencent.getAppId(), tencent.getAppKey(),
            tencent.getSign());
    }

    @Bean
    @ConditionalOnMissingBean(OutlandSmsSenderFactory.class)
    @ConditionalOnProperty(name = "starter.sms.outland.type", havingValue = "tencent")
    OutlandSmsSenderFactory smsSenderFactory() {
        Tencent tencent = properties.getOutland().getTencent();
        return new TencentOutlandSmsSenderFactory(tencent.getAppId(), tencent.getAppKey(),
            tencent.getSign());
    }
}
