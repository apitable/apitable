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

import cn.hutool.core.map.MapUtil;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.context.LoginContext;
import io.sentry.SentryEvent;
import io.sentry.SentryOptions;
import io.sentry.protocol.User;
import io.sentry.spring.SentryUserProvider;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/**
 * sentry before send callback.
 */
@Component
@Slf4j
public class SentryBeforeSendCallback implements SentryOptions.BeforeSendCallback {

    @Override
    public SentryEvent execute(SentryEvent event, Object hint) {
        event.setTag("zipkin.span.id", MDC.get("spanId"));
        event.setTag("zipkin.trace.id", MDC.get("traceId"));
        return event;
    }
}
