package com.vikadata.social.core;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * Social RedisTemplate implementation based on SpringFramework
 */
public class RedisTemplateSocialRedisOperations implements SocialRedisOperations {

    private final StringRedisTemplate redisTemplate;

    public RedisTemplateSocialRedisOperations(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public String getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void setValue(String key, String value, int expire, TimeUnit timeUnit) {
        if (expire <= 0) {
            redisTemplate.opsForValue().set(key, value);
        }
        else {
            redisTemplate.opsForValue().set(key, value, expire, timeUnit);
        }
    }

    @Override
    public Long getExpire(String key) {
        return redisTemplate.getExpire(key);
    }

    @Override
    public void expire(String key, int expire, TimeUnit timeUnit) {
        redisTemplate.expire(key, expire, timeUnit);
    }

    @Override
    public Lock getLock(String key) {
        return new RedisTemplateSimpleDistributedLock(redisTemplate, key, 60 * 1000);
    }
}
