package com.vikadata.social.dingtalk;

import java.io.Serializable;
import java.util.HashMap;

import com.vikadata.social.dingtalk.config.DingTalkConfigStorage;

/**
 * DingTalk configuration
 */
public class DingtalkConfig {

    private String isvCorpId;

    /**
     * corporate password
     */
    private String corpSecret;

    private Long suiteId;

    private String suiteKey;

    private String suiteSecret;

    private Mobile mobile;

    private H5app h5app;

    /**
     * App storage service for custom services
     */
    private DingTalkConfigStorage agentAppStorage;

    /**
     * market application
     */
    private HashMap<String, IsvApp> isvAppMap;

    public String getIsvCorpId() {
        return isvCorpId;
    }

    public void setIsvCorpId(String isvCorpId) {
        this.isvCorpId = isvCorpId;
    }

    public String getCorpSecret() {
        return corpSecret;
    }

    public void setCorpSecret(String corpSecret) {
        this.corpSecret = corpSecret;
    }

    public Long getSuiteId() {
        return suiteId;
    }

    public void setSuiteId(Long suiteId) {
        this.suiteId = suiteId;
    }

    public String getSuiteKey() {
        return suiteKey;
    }

    public void setSuiteKey(String suiteKey) {
        this.suiteKey = suiteKey;
    }

    public String getSuiteSecret() {
        return suiteSecret;
    }

    public void setSuiteSecret(String suiteSecret) {
        this.suiteSecret = suiteSecret;
    }

    public Mobile getMobile() {
        return mobile;
    }

    public void setMobile(Mobile mobile) {
        this.mobile = mobile;
    }

    public H5app getH5app() {
        return h5app;
    }

    public void setH5app(H5app h5app) {
        this.h5app = h5app;
    }

    public DingTalkConfigStorage getAgentAppStorage() {
        return agentAppStorage;
    }

    public void setAgentAppStorage(DingTalkConfigStorage agentAppStorage) {
        this.agentAppStorage = agentAppStorage;
    }

    public HashMap<String, IsvApp> getIsvAppMap() {
        return isvAppMap;
    }

    public void setIsvAppMap(HashMap<String, IsvApp> isvAppMap) {
        this.isvAppMap = isvAppMap;
    }

    public static class Mobile {

        private String appId;

        private String appSecret;

        public String getAppId() {
            return appId;
        }

        public void setAppId(String appId) {
            this.appId = appId;
        }

        public String getAppSecret() {
            return appSecret;
        }

        public void setAppSecret(String appSecret) {
            this.appSecret = appSecret;
        }
    }

    public static class H5app {

        private String appKey;

        private String appSecret;

        public String getAppKey() {
            return appKey;
        }

        public void setAppKey(String appKey) {
            this.appKey = appKey;
        }

        public String getAppSecret() {
            return appSecret;
        }

        public void setAppSecret(String appSecret) {
            this.appSecret = appSecret;
        }
    }

    public static class AgentApp implements Serializable {

        private static final long serialVersionUID = -6968365532035131890L;

        private String agentId;

        private String customKey;

        private String customSecret;

        private String suiteTicket;

        private String corpId;

        private String token;

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

    public static class IsvApp implements Serializable {

        private static final long serialVersionUID = -6968365532035131890L;

        private String token;

        private String aesKey;

        private String suiteKey;

        private String suiteSecret;

        private String suiteId;

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

        public String getSuiteKey() {
            return suiteKey;
        }

        public void setSuiteKey(String suiteKey) {
            this.suiteKey = suiteKey;
        }

        public String getSuiteSecret() {
            return suiteSecret;
        }

        public void setSuiteSecret(String suiteSecret) {
            this.suiteSecret = suiteSecret;
        }

        public String getSuiteId() {
            return suiteId;
        }

        public void setSuiteId(String suiteId) {
            this.suiteId = suiteId;
        }
    }
}
