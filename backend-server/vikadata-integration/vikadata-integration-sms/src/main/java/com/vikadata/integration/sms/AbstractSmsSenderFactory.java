package com.vikadata.integration.sms;

/**
 * <p>
 * SMS sender factory abstract class
 * </p>
 *
 */
public abstract class AbstractSmsSenderFactory {

    private Integer appId;

    private String appKey;

    private String sign;

    public AbstractSmsSenderFactory(Integer appId, String appKey, String sign) {
        this.appId = appId;
        this.appKey = appKey;
        this.sign = sign;
    }

    public Integer getAppId() {
        return appId;
    }

    public void setAppId(Integer appId) {
        this.appId = appId;
    }

    public String getAppKey() {
        return appKey;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }
}
