package com.vikadata.social.wecom.config;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import cn.hutool.core.util.StrUtil;
import me.chanjar.weixin.common.bean.WxAccessToken;
import me.chanjar.weixin.common.redis.WxRedisOps;
import me.chanjar.weixin.cp.config.impl.WxCpDefaultConfigImpl;

/**
 * <p>
 * 企业微信配置文件Redis存储策略实现 <br/>
 * 继承于WxJava 企业微信实现
 * </p>
 *
 * @author Pengap
 * @date 2021/7/28 16:45:41
 */
public class WeComRedisConfigImpl extends WxCpDefaultConfigImpl {

    protected final static String LOCK_KEY = "work_weixin:lock:";

    protected final static String WORK_WEIXIN_ACCESS_TOKEN_KEY = "work_weixin:access_token_key:";

    protected final static String WORK_WEIXIN_JSAPI_TICKET_KEY = "work_weixin:jsapi_ticket_key:";

    protected final static String WORK_WEIXIN_AGENT_JSAPI_TICKET_KEY = "work_weixin:agent_jsapi_ticket_key:";

    /**
     * redis 存储的 key 的前缀，可为空
     */
    protected String keyPrefix;

    protected String accessTokenKey;

    protected String jsapiTicketKey;

    protected String agentJsapiTicketKey;

    protected String lockKey;

    private final WxRedisOps redisOps;

    public WeComRedisConfigImpl(WxRedisOps redisOps, String keyPrefix) {
        this.redisOps = redisOps;
        this.keyPrefix = keyPrefix;
    }

    /**
     * 获取锁
     */
    protected Lock getLockByKey(String key) {
        return redisOps.getLock(key);
    }

    /**
     * 设置企业微信自研应用ID（整数）,同时初始化相关的redis key，注意要先调用setCorpId，再调用setAgentId
     */
    @Override
    public void setAgentId(Integer agentId) {
        super.setAgentId(agentId);
        String ukey = getCorpId().concat(":").concat(String.valueOf(agentId));
        String prefix = StrUtil.isBlank(keyPrefix) ? "" : StrUtil.appendIfMissing(keyPrefix, ":");
        lockKey = prefix + LOCK_KEY.concat(ukey);
        accessTokenKey = prefix + WORK_WEIXIN_ACCESS_TOKEN_KEY.concat(ukey);
        jsapiTicketKey = prefix + WORK_WEIXIN_JSAPI_TICKET_KEY.concat(ukey);
        agentJsapiTicketKey = prefix + WORK_WEIXIN_AGENT_JSAPI_TICKET_KEY.concat(ukey);
    }

    @Override
    public Lock getAccessTokenLock() {
        return this.getLockByKey(this.lockKey.concat(":").concat("accessToken"));
    }

    @Override
    public Lock getAgentJsapiTicketLock() {
        return this.getLockByKey(this.lockKey.concat(":").concat("agentJsapiTicket"));
    }

    @Override
    public Lock getJsapiTicketLock() {
        return this.getLockByKey(this.lockKey.concat(":").concat("jsapiTicket"));
    }

    @Override
    public String getAccessToken() {
        return redisOps.getValue(this.accessTokenKey);
    }

    @Override
    public boolean isAccessTokenExpired() {
        Long expire = redisOps.getExpire(this.accessTokenKey);
        return expire == null || expire < 2;
    }

    @Override
    public void updateAccessToken(WxAccessToken accessToken) {
        redisOps.setValue(this.accessTokenKey, accessToken.getAccessToken(), accessToken.getExpiresIn(), TimeUnit.SECONDS);
    }

    @Override
    public void updateAccessToken(String accessToken, int expiresInSeconds) {
        redisOps.setValue(this.accessTokenKey, accessToken, expiresInSeconds, TimeUnit.SECONDS);
    }

    @Override
    public void expireAccessToken() {
        redisOps.expire(this.accessTokenKey, 0, TimeUnit.SECONDS);
    }

    @Override
    public String getJsapiTicket() {
        return redisOps.getValue(this.jsapiTicketKey);
    }

    @Override
    public boolean isJsapiTicketExpired() {
        Long expire = redisOps.getExpire(this.jsapiTicketKey);
        return expire == null || expire < 2;
    }

    @Override
    public void expireJsapiTicket() {
        redisOps.expire(this.jsapiTicketKey, 0, TimeUnit.SECONDS);
    }

    @Override
    public void updateJsapiTicket(String jsapiTicket, int expiresInSeconds) {
        redisOps.setValue(this.jsapiTicketKey, jsapiTicket, expiresInSeconds, TimeUnit.SECONDS);
    }

    @Override
    public void expireAgentJsapiTicket() {
        redisOps.expire(this.agentJsapiTicketKey, 0, TimeUnit.SECONDS);
    }

    @Override
    public void updateAgentJsapiTicket(String agentJsapiTicket, int expiresInSeconds) {
        redisOps.setValue(this.agentJsapiTicketKey, agentJsapiTicket, expiresInSeconds, TimeUnit.SECONDS);
    }

    @Override
    public String getAgentJsapiTicket() {
        return redisOps.getValue(this.agentJsapiTicketKey);
    }

    @Override
    public boolean isAgentJsapiTicketExpired() {
        Long expire = redisOps.getExpire(this.agentJsapiTicketKey);
        return expire == null || expire < 2;
    }

}
