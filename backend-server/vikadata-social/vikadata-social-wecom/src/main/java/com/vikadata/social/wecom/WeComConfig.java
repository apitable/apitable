package com.vikadata.social.wecom;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 企业微信基础公共配置
 * </p>
 *
 * @author Pengap
 * @date 2021/8/2 19:09:14
 */
@Getter
@Setter
public class WeComConfig {

    /*
     * 存储模式
     * 目前支持：memory、redis
     */
    private String storageType;

    // 存储Redis 目录前缀
    private String keyPrefix;

    // vika显示企业应用Id
    private String vikaWeComAppId;

    private List<InitMenu> initMenus;

    private OperateEnpDdns operateEnpDdns;

    /**
     * 第三方服务商应用配置列表
     */
    private List<IsvApp> isvAppList;

    public WeComConfig(String storageType, String keyPrefix) {
        this.storageType = storageType;
        this.keyPrefix = keyPrefix;
    }

    @Getter
    @Setter
    public static class InitMenu {

        private String name;

        private String type;

        private String url;

        private List<InitMenu> subButtons;

    }

    @Getter
    @Setter
    public static class OperateEnpDdns {

        private String apiHost;

        private String actionDdnsUrl;

        private String applyEnpDomainTemplate;

    }

    /**
     * <p>
     * 第三方服务商配置
     * </p>
     * @author 刘斌华
     * @date 2022-01-05 10:02:47
     */
    @Setter
    @Getter
    public static class IsvApp {

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

    }

}
