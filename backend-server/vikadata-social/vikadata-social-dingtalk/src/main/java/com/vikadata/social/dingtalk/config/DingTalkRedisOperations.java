package com.vikadata.social.dingtalk.config;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

/**
 * 钉钉 Redis 操作接口
 *
 * @author Shawn Deng
 * @date 2020-11-21 13:57:36
 */
public interface DingTalkRedisOperations {

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

    /**
     * 保存hash map
     *
     * @param key redis key
     * @param value map key=>value
     * @author zoe zheng
     * @date 2021/7/26 3:41 下午
     */
    void setHashMapAllValue(String key, Map<String, Object> value);

    /**
     * 保存单个key=>value
     *
     * @param key redis key
     * @param field map key
     * @param value map value
     * @author zoe zheng
     * @date 2021/7/26 3:53 下午
     */
    void setHashMapValue(String key, String field, Object value);

    /**
     *
     * @param key redis key
     * @param field map key
     * @return map value
     * @author zoe zheng
     * @date 2021/7/26 3:54 下午
     */
    Object getHashMapValue(String key, String field);

    /**
     * 获取所有的值
     *
     * @param key redis key
     * @return List<Object>
     * @author zoe zheng
     * @date 2021/7/26 7:51 下午
     */
    List<Object> getHashMapValues(String key);

    /**
     * 操作set
     *
     * @param key redis key
     * @param value value
     * @author zoe zheng
     * @date 2021/7/26 4:35 下午
     */
    void addSetValue(String key, String value);

    /**
     * 获取所有的value
     *
     * @param key redis key
     * @author zoe zheng
     * @date 2021/7/26 4:38 下午
     */
    List<String> getSetValues(String key);

    /**
     * 判断hashMap是否存在某个key值
     *
     * @param key redis key
     * @param field 字段
     * @return boolean
     * @author zoe zheng
     * @date 2021/7/26 8:24 下午
     */
    Boolean hasMapKey(String key, String field);

    /**
     * 判断key是否存在
     *
     * @return Boolean
     * @author zoe zheng
     * @date 2021/7/27 11:32 上午
     */
    Boolean hasKey(String key);
}
