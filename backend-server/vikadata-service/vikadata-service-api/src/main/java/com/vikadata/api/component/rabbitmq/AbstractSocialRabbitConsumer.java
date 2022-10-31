package com.vikadata.api.component.rabbitmq;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.define.constants.RedisConstants;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;

/**
 * <p>
 * social consumer abstract class
 * </p>
 */
@Slf4j
public class AbstractSocialRabbitConsumer {

    /**
     * 5 seconds wait for lock
     */
    protected static final long WAIT_LOCK_MILLIS = 5000L;

    protected static final Integer MAX_EVENT_HANDLE_SECONDS = 3600;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    protected Lock getTenantEventLock(String tenantId, String appId) {
        return redisLockRegistry.obtain(RedisConstants.getSocialIsvEventLockKey(tenantId, appId));
    }

    /**
     * flag working on an enterprise event
     * @param tenantId corp id
     * @param appId app id
     */
    protected Boolean setTenantEventOnProcessing(String tenantId, String appId, String eventId) {
        return redisTemplate.opsForValue().setIfAbsent(RedisConstants.getSocialIsvEventProcessingKey(tenantId, appId),
                eventId, MAX_EVENT_HANDLE_SECONDS, TimeUnit.SECONDS);
    }

    /**
     * flag working on an enterprise event
     * @param tenantId corp id
     * @param appId app id
     */
    protected Boolean tenantEventOnProcessing(String tenantId, String appId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(RedisConstants.getSocialIsvEventProcessingKey(tenantId, appId)));
    }

    protected void setTenantEventOnProcessed(String tenantId, String appId) {
        String key = RedisConstants.getSocialIsvEventProcessingKey(tenantId, appId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.delete(key);
        }
    }

    protected String getTenantEventOnProcessingId(String tenantId, String appId) {
        String key = RedisConstants.getSocialIsvEventProcessingKey(tenantId, appId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            return redisTemplate.opsForValue().get(key);
        }
        return null;
    }
}
