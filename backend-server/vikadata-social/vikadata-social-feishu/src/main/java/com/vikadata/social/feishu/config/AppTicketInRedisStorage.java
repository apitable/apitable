package com.vikadata.social.feishu.config;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.SocialRedisOperations;

/**
 * 飞书 APP ticket 实现存储接口
 *
 * @author Shawn Deng
 * @date 2020-11-19 19:27:12
 */
public class AppTicketInRedisStorage implements AppTicketStorage {

    private static final String TOKEN_KEY_TPL = "%s:feishu:ticket:%s";

    private static final String LOCK_KEY_TPL = "%s:feishu:lock:%s:";

    private volatile String appId;

    private volatile String appSecret;

    private volatile String ticketKey;

    protected volatile Lock ticketLock = new ReentrantLock();

    private final SocialRedisOperations redisOps;

    private final String redisKeyPrefix;

    public AppTicketInRedisStorage(SocialRedisOperations redisOps) {
        this(redisOps, "vikadata");
    }

    public AppTicketInRedisStorage(SocialRedisOperations redisOps, String redisKeyPrefix) {
        this.redisOps = redisOps;
        this.redisKeyPrefix = redisKeyPrefix;
    }

    public void setAppId(String appId) {
        this.appId = appId;
        this.ticketKey = String.format(TOKEN_KEY_TPL, this.redisKeyPrefix, appId);
        String lockKey = String.format(LOCK_KEY_TPL, this.redisKeyPrefix, appId);
        this.ticketLock = this.redisOps.getLock(lockKey.concat("appTicketLock"));
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
