package com.vikadata.boot.autoconfigure.social.wecom;

import java.util.List;

import me.chanjar.weixin.common.api.WxConsts.MenuButtonType;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 企业微信配置文件
 * </p>
 * @author Pengap
 * @date 2021/7/26 15:21:50
 */
@ConfigurationProperties(prefix = "vikadata-starter.social.wecom")
public class WeComProperties {

    /**
     * 是否启用（默认: false）
     */
    private boolean enabled = false;

    /**
     * 企业微信应用vika页面的显示设置ID
     */
    private String vikaWeComAppId = "ina5200279359980055";

    /**
     * 初始化菜单
     */
    private List<InitMenu> initMenus;

    /**
     * 存储策略
     */
    private ConfigStorage configStorage;

    /**
     * 自动创建企业微信域名接口配置
     */
    private OperateEnpDdns operateEnpDdns;

    /**
     * 第三方服务商应用配置列表
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
         * 菜单名称
         */
        private String name;

        /**
         * 菜单类型 {@link MenuButtonType}
         */
        private String type;

        /**
         * 菜单Url，相对地址Path，域名地址根据不同的应用自动填充，如果是完整地址就不自动填充
         * <p>path：/ ，表示应用主页
         */
        private String url;

        /**
         * 子菜单
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
         * 存储类型.
         */
        private StorageType storageType = StorageType.memory;

        /**
         * 指定key前缀.
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
        /**
         * 内存.
         */
        memory,

        /**
         * redis(RedisTemplate).
         */
        redis
    }

    public static class OperateEnpDdns {

        /**
         * ddns 操作api域名地址
         */
        private String apiHost;

        /**
         * ddns 操作接口Url
         */
        private String actionDdnsUrl;

        /**
         * 申请企业域名模版
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
     * 第三方服务商配置
     * </p>
     * @author 刘斌华
     * @date 2022-01-05 10:02:47
     */
    public static class IsvApp {

        /**
         * 应用名称。不能为空且必须唯一
         */
        private String name;

        /**
         * 企业 ID
         */
        private String corpId;

        /**
         * 服务商密钥
         */
        private String providerSecret;

        /**
         * 应用套件 ID
         */
        private String suiteId;

        /**
         * 应用套件密钥
         */
        private String suiteSecret;

        /**
         * 应用 Token
         */
        private String token;

        /**
         * 应用 AES 密钥
         */
        private String aesKey;

        /**
         * 注册模板 ID
         */
        private String templateId;

        /**
         * 邀请成员模板消息 ID
         */
        private String inviteTemplateId;

        /**
         * 手动授权上线的时间，GMT+8。这个是为了兼容之前未开通权限的老用户，防止被企微拦截
         */
        private String manualAuthDatetime;

        /**
         * 接口许可免费试用天数
         */
        private Integer permitTrialDays;

        /**
         * 接口许可免费试用到期空间站通知模板 ID
         */
        private String permitTrialExpiredTemplateId;

        /**
         * 接口许可免费试用过期的前几天发送通知。格式：1,3,7,15,30
         */
        private String permitBuyNotifyBeforeDays;

        /**
         * 购买接口许可时的下单人 user_id
         */
        private String permitBuyerUserId;

        /**
         * 付费用户首次授权安装指定的天数后才购买接口许可
         */
        private Integer permitCompatibleDays;

        /**
         * 接口许可 Webhook 消息通知地址
         */
        private String permitNotifyWebhookUrl;

        /**
         * 接口许可 Webhook 消息通知密钥
         */
        private String permitNotifyWebhookSecret;

        /**
         * 接口许可每日通知的时间区间
         */
        private String permitNotifyTimeStart;

        /**
         * 接口许可每日通知的时间区间
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
