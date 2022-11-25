package com.apitable.starter.social.wecom.autoconfigure;

import java.util.List;

import me.chanjar.weixin.common.api.WxConsts.MenuButtonType;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * wecom properties
 * </p>
 * @author Pengap
 */
@ConfigurationProperties(prefix = "vikadata-starter.social.wecom")
public class WeComProperties {

    /**
     * whether to enabled, default false
     */
    private boolean enabled = false;

    /**
     * Display setting ID of enterprise wecom application vika page
     */
    private String vikaWeComAppId = "ina5200279359980055";

    /**
     * Initialization Menu
     */
    private List<InitMenu> initMenus;

    /**
     * Storage Policy
     */
    private ConfigStorage configStorage;

    /**
     * create enterprise wecom domain name interface configuration
     */
    private OperateEnpDdns operateEnpDdns;

    /**
     * Application configuration list of third-party service providers
     */
    private List<IsvApp> isvAppList;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getVikaWeComAppId() {
        return vikaWeComAppId;
    }

    public void setVikaWeComAppId(String vikaWeComAppId) {
        this.vikaWeComAppId = vikaWeComAppId;
    }

    public List<InitMenu> getInitMenus() {
        return initMenus;
    }

    public void setInitMenus(List<InitMenu> initMenus) {
        this.initMenus = initMenus;
    }

    public ConfigStorage getConfigStorage() {
        return configStorage;
    }

    public void setConfigStorage(ConfigStorage configStorage) {
        this.configStorage = configStorage;
    }

    public OperateEnpDdns getOperateEnpDdns() {
        return operateEnpDdns;
    }

    public void setOperateEnpDdns(OperateEnpDdns operateEnpDdns) {
        this.operateEnpDdns = operateEnpDdns;
    }

    public List<IsvApp> getIsvAppList() {
        return isvAppList;
    }

    public void setIsvAppList(List<IsvApp> isvAppList) {
        this.isvAppList = isvAppList;
    }

    public static class InitMenu {

        /**
         * menu name
         */
        private String name;

        /**
         * menu type {@link MenuButtonType}
         */
        private String type;

        /**
         * The menu url relative address Path and domain name address are automatically filled in according to different applications.
         * If it is a complete address, it will not be automatically filled in.
         * <p>path：/ Represents the application homepage
         */
        private String url;

        /**
         * sub menu
         */
        private List<InitMenu> subButtons;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public List<InitMenu> getSubButtons() {
            return subButtons;
        }

        public void setSubButtons(List<InitMenu> subButtons) {
            this.subButtons = subButtons;
        }
    }

    public static class ConfigStorage {

        /**
         * Storage Type.
         */
        private StorageType storageType = StorageType.memory;

        /**
         * key prefix.
         */
        private String keyPrefix = "vikadata";

        public StorageType getStorageType() {
            return storageType;
        }

        public void setStorageType(StorageType storageType) {
            this.storageType = storageType;
        }

        public String getKeyPrefix() {
            return keyPrefix;
        }

        public void setKeyPrefix(String keyPrefix) {
            this.keyPrefix = keyPrefix;
        }
    }

    public enum StorageType {
        memory,
        redis
    }

    public static class OperateEnpDdns {

        /**
         * api domain name address
         */
        private String apiHost;

        /**
         * ddns operation interface Url
         */
        private String actionDdnsUrl;

        /**
         * apply enterprise domain template
         */
        private String applyEnpDomainTemplate;

        public String getApiHost() {
            return apiHost;
        }

        public void setApiHost(String apiHost) {
            this.apiHost = apiHost;
        }

        public String getActionDdnsUrl() {
            return actionDdnsUrl;
        }

        public void setActionDdnsUrl(String actionDdnsUrl) {
            this.actionDdnsUrl = actionDdnsUrl;
        }

        public String getApplyEnpDomainTemplate() {
            return applyEnpDomainTemplate;
        }

        public void setApplyEnpDomainTemplate(String applyEnpDomainTemplate) {
            this.applyEnpDomainTemplate = applyEnpDomainTemplate;
        }
    }

    /**
     * <p>
     * isv properties
     * </p>
     */
    public static class IsvApp {

        /**
         * application name, must not null
         */
        private String name;

        /**
         * corp ID
         */
        private String corpId;

        /**
         * isv secret
         */
        private String providerSecret;

        /**
         * app suite id
         */
        private String suiteId;

        /**
         * app suite secret
         */
        private String suiteSecret;

        /**
         * app Token
         */
        private String token;

        /**
         * app AES key
         */
        private String aesKey;

        /**
         * register template ID
         */
        private String templateId;

        /**
         * invite template id
         */
        private String inviteTemplateId;

        /**
         * manual auth time is GMT+8, this is for user which don't open permission,
         * in case of wecom intercept
         */
        private String manualAuthDatetime;

