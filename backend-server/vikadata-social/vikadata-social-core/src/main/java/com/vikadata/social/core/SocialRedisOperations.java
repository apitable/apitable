package com.vikadata.social.core;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

/**
 * Social Redis 操作接口
 *
 * @author Shawn Deng
 * @date 2020-11-21 13:57:36
 */
public interface SocialRedisOperations {

    /**
     * 获取指定键的值
     *
     * @param key Redis Key
     * @return 值
     */
    String getValue(String key);

    /**
     * 设置键值
     *
     * @param key      Redis Key
     * @param value    Redis value
     * @param expire   expire number
     * @param timeUnit expire time unit
     */
    void setValue(String key, String value, int expire, TimeUnit timeUnit);

    /**
     * 获取键的剩余过期时间
     *
     * @param key Redis Key
     * @return expire time
     */
    Long getExpire(String key);

    /**
     * 设置键的过期时间
     *
     * @param key      Redis Key
     * @param expire   expire number
     * @param timeUnit expire time unit
     */
    void expire(String key, int expire, TimeUnit timeUnit);

    /**
     * 锁定键
     *
     * @param key Redis Key
     * @return concurrent Lock
     */
    Lock getLock(String key);
}
