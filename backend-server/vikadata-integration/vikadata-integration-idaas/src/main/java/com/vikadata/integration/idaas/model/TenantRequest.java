package com.vikadata.integration.idaas.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 开通企业
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 18:53:20
 */
@Setter
@Getter
public class TenantRequest {

    /**
     * 企业名，会显示在url链接中
     */
    private String name;

    /**
     * 企业显示名称
     */
    private String displayName;

    /**
     * 租户类型，为 PROD 或者 TEST，表示为正式客户、测试客户。默认 PROD
     */
    private String env = "PROD";

    /**
     * 初始管理员
     */
    private Admin admin;

    /**
     * 配置信息
     */
    private Config config;

    @Setter
    @Getter
    public static class Admin {

        private String username;

        private String password;

    }

    @Setter
    @Getter
    public static class Config {

        /**
         * 认证源相关配置
         */
        private IdpInfo idpInfo;

        /**
         * 单点登录应用相关配置
         */
        private SsoInfo ssoInfo;

        @Setter
        @Getter
        public static class  IdpInfo {

            private String appCode;

            private AppConfig appConfig;

            @Setter
            @Getter
            public static class AppConfig {

                private String abc;

                private String bcd;

            }

        }

        @Setter
        @Getter
        public static class SsoInfo {

            private String appCode;

            private AppConfig appConfig;

            @Setter
            @Getter
            public static class AppConfig {

                private String abc;

                private String bcd;

            }

        }

    }

}
