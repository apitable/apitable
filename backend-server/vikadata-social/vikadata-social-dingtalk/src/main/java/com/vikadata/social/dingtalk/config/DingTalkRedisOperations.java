package com.vikadata.social.dingtalk.config;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

/**
 * dingtalk redis operation interface
 */
public interface DingTalkRedisOperations {

    /**
     * get the value of the specified key
     * @param key Redis Key
     * @return value
     */
    String getValue(String key);

    /**
     * set value for the specified key
     *
     * @param key      Redis Key
     * @param value    Redis value
     * @param expire   expire number
     * @param timeUnit expire time unit
     */
    void setValue(String key, String value, int expire, TimeUnit timeUnit);

    /**
     * Get the remaining expiration time for a key
     *
     * @param key Redis Key
     * @return expire time
     */
    Long getExpire(String key);

    /**
     * Set the expiration time of the key
     *
     * @param key      Redis Key
     * @param expire   expire number
     * @param timeUnit expire time unit
     */
    void expire(String key, int expire, TimeUnit timeUnit);

    /**
     * lock key
     *
     * @param key Redis Key
     * @return concurrent Lock
     */
    Lock getLock(String key);

    /**
     * save hash map
     *
     * @param key redis key
     * @param value map key=>value
     */
    void setHashMapAllValue(String key, Map<String, Object> value);

    /**
     * Save a single key=>value
     *
     * @param key redis key
     * @param field map key
     * @param value map value
     */
    void setHashMapValue(String key, String field, Object value);

    /**
     *
     * @param key redis key
     * @param field map key
     * @return map value
     */
    Object getHashMapValue(String key, String field);

    /**
     * get all values
     *
     * @param key redis key
     * @return List<Object>
     */
    List<Object> getHashMapValues(String key);

    /**
     * operation set
     *
     * @param key redis key
     * @param value value
     */
    void addSetValue(String key, String value);

    /**
     * get all values
     *
     * @param key redis key
     */
    List<String> getSetValues(String key);

    /**
     * Determine whether there is a key value in the hash Map
     *
     * @param key redis key
     * @param field field
     * @return boolean
     */
    Boolean hasMapKey(String key, String field);

    /**
     * Check if the key exists
     *
     * @return Boolean
     */
    Boolean hasKey(String key);
}
