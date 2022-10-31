package com.vikadata.social.dingtalk.config;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.SocialRedisOperations;

/**
 * dingTalk jsapi ticket Implement storage interface
 */
public class JsApiTicketInRedisStorage implements AppTicketStorage {

    private static final String TOKEN_KEY_TPL = "%s:dingtalk:jsapi:ticket:%s";

    private static final String LOCK_KEY_TPL = "%s:dingtalk:jsapi:lock:%s:";

    private final SocialRedisOperations redisOps;

    private final String redisKeyPrefix;

    protected volatile Lock ticketLock;

    private volatile String appId;

    private volatile String appSecret;

    private volatile String ticketKey;

    public JsApiTicketInRedisStorage(SocialRedisOperations redisOps, String redisKeyPrefix) {
        this.redisOps = redisOps;
        this.redisKeyPrefix = redisKeyPrefix;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
        this.ticketKey = String.format(TOKEN_KEY_TPL, this.redisKeyPrefix, appId);
        String lockKey = String.format(LOCK_KEY_TPL, this.redisKeyPrefix, appId);
        this.ticketLock = this.redisOps.getLock(lockKey.concat("jsApiTicketLock"));
    }

    public String getAppSecret() {
        return appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
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
