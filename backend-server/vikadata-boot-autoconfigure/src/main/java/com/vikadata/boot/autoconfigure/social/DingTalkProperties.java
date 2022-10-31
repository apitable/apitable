package com.vikadata.boot.autoconfigure.social;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * dingtalk properties
 * </p>
 *
 * @author Shawn Deng
 */
@ConfigurationProperties(prefix = "vikadata-starter.social.dingtalk")
public class DingTalkProperties {

    private boolean enabled = false;

    private String env = "daily";

    /**
     * isv corp id
     */
    private String isvCorpId;

    /**
     * corp secret
     */
    private String corpSecret;

    private Long suiteId;

    private String suiteKey;

    private String suiteSecret;

    private List<String> preEvnCorpIdList = Collections.emptyList();

    private MobileApp mobileApp;

    private CorpH5App corpH5App;

    private List<AgentAppProperty> agentApp = Collections.emptyList();

    private List<IsvAppProperty> isvAppList = Collections.emptyList();

    /**
     * base path, default dingtalk
     */
    private String basePath = "dingtalk";

    /**
     * callback url of event, default is event, full callback event path should be ：/{socialType}/event
     */
    private String eventPath = "event";

    /**
     * sync http event subscribe path, default is sync_event, full callback event path should be ：/{socialType}/sync_event
     */
    private String syncEventPath = "sync_event";

    /**
     * callback url of message card, default is /card, full callback event path should be ：/{socialType}/card
     */
    private String cardEventPath = "card";

    /**
     * check properties
     *
     * @param properties dingtalk properties
     */
    public static void checkAppProperties(DingTalkProperties properties) {
        if (properties == null) {
            throw new IllegalArgumentException("Dingtalk properties should not be null, must be set");
        }
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getEnv() {
        return env;
    }

    public void setEnv(String env) {
        this.env = env;
    }

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

    public List<String> getPreEvnCorpIdList() {
        return preEvnCorpIdList;
    }

    public void setPreEvnCorpIdList(List<String> preEvnCorpIdList) {
        this.preEvnCorpIdList = preEvnCorpIdList;
    }

    public MobileApp getMobileApp() {
        return mobileApp;
    }

    public void setMobileApp(MobileApp mobileApp) {
        this.mobileApp = mobileApp;
    }

    public CorpH5App getCorpH5App() {
        return corpH5App;
    }

    public void setCorpH5App(CorpH5App corpH5App) {
        this.corpH5App = corpH5App;
    }

    public List<AgentAppProperty> getAgentApp() {
        return agentApp;
    }

    public void setAgentApp(List<AgentAppProperty> agentH5App) {
        agentApp = agentH5App;
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

    public String getSyncEventPath() {
        return syncEventPath;
    }

    public void setSyncEventPath(String syncEventPath) {
        this.syncEventPath = syncEventPath;
    }

    public String getCardEventPath() {
        return cardEventPath;
    }

    public void setCardEventPath(String cardEventPath) {
        this.cardEventPath = cardEventPath;
    }

    public List<IsvAppProperty> getIsvAppList() {
        return isvAppList;
    }

    public void setIsvAppList(List<IsvAppProperty> isvAppList) {
        this.isvAppList = isvAppList;
    }

    public static class MobileApp {

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

    public static class CorpH5App {

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

    public static class AgentAppProperty {
        private String agentId;

        private String customKey;

        private String customSecret;

        private String suiteTicket;

        private String corpId;

        /**
         * Encryption and decryption token
         */
        private String token;

        /**
         * aes key
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

    public static class IsvAppProperty {
        /**
         * Encryption token
         */
        private String token;

        /**
         * aes key
         */
        private String aesKey;

        private String suiteKey;

        private String suiteSecret;

        private String suiteId;

        private String appId;

        /**
         * dingtalk good code, only one
         */
        private String goodsCode;

        private DingTalkDa dingTalkDa;

        private IsvAppMessageTemplate msgTplId;

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

        public String getAppId() {
            return appId;
        }

        public void setAppId(String appId) {
            this.appId = appId;
        }

        public IsvAppMessageTemplate getMsgTplId() {
            return msgTplId;
        }

        public void setMsgTplId(IsvAppMessageTemplate msgTplId) {
            this.msgTplId = msgTplId;
        }

        public String getGoodsCode() {
            return goodsCode;
        }

        public void setGoodsCode(String goodsCode) {
            this.goodsCode = goodsCode;
        }

        public DingTalkDa getDingTalkDa() {
            return dingTalkDa;
        }

        public void setDingTalkDa(DingTalkDa dingTalkDa) {
            this.dingTalkDa = dingTalkDa;
        }
    }

    public static class IsvAppMessageTemplate {
        private String welcome;

        private String comment;

        private String member;

        public String getWelcome() {
            return welcome;
        }

        public void setWelcome(String welcome) {
            this.welcome = welcome;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getMember() {
            return member;
        }

        public void setMember(String member) {
            this.member = member;
        }
    }

    public static class DingTalkDa {
        private String key;

        private String secret;

        /**
         * template id <> dingtalk template icon
         */
        private Map<String, String> template = new HashMap<>();

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public Map<String, String> getTemplate() {
            return template;
        }

        public void setTemplate(Map<String, String> template) {
            this.template = template;
        }

    }

}
