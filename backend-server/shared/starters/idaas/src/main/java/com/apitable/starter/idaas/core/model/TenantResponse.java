package com.apitable.starter.idaas.core.model;

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
             * application ClientID
             */
            private String clientId;

            /**
             * application ClientSecret
             */
            private String clientSecret;

            /**
             * originating authorize address
             */
            private String authorizationEndpoint;

            /**
             * request the address of the token interface
             */
            private String tokenEndpoint;

            /**
             * request the address of the userInfo interface
             */
            private String userInfoEndpoint;

            /**
             * well-known interface address
             */
            private String wellKnownEndpoint;

        }

    }

}
