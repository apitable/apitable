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

package com.apitable.shared.component.sentry;

import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.map.MapUtil;
import io.sentry.SentryEvent;
import io.sentry.SentryOptions;
import io.sentry.protocol.User;
import io.sentry.spring.SentryUserProvider;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.context.LoginContext;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SentryBeforeSendCallback implements SentryOptions.BeforeSendCallback {

    @Override
    public SentryEvent execute(SentryEvent event, Object hint) {
        event.setTag("zipkin.span.id", MDC.get("spanId"));
        event.setTag("zipkin.trace.id", MDC.get("traceId"));
        return event;
    }

    @Bean
    public SentryUserProvider sentryUserProvider() {
        return () -> {
            User user = new User();
            try {
                LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
                UserSpaceDto userSpaceDto = LoginContext.me().getUserSpaceDto(LoginContext.me().getSpaceId());
                if (null != loginUserDto && null != userSpaceDto) {
                    user.setUsername(loginUserDto.getNickName());
                    Map<String, String> userOthers = new HashMap<>(3);
                    userOthers.put("memberName", userSpaceDto.getMemberName());
                    userOthers.put("spaceName", userSpaceDto.getSpaceName());
                    userOthers.put("uuid", loginUserDto.getUuid());

                    MapUtil.removeNullValue(userOthers);
                    user.setOthers(userOthers);
                }
            }
            catch (Exception ignored) {
                // don't bother if not log in
            }
            return user;
        };
    }

}
