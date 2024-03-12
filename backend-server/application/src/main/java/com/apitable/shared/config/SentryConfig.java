package com.apitable.shared.config;

import cn.hutool.core.map.MapUtil;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.context.LoginContext;
import io.sentry.protocol.User;
import io.sentry.spring.jakarta.SentryUserProvider;
import java.util.HashMap;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * sentry config.
 */
@Configuration(proxyBeanMethods = false)
public class SentryConfig {

    /**
     * register sentry user provider.
     *
     * @return sentry user provider
     */
    @Bean
    public SentryUserProvider sentryUserProvider() {
        return () -> {
            User user = new User();
            try {
                LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
                UserSpaceDto userSpaceDto =
                    LoginContext.me().getUserSpaceDto(LoginContext.me().getSpaceId());
                if (null != loginUserDto && null != userSpaceDto) {
                    user.setUsername(loginUserDto.getNickName());
                    Map<String, String> userOthers = new HashMap<>(3);
                    userOthers.put("memberName", userSpaceDto.getMemberName());
                    userOthers.put("spaceName", userSpaceDto.getSpaceName());
                    userOthers.put("uuid", loginUserDto.getUuid());
                    MapUtil.removeNullValue(userOthers);
                    user.setData(userOthers);
                }
            } catch (Exception ignored) {
                // don't bother if not log in
            }
            return user;
        };
    }
}
