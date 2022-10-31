package com.vikadata.integration.idaas.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * open enterprise
 * </p>
 *
 */
@Setter
@Getter
public class TenantRequest {

    /**
     * business name is displayed in the url link
     */
    private String name;

    /**
     * enterprise display name
     */
    private String displayName;

    /**
     * Tenant type, PROD or TEST, refers to formal customer and test customer. Default PROD
     */
    private String env = "PROD";

    /**
     * initial Administrator
     */
    private Admin admin;

    /**
     * configuration information
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
         * configure the authentication source
         */
        private IdpInfo idpInfo;

        /**
         * configuration related to single sign on application
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
