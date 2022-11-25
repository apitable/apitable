package com.apitable.starter.vika.core.model;

/**
 * <p>
 * DingTalk Customized application configuration
 * </p>
 *
 */
public class DingTalkAgentAppInfo {

    private String agentId;

    private String customKey;

    private String customSecret;

    private String suiteTicket;

    private String corpId;

    /**
     * The token required for encryption and decryption can be filled in randomly, with a length of no less than 6 characters and no more than 64 characters.
     */
    private String token;

    /**
     * Data encryption key. It is used for the encryption of callback data. The length is fixed to 43 characters. You can select from a total of 62 characters a-z, A-Z, 0-9. You can randomly generate it.
     * ISV (service provider) recommends using the EncodingAESKey filled in when registering a suite.
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
