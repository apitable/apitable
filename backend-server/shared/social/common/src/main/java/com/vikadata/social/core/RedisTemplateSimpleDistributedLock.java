package com.vikadata.social.core;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;

import org.springframework.data.redis.connection.RedisStringCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.data.redis.core.types.Expiration;

/**
 * Implement simple redis distributed lock, support reentrancy, not Redlock
 */
public class RedisTemplateSimpleDistributedLock implements Lock {

    private final StringRedisTemplate redisTemplate;

    private final String key;

    private final int leaseMilliseconds;

    private final ThreadLocal<String> valueThreadLocal = new ThreadLocal<>();

    public RedisTemplateSimpleDistributedLock(StringRedisTemplate redisTemplate, String key, int leaseMilliseconds) {
        if (leaseMilliseconds <= 0) {
            throw new IllegalArgumentException("Parameter 'leaseMilliseconds' must grate then 0: " + leaseMilliseconds);
        }
        this.redisTemplate = redisTemplate;
        this.key = key;
        this.leaseMilliseconds = leaseMilliseconds;
    }

    @Override
    public void lock() {
        while (!tryLock()) {
            try {
                Thread.sleep(1000);
            }
            catch (InterruptedException e) {
                // Ignore
            }
        }
    }

    @Override
    public void lockInterruptibly() throws InterruptedException {
        while (!tryLock()) {
            try {
                Thread.sleep(1000);
            }
            catch (InterruptedException e) {
                // Ignore
            }
        }
    }

    @Override
    public boolean tryLock() {
        String value = valueThreadLocal.get();
        if (value == null || value.length() == 0) {
            value = UUID.randomUUID().toString();
            valueThreadLocal.set(value);
        }
        final byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        final byte[] valueBytes = value.getBytes(StandardCharsets.UTF_8);
        List<Object> redisResults = redisTemplate.executePipelined((RedisCallback<String>) connection -> {
            connection.set(keyBytes, valueBytes, Expiration.milliseconds(leaseMilliseconds), RedisStringCommands.SetOption.SET_IF_ABSENT);
            connection.get(keyBytes);
            return null;
        });
        Object currentLockSecret = redisResults.size() > 1 ? redisResults.get(1) : redisResults.get(0);
        return currentLockSecret != null && currentLockSecret.toString().equals(value);
    }

    @Override
    public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
        long waitMs = unit.toMillis(time);
        boolean locked = tryLock();
        while (!locked && waitMs > 0) {
            long sleep = waitMs < 1000 ? waitMs : 1000;
            Thread.sleep(sleep);
            waitMs -= sleep;
            locked = tryLock();
        }
        return locked;
    }

    @Override
    public void unlock() {
        if (valueThreadLocal.get() != null) {
            // Tip: returnType must be specified, type: here must be Long, not Integer
            RedisScript<Long> script = new DefaultRedisScript<>("if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end", Long.class);
            redisTemplate.execute(script, Collections.singletonList(key), valueThreadLocal.get());
            valueThreadLocal.remove();
        }
    }

    @Override
    public Condition newCondition() {
        throw new UnsupportedOperationException();
    }

    /**
     * Get the value of the current lock
     * @return Returning null means that there is no lock, but returning a non-null value does not
     * mean that the current lock is successful (the key in redis may automatically expire)
     */
    public String getLockSecretValue() {
        return valueThreadLocal.get();
    }

    public StringRedisTemplate getRedisTemplate() {
        return redisTemplate;
    }

    public String getKey() {
        return key;
    }

    public int getLeaseMilliseconds() {
        return leaseMilliseconds;
    }
}
