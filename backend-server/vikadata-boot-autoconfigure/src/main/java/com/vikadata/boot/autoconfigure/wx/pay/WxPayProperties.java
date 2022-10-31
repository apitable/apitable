package com.vikadata.boot.autoconfigure.wx.pay;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.wx.pay")
public class WxPayProperties {

    private boolean enabled = false;

    private String appId;

    private String mchId;

    private String mchKey;

    private String subAppId;

    private String subMchId;

    private String keyPath;

    private String serviceId;

    private String certSerialNo;

    private String apiv3Key;

    private String payScoreNotifyUrl;

    private String privateKeyPath;

    private String privateCertPath;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getMchId() {
        return mchId;
    }

    public void setMchId(String mchId) {
        this.mchId = mchId;
    }

    public String getMchKey() {
        return mchKey;
    }

    public void setMchKey(String mchKey) {
        this.mchKey = mchKey;
    }

    public String getSubAppId() {
        return subAppId;
    }

    public void setSubAppId(String subAppId) {
        this.subAppId = subAppId;
    }

    public String getSubMchId() {
        return subMchId;
    }

    public void setSubMchId(String subMchId) {
        this.subMchId = subMchId;
    }

    public String getKeyPath() {
        return keyPath;
    }

    public void setKeyPath(String keyPath) {
        this.keyPath = keyPath;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getCertSerialNo() {
        return certSerialNo;
    }

    public void setCertSerialNo(String certSerialNo) {
        this.certSerialNo = certSerialNo;
    }

    public String getApiv3Key() {
        return apiv3Key;
    }

    public void setApiv3Key(String apiv3Key) {
        this.apiv3Key = apiv3Key;
    }

    public String getPayScoreNotifyUrl() {
        return payScoreNotifyUrl;
    }

    public void setPayScoreNotifyUrl(String payScoreNotifyUrl) {
        this.payScoreNotifyUrl = payScoreNotifyUrl;
    }

    public String getPrivateKeyPath() {
        return privateKeyPath;
    }

    public void setPrivateKeyPath(String privateKeyPath) {
        this.privateKeyPath = privateKeyPath;
    }

    public String getPrivateCertPath() {
        return privateCertPath;
    }

    public void setPrivateCertPath(String privateCertPath) {
        this.privateCertPath = privateCertPath;
    }
}
