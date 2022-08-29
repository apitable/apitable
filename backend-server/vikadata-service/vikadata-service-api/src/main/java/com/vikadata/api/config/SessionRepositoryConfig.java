package com.vikadata.api.config;

import javax.annotation.Resource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;

/**
 * Session Repository 配置
 * @author Shawn Deng
 * @date 2021-06-29 12:08:16
 */
@Configuration(proxyBeanMethods = false)
public class SessionRepositoryConfig<S extends Session> {

    @Resource
    private FindByIndexNameSessionRepository<S> sessionRepository;

    /**
     * 支持Spring Session通过用户名查找会话
     */
    @Bean
    public SpringSessionBackedSessionRegistry<S> sessionRegistry() {
        return new SpringSessionBackedSessionRegistry<>(this.sessionRepository);
    }
}
