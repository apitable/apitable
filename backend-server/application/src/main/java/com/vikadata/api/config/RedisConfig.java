package com.vikadata.api.config;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.constants.RedisConstants;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.lang.Nullable;

/**
 * <p>
 * redis custom config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@Slf4j
public class RedisConfig {

    private static Jackson2JsonRedisSerializer<Object> json() {
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.WRAPPER_ARRAY);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        return jackson2JsonRedisSerializer;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new MagicalKeyStringRedisSerializer(StandardCharsets.UTF_8));
        template.setValueSerializer(json());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisLockRegistry redisLockRegistry(RedisConnectionFactory redisConnectionFactory) {
        return new RedisLockRegistry(redisConnectionFactory, "vikadata:concurrent");
    }

    private static class MagicalKeyStringRedisSerializer extends StringRedisSerializer {

        public MagicalKeyStringRedisSerializer(Charset charset) {
            super(charset);
        }

        @Override
        public String deserialize(@Nullable byte[] bytes) {
            return super.deserialize(bytes);
        }

        @Override
        public byte[] serialize(@Nullable String string) {
            // replace magic value
            string = StrUtil.format(string, this.getAllMagicalValue());
            return super.serialize(string);
        }

        private Dict getAllMagicalValue() {
            String activeProfile = SpringContextHolder.getActiveProfile();
            return Dict.create().set(RedisConstants.REDIS_ENV, activeProfile);
        }

    }
}
