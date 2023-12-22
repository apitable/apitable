package com.apitable.auth;

import java.time.Duration;
import java.util.Map;
import java.util.function.BiFunction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.session.MapSession;
import org.springframework.session.config.SessionRepositoryCustomizer;
import org.springframework.session.data.redis.RedisIndexedSessionRepository;
import org.springframework.session.data.redis.RedisSessionMapper;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisIndexedHttpSession;

/**
 * session config.
 */
@Configuration
@EnableRedisIndexedHttpSession
public class SessionConfig {

    @Value("${spring.session.redis.namespace:}")
    private String sessionNamespace;

    @Value("${spring.session.timeout:}")
    private Duration sessionTimeOut;

    @Bean
    SessionRepositoryCustomizer<RedisIndexedSessionRepository> redisSessionRepositoryCustomizer() {
        return (redisSessionRepository) -> {
            redisSessionRepository.setDefaultMaxInactiveInterval(sessionTimeOut);
            redisSessionRepository.setRedisKeyNamespace(sessionNamespace);
            redisSessionRepository.setRedisSessionMapper(
                    new SafeRedisSessionMapper(redisSessionRepository.getSessionRedisOperations()));
        };
    }

    class SafeRedisSessionMapper implements BiFunction<String, Map<String, Object>, MapSession> {

        private final RedisSessionMapper delegate = new RedisSessionMapper();

        private final RedisOperations<String, Object> redisOperations;

        SafeRedisSessionMapper(RedisOperations<String, Object> redisOperations) {
            this.redisOperations = redisOperations;
        }

        @Override
        public MapSession apply(String sessionId, Map<String, Object> map) {
            try {
                return this.delegate.apply(sessionId, map);
            } catch (IllegalStateException ex) {
                // if you use a different redis namespace, change the key accordingly
                this.redisOperations.delete(sessionNamespace + ":sessions:" + sessionId); // we do not invoke RedisIndexedSessionRepository#deleteById to avoid an infinite loop because the method also invokes this mapper
                return null;
            }
        }

    }

}