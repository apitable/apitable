package com.vikadata.boot.autoconfigure.wx.pay;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-21 21:17:00
 */
@ConfigurationProperties(prefix = "vikadata-starter.wx.pay")
public class WxPayProperties {

    private boolean enabled = false;

    /**
     * 设置微信公众号或者小程序等的appid.
     */
    private String appId;

    /**
     * 微信支付商户号.
     */
    private String mchId;

    /**
     * 微信支付商户密钥.
     */
    private String mchKey;

    /**
     * 服务商模式下的子商户公众账号ID，普通模式请不要配置，请在配置文件中将对应项删除.
     */
    private String subAppId;

    /**
     * 服务商模式下的子商户号，普通模式请不要配置，最好是请在配置文件中将对应项删除.
     */
    private String subMchId;

    /**
     * apiclient_cert.p12文件的绝对路径，或者如果放在项目中，请以classpath:开头指定.
     */
    private String keyPath;

    /**
     * 微信支付分serviceId
     */
    private String serviceId;

    /**
     * 证书序列号
     */
    private String certSerialNo;

    /**
     * apiV3秘钥
     */
    private String apiv3Key;

    /**
     * 微信支付分回调地址
     */
    private String payScoreNotifyUrl;

    /**
     * apiv3 商户apiclient_key.pem
     */
    private String privateKeyPath;

    /**
     * apiv3 商户apiclient_cert.pem
     */
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
