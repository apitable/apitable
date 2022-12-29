package com.vikadata.social.feishu.config;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

/**
 * Social redis operations interface
 */
public interface FeishuRedisOperations {

    /**
     * get the value of the specified key
     * @param key Redis Key
     * @return String
     */
    String getValue(String key);

    /**
     * set value for specified key
     * @param key      Redis Key
     * @param value    Redis value
     * @param expire   expire number
     * @param timeUnit expire time unit
     */
    void setValue(String key, String value, int expire, TimeUnit timeUnit);

    /**
     * get the expiration time for a key
     * @param key Redis Key
     * @return expire time
     */
    Long getExpire(String key);

    /**
     * Set the expiration time of the key
     * @param key      Redis Key
     * @param expire   expire number
     * @param timeUnit expire time unit
     */
    void expire(String key, int expire, TimeUnit timeUnit);

    /**
     * lock key
     * @param key Redis Key
     * @return concurrent Lock
     */
    Lock getLock(String key);
}
