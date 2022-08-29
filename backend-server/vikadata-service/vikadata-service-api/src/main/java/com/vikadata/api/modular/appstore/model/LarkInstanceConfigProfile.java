package com.vikadata.api.modular.appstore.model;

import cn.hutool.json.JSONUtil;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.social.core.SocialRedisOperations;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.config.FeishuConfigStorageHelper;

/**
 * 飞书应用实例设置清单
 * @author Shawn Deng
 * @date 2022-01-14 18:48:34
 */
public class LarkInstanceConfigProfile implements InstanceConfigProfile {

    private String appKey;

    private String appSecret;

    private String eventEncryptKey;

    private String eventVerificationToken;

    private boolean eventCheck;

    private String redirectUrl;

    private String pcUrl;

    private String mobileUrl;

    private String eventUrl;

    private boolean isConfigComplete;

    private boolean contactSyncDone;

    public LarkInstanceConfigProfile(String appKey, String appSecret) {
        this.appKey = appKey;
        this.appSecret = appSecret;
    }

    public static LarkInstanceConfigProfile fromJsonString(String json) {
        return JSONUtil.toBean(json, LarkInstanceConfigProfile.class);
    }

    @Override
    public String toJsonString() {
        return JSONUtil.toJsonStr(this);
    }

    public FeishuConfigStorage buildConfigStorage() {
        SocialRedisOperations redisOperations = SpringContextHolder.getBean(SocialRedisOperations.class);
        return FeishuConfigStorageHelper.withInitial(redisOperations,
                appKey, appSecret,
                false, eventEncryptKey, eventVerificationToken);
    }

    @Override
    public String getAppKey() {
        return appKey;
    }

    @Override
    public String getAppSecret() {
        return appSecret;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public String getEventEncryptKey() {
        return eventEncryptKey;
    }

    public void setEventEncryptKey(String eventEncryptKey) {
        this.eventEncryptKey = eventEncryptKey;
    }

    public String getEventVerificationToken() {
        return eventVerificationToken;
    }

    public void setEventVerificationToken(String eventVerificationToken) {
        this.eventVerificationToken = eventVerificationToken;
    }

    public boolean isEventCheck() {
        return eventCheck;
    }

    public void setEventCheck(boolean eventCheck) {
        this.eventCheck = eventCheck;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getPcUrl() {
        return pcUrl;
    }

    public void setPcUrl(String pcUrl) {
        this.pcUrl = pcUrl;
    }

    public String getMobileUrl() {
        return mobileUrl;
    }

    public void setMobileUrl(String mobileUrl) {
        this.mobileUrl = mobileUrl;
    }

    public String getEventUrl() {
        return eventUrl;
    }

    public void setEventUrl(String eventUrl) {
        this.eventUrl = eventUrl;
    }

    public boolean isContactSyncDone() {
        return contactSyncDone;
    }

    public void setContactSyncDone(boolean contactSyncDone) {
        this.contactSyncDone = contactSyncDone;
    }

    public boolean isConfigComplete() {
        return isConfigComplete;
    }

    public void setConfigComplete(boolean configComplete) {
        isConfigComplete = configComplete;
    }
}
