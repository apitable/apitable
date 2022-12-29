package com.vikadata.social.wecom;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeComConfig {

    /*
     * storage mode
     * supported：memory、redis
     */
    private String storageType;

    // Redis prefix
    private String keyPrefix;

    // wecom app id
    private String vikaWeComAppId;

    private List<InitMenu> initMenus;

    private OperateEnpDdns operateEnpDdns;

    /**
     * isv service provider application configuration list
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

    @Setter
    @Getter
    public static class IsvApp {

        /**
         * service corp ID
         */
        private String corpId;

        /**
         * service provider key
         */
        private String providerSecret;

        /**
         * application suite id
         */
        private String suiteId;

        /**
         * application suite secret
         */
        private String suiteSecret;

        /**
         * application token
         */
        private String token;

        /**
         * application aes key
         */
        private String aesKey;

        /**
         * register success message template id
         */
        private String templateId;

        /**
         * invitation member success message ID
         */
        private String inviteTemplateId;

    }

}