        /**
         * Trial edition ID for subscription
         */
        private String subscriptionTrialEditionId;

        /**
         * permit trial days
         */
        private Integer permitTrialDays;

        /**
         * id of notify template  when free trial is expired
         */
        private String permitTrialExpiredTemplateId;

        /**
         * control notify frequency before trial expire, example: 1,3,7,15,30
         */
        private String permitBuyNotifyBeforeDays;

        /**
         * set user id when purchasing interface license
         */
        private String permitBuyerUserId;

        /**
         * The paid user can purchase the interface license
         * only after the specified number of days for the first authorized installation
         *
         */
        private Integer permitCompatibleDays;

        /**
         * webhook address of interface license
         */
        private String permitNotifyWebhookUrl;

        /**
         * webhook message secret of interface license
         */
        private String permitNotifyWebhookSecret;

        /**
         * start time interval for daily notification of interface license
         *
         */
        private String permitNotifyTimeStart;

        /**
         * end time interval for daily notification of interface license
         */
        private String permitNotifyTimeEnd;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCorpId() {
            return corpId;
        }

        public void setCorpId(String corpId) {
            this.corpId = corpId;
        }

        public String getProviderSecret() {
            return providerSecret;
        }

        public void setProviderSecret(String providerSecret) {
            this.providerSecret = providerSecret;
        }

        public String getSuiteId() {
            return suiteId;
        }

        public void setSuiteId(String suiteId) {
            this.suiteId = suiteId;
        }

        public String getSuiteSecret() {
            return suiteSecret;
        }

        public void setSuiteSecret(String suiteSecret) {
            this.suiteSecret = suiteSecret;
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

        public String getTemplateId() {
            return templateId;
        }

        public void setTemplateId(String templateId) {
            this.templateId = templateId;
        }

        public String getInviteTemplateId() {
            return inviteTemplateId;
        }

        public void setInviteTemplateId(String inviteTemplateId) {
            this.inviteTemplateId = inviteTemplateId;
        }

        public String getManualAuthDatetime() {
            return manualAuthDatetime;
        }

        public void setManualAuthDatetime(String manualAuthDatetime) {
            this.manualAuthDatetime = manualAuthDatetime;
        }

        public String getSubscriptionTrialEditionId() {
            return subscriptionTrialEditionId;
        }

        public void setSubscriptionTrialEditionId(String subscriptionTrialEditionId) {
            this.subscriptionTrialEditionId = subscriptionTrialEditionId;
        }

        public Integer getPermitTrialDays() {
            return permitTrialDays;
        }

        public void setPermitTrialDays(Integer permitTrialDays) {
            this.permitTrialDays = permitTrialDays;
        }

        public String getPermitTrialExpiredTemplateId() {
            return permitTrialExpiredTemplateId;
        }

        public void setPermitTrialExpiredTemplateId(String permitTrialExpiredTemplateId) {
            this.permitTrialExpiredTemplateId = permitTrialExpiredTemplateId;
        }

        public String getPermitBuyNotifyBeforeDays() {
            return permitBuyNotifyBeforeDays;
        }

        public void setPermitBuyNotifyBeforeDays(String permitBuyNotifyBeforeDays) {
            this.permitBuyNotifyBeforeDays = permitBuyNotifyBeforeDays;
        }

        public String getPermitBuyerUserId() {
            return permitBuyerUserId;
        }

        public void setPermitBuyerUserId(String permitBuyerUserId) {
            this.permitBuyerUserId = permitBuyerUserId;
        }

        public Integer getPermitCompatibleDays() {
            return permitCompatibleDays;
        }

        public void setPermitCompatibleDays(Integer permitCompatibleDays) {
            this.permitCompatibleDays = permitCompatibleDays;
        }

        public String getPermitNotifyWebhookUrl() {
            return permitNotifyWebhookUrl;
        }

        public void setPermitNotifyWebhookUrl(String permitNotifyWebhookUrl) {
            this.permitNotifyWebhookUrl = permitNotifyWebhookUrl;
        }

        public String getPermitNotifyWebhookSecret() {
            return permitNotifyWebhookSecret;
        }

        public void setPermitNotifyWebhookSecret(String permitNotifyWebhookSecret) {
            this.permitNotifyWebhookSecret = permitNotifyWebhookSecret;
        }

        public String getPermitNotifyTimeStart() {
            return permitNotifyTimeStart;
        }

        public void setPermitNotifyTimeStart(String permitNotifyTimeStart) {
            this.permitNotifyTimeStart = permitNotifyTimeStart;
        }

        public String getPermitNotifyTimeEnd() {
            return permitNotifyTimeEnd;
        }

        public void setPermitNotifyTimeEnd(String permitNotifyTimeEnd) {
            this.permitNotifyTimeEnd = permitNotifyTimeEnd;
        }

    }

}
