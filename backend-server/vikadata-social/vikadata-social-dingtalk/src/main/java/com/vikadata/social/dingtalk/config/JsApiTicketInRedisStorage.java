package com.vikadata.social.dingtalk.config;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.SocialRedisOperations;

/**
 * <p>
 * dingTalk jsapi ticket 实现存储接口
 * </p>
 * @author zoe zheng
 * @date 2021/4/8 12:02 下午
 */
public class JsApiTicketInRedisStorage implements AppTicketStorage {

    private static final String TOKEN_KEY_TPL = "%s:dingtalk:jsapi:ticket:%s";

    private static final String LOCK_KEY_TPL = "%s:dingtalk:jsapi:lock:%s:";

    private volatile String appId;

    private volatile String appSecret;

    private volatile String ticketKey;

    protected volatile Lock ticketLock;

    private final SocialRedisOperations redisOps;

    private final String redisKeyPrefix;

    public JsApiTicketInRedisStorage(SocialRedisOperations redisOps, String redisKeyPrefix) {
        this.redisOps = redisOps;
        this.redisKeyPrefix = redisKeyPrefix;
    }

    public void setAppId(String appId) {
        this.appId = appId;
        this.ticketKey = String.format(TOKEN_KEY_TPL, this.redisKeyPrefix, appId);
        String lockKey = String.format(LOCK_KEY_TPL, this.redisKeyPrefix, appId);
        this.ticketLock = this.redisOps.getLock(lockKey.concat("jsApiTicketLock"));
    }

    public String getAppId() {
        return appId;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public String getAppSecret() {
        return appSecret;
    }

    @Override
    public String getTicket() {
        return redisOps.getValue(this.ticketKey);
    }

    @Override
    public synchronized void updateTicket(String appTicket, int expiresInSeconds) {
        redisOps.setValue(this.ticketKey, appTicket, expiresInSeconds - 200, TimeUnit.SECONDS);
    }

}
