package com.vikadata.integration.idaas.model;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 开通企业
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 18:53:29
 */
@Setter
@Getter
public class TenantResponse {

    private String id;

    private String name;

    private String displayName;

    private Admin admin;

    private IdpResponse idpResponse;

    private SsoResponse ssoResponse;

    @Setter
    @Getter
    public static class Admin {

        private String username;

        private String activationAddr;

    }

    @Setter
    @Getter
    public static class IdpResponse {

        private String id;

        private String redirectUrl;

    }

    @Setter
    @Getter
    public static class SsoResponse {

        private String id;

        private Config config;

        @Setter
        @Getter
        public static class Config {

            /**
             * 应用ClientID
             */
            private String clientId;

            /**
             * 应用ClientSecret
             */
            private String clientSecret;

            /**
             * 发起authorize地址
             */
            private String authorizationEndpoint;

            /**
             * 请求token接口的地址
             */
            private String tokenEndpoint;

            /**
             * 请求userInfo接口的地址
             */
            private String userInfoEndpoint;

            /**
             * well-known接口地址
             */
            private String wellKnownEndpoint;

        }

    }

}
