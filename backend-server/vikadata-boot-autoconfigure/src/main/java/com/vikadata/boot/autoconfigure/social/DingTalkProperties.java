package com.vikadata.boot.autoconfigure.social;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 钉钉配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/17 16:28
 */
@ConfigurationProperties(prefix = "vikadata-starter.social.dingtalk")
public class DingTalkProperties {

    private boolean enabled = false;

    private String env = "daily";

    /**
     * 开发E应用所属企业的corpId。在开发者后台首页可以看到
     */
    private String isvCorpId;

    /**
     * 企业密码
     */
    private String corpSecret;

    private Long suiteId;

    private String suiteKey;

    private String suiteSecret;

    private List<String> preEvnCorpIdList = Collections.emptyList();

    /**
     * 第三方企业应用--小程序应用
     */
    private MobileApp mobileApp;

    /**
     * 企业内部应用--接入H5微应用
     */
    private CorpH5App corpH5App;

    /**
     * 第三方企业应用/定制服务应用
     */
    private List<AgentAppProperty> agentApp = Collections.emptyList();

    /**
     * 第三方企业应用/应用市场应用
     */
    private List<IsvAppProperty> isvAppList = Collections.emptyList();

    /**
     * 基础路径，默认为 {@code dingtalk}
     */
    private String basePath = "dingtalk";

    /**
     * 事件订阅回调路径，默认为 {@code event}，每个应用的事件回调全路径为：/{socialType}/event
     */
    private String eventPath = "event";

    /**
     * sync http 事件订阅回调路径，默认为 {@code sync_event}，每个应用的事件回调全路径为：/{socialType}/sync_event
     */
    private String syncEventPath = "sync_event";

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

    public static class IsvAppProperty {
        /**
         * 加解密需要用到的token，可以随机填写，长度大于等于6个字符且少于64个字符。
         */
        private String token;

        /**
         * 回调消息加解密参数，是AES密钥的Base64编码，用于解密回调消息内容对应的密文,应用下相关应用产生的回调消息都使用该值来解密。
         */
        private String aesKey;

        private String suiteKey;

        private String suiteSecret;

        private String suiteId;

        private String appId;

        /**
         * 钉钉商品码，暂时存在配置文件里面，只有一个
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
         * 模版ID->模版钉钉搭icon
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

    /**
     * 检查配置是否填写
     *
     * @param properties 配置信息
     */
    public static void checkAppProperties(DingTalkProperties properties) {
        if (properties == null) {
            throw new IllegalArgumentException("Dingtalk properties should not be null, must be set");
        }

        if (properties.getMobileApp() == null || properties.getCorpH5App() == null) {
            throw new IllegalArgumentException("illegal App info: " + properties);
        }
    }

}
