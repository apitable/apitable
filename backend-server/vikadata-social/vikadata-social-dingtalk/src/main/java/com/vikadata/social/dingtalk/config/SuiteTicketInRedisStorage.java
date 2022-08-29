package com.vikadata.social.dingtalk.config;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import cn.hutool.core.util.StrUtil;

import com.vikadata.social.core.AppTicketStorage;

/**
 * <p> 
 * 钉钉 APP ticket 实现存储接口，每五个小时推送一次
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/6 9:52 下午
 */
public class SuiteTicketInRedisStorage implements AppTicketStorage {

    private static final String LOCK_KEY_TPL = "%s:dingtalk:suite_ticket:lock:%s";

    private volatile String suiteId;

    private volatile String corpId;

    private volatile String ticketKey;

    protected volatile Lock ticketLock = new ReentrantLock();

    private final DingTalkRedisOperations redisOps;

    private final String redisKeyPrefix;

    public SuiteTicketInRedisStorage(DingTalkRedisOperations redisOps, String redisKeyPrefix) {
        this.redisOps = redisOps;
        this.redisKeyPrefix = redisKeyPrefix;
    }

    public void setTicketKey(String suiteId, String corpId) {
        this.suiteId = suiteId;
        this.corpId = corpId;
        String lockKey = String.format(LOCK_KEY_TPL, redisKeyPrefix, suiteId);
        ticketKey = lockKey;
        ticketLock = redisOps.getLock(lockKey.concat("appSuiteTicketLock"));
    }

    public String getSuiteId() {
        return suiteId;
    }

    public String getCorpId() {
        return corpId;
    }

    @Override
    public String getTicket() {
        String ticket = redisOps.getValue(ticketKey);
        if (StrUtil.isBlank(ticket)) {
            throw new IllegalStateException(suiteId + ":suiteTicket没有下发请稍后再试");
        }
        return ticket;
    }

    @Override
    public synchronized void updateTicket(String appTicket, int expiresInSeconds) {
        redisOps.setValue(ticketKey, appTicket, expiresInSeconds, TimeUnit.SECONDS);
    }
}
