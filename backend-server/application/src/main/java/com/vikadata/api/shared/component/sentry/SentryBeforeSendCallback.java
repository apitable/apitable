package com.vikadata.api.shared.component.sentry;

import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.map.MapUtil;
import io.sentry.SentryEvent;
import io.sentry.SentryOptions;
import io.sentry.protocol.User;
import io.sentry.spring.SentryUserProvider;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import com.vikadata.api.shared.cache.bean.LoginUserDto;
import com.vikadata.api.shared.cache.bean.UserSpaceDto;
import com.vikadata.api.shared.context.LoginContext;

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
