package com.vikadata.social.service.dingtalk.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.integration.redis.util.RedisLockRegistry;

/**
 * redis Key-value serialization configuration
 */
@Configuration(proxyBeanMethods = false)
@Slf4j
public class RedisConfig {

    private static Jackson2JsonRedisSerializer<Object> json() {
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        // The default is: OBJECT_AND_NON_CONCRETE -- When there are Interface and AbstractClass in the class, serialize and deserialize them
        //NON_FINAL: includes all the features mentioned above, and includes all non-final attributes in the class to be serialized,
        // that is, the attribute information equivalent to the entire class, except final, needs to be serialized and deserialized change
        om.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.WRAPPER_ARRAY);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        return jackson2JsonRedisSerializer;
    }

    /**
     * Set redis key value serialization, value visualization
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        log.info("Redis default configuration");
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // Set the redis connection factory just now into the template class
        template.setConnectionFactory(factory);
        // Set key serialization
        template.setKeySerializer(RedisSerializer.string());
        // Set value serialization
        template.setValueSerializer(json());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisLockRegistry redisLockRegistry(RedisConnectionFactory redisConnectionFactory) {
        // Note that the time unit here is milliseconds
        return new RedisLockRegistry(redisConnectionFactory, "vikadata:concurrent");
    }
}
