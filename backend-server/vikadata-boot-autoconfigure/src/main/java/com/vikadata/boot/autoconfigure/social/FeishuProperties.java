package com.vikadata.boot.autoconfigure.social;

import cn.hutool.core.util.StrUtil;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 飞书集成配置
 *
 * @author Shawn Deng
 * @date 2020-11-18 17:46:46
 */
@ConfigurationProperties(prefix = "vikadata-starter.social.feishu")
public class FeishuProperties extends SocialProperties {

    private boolean enabled = false;

    /**
     * 应用名称
     */
    private String appName;

    /**
     * 数据加密密钥，选填
     */
    private String encryptKey;

    /**
     * 事件验证令牌，必填
     */
    private String verificationToken;

    /**
     * 是否第三方应用,决定是否使用 {@code app ticket} 身份验证
     */
    private Boolean isv = Boolean.FALSE;

    /**
     * 基础路径，默认为 {@code feishu}
     */
    private String basePath = "feishu";

    /**
     * 事件订阅回调路径，默认为 {@code event}，每个应用的事件回调全路径为：/{socialType}/event
     */
    private String eventPath = "event";

    /**
     * 消息卡片回调路径，默认为 {@code /card}，每个应用的事件回调全路径为：/{socialType}/card
     */
    private String cardEventPath = "card";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getEncryptKey() {
        return encryptKey;
    }

    public void setEncryptKey(String encryptKey) {
        this.encryptKey = encryptKey;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public Boolean getIsv() {
        return isv;
    }

    public void setIsv(Boolean isv) {
        this.isv = isv;
    }

    public String getBasePath() {
        return basePath;
    }

    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }

    public String getEventPath() {
        return eventPath;
    }

    public void setEventPath(String eventPath) {
        this.eventPath = eventPath;
    }

    public String getCardEventPath() {
        return cardEventPath;
    }

    public void setCardEventPath(String cardEventPath) {
        this.cardEventPath = cardEventPath;
    }

    /**
     * 检查配置是否填写
     *
     * @param properties 配置信息
     */
    @Deprecated
    public static void checkAppProperties(FeishuProperties properties) {
        if (properties == null) {
            throw new IllegalArgumentException("Feishu properties should not be null, must be set");
        }

        if (StrUtil.isBlank(properties.getAppId())
            || StrUtil.isBlank(properties.getAppSecret())
            || StrUtil.isBlank(properties.getVerificationToken())) {
            throw new IllegalArgumentException("illegal App info: " + properties);
        }
    }
}
