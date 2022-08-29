package com.vikadata.integration.vika.model;

/** 
* <p> 
* 钉钉定制应用配置
* </p> 
* @author zoe zheng 
* @date 2021/5/28 11:53 上午
*/
public class DingTalkAgentAppInfo {

    private String agentId;

    private String customKey;

    private String customSecret;

    private String suiteTicket;

    private String corpId;

    /**
     * 加解密需要用到的token，可以随机填写，长度大于等于6个字符且少于64个字符。
     */
    private String token;

    /**
     * 数据加密密钥。用于回调数据的加密，长度固定为43个字符，从a-z，A-Z，0-9共62个字符中选取，您可以随机生成，ISV(服务提供商)推荐使用注册套件时填写的EncodingAESKey。
     */
    private String aesKey;

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public String getCustomKey() {
        return customKey;
    }

    public void setCustomKey(String customKey) {
        this.customKey = customKey;
    }

    public String getCustomSecret() {
        return customSecret;
    }

    public void setCustomSecret(String customSecret) {
        this.customSecret = customSecret;
    }

    public String getSuiteTicket() {
        return suiteTicket;
    }

    public void setSuiteTicket(String suiteTicket) {
        this.suiteTicket = suiteTicket;
    }

    public String getCorpId() {
        return corpId;
    }

    public void setCorpId(String corpId) {
        this.corpId = corpId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getAesKey() {
        return aesKey;
    }

    public void setAesKey(String aesKey) {
        this.aesKey = aesKey;
    }
    
}
