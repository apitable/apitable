package com.vikadata.api.config;

import java.time.Duration;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair;
import org.springframework.data.redis.serializer.RedisSerializer;

/**
 * Spring Caching 模块
 * @author Shawn Deng
 * @date 2021-06-28 20:42:56
 */
@Configuration(proxyBeanMethods = false)
@EnableCaching
public class CacheConfig extends CachingConfigurerSupport {

    /**
     * Key 生成器
     * 生成策略： 目标类+目标方法+参数1...
     */
    @Bean
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            StringBuilder sb = new StringBuilder();
            sb.append(target.getClass().getName());
            sb.append(method.getName());
            for (Object obj : params) {
                sb.append(obj.toString());
            }
            return sb.toString();
        };
    }

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(60))
            .disableCachingNullValues()
            .computePrefixWith(cacheName -> "vikadata".concat(":").concat(cacheName).concat(":"))
            .serializeKeysWith(SerializationPair.fromSerializer(RedisSerializer.string()))
            .serializeValuesWith(SerializationPair.fromSerializer(RedisSerializer.json()));
    }
}
