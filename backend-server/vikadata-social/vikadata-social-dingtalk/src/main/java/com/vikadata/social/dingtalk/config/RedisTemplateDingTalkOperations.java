package com.vikadata.social.dingtalk.config;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import com.vikadata.social.core.RedisTemplateSimpleDistributedLock;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * RedisTemplate implementation based on SpringFramework
 */
public class RedisTemplateDingTalkOperations implements DingTalkRedisOperations {

    private final StringRedisTemplate stringRedisTemplate;

    private final RedisTemplate<String, Object> template;

    public RedisTemplateDingTalkOperations(StringRedisTemplate stringRedisTemplate, RedisTemplate<String, Object> redisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.template = redisTemplate;
    }

    @Override
    public String getValue(String key) {
        return stringRedisTemplate.opsForValue().get(key);
    }

    @Override
    public void setValue(String key, String value, int expire, TimeUnit timeUnit) {
        if (expire <= 0) {
            stringRedisTemplate.opsForValue().set(key, value);
        }
        else {
            stringRedisTemplate.opsForValue().set(key, value, expire, timeUnit);
        }
    }

    @Override
    public Long getExpire(String key) {
        return stringRedisTemplate.getExpire(key);
    }

    @Override
    public void expire(String key, int expire, TimeUnit timeUnit) {
        stringRedisTemplate.expire(key, expire, timeUnit);
    }

    @Override
    public Lock getLock(String key) {
        return new RedisTemplateSimpleDistributedLock(stringRedisTemplate, key, 60 * 1000);
    }

    @Override
    public void setHashMapAllValue(String key, Map<String, Object> values) {
        this.template.opsForHash().putAll(key, values);
    }

    @Override
    public void setHashMapValue(String key, String field, Object value) {
        this.template.opsForHash().putIfAbsent(key, field, value);
    }

    @Override
    public Object getHashMapValue(String key, String field) {
        return this.template.opsForHash().get(key, field);
    }

    @Override
    public List<Object> getHashMapValues(String key) {
        return this.template.opsForHash().values(key);
    }

    @Override
    public void addSetValue(String key, String value) {
        this.template.opsForSet().add(key, value);
    }

    @Override
    public List<String> getSetValues(String key) {
        Set<Object> values = this.template.opsForSet().members(key);
        if (values != null) {
            return values.stream().map(Object::toString).collect(Collectors.toList());
        }
        return null;
    }

    @Override
    public Boolean hasMapKey(String key, String field) {
        return this.template.opsForHash().hasKey(key, field);
    }

    @Override
    public Boolean hasKey(String key) {
        return this.template.hasKey(key);
    }
}
