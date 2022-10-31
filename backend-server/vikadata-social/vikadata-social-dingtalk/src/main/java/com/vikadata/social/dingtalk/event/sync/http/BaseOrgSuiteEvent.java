package com.vikadata.social.dingtalk.event.sync.http;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Event List -- Basic Enterprise Licensing Suite Information
 */
@Setter
@Getter
@ToString
public class BaseOrgSuiteEvent extends BaseSyncHttpEvent {
    private AuthCorpInfo authCorpInfo;

    private AuthInfo authInfo;

    private AuthUserInfo authUserInfo;

    private AuthScope authScope;

    private String permanentCode;

    private String chPermanentCode;

    @Getter
    @Setter
    @ToString
    public static class AuthCorpInfo {

        private String authChannel;

        /**
         * Channel type.
         * To avoid duplication of channel codes, you can confirm the channel together with the channel code.
         * It may be empty. When it is not empty, there is currently only the star type, and the value is STAR ACTIVITY.
         */
        private String authChannelType;

        /**
         * Enterprise certification level:
         * 0: Not authenticated,
         * 1: Advanced Certification,
         * 2: Intermediate certification,
         * 3: Primary Certification
         */
        private Integer authLevel;

        private String corpLogoUrl;

        private String corpName;

        private String corpid;


        /**
         * The industry the company belongs to
         */
        private String industry;

        /**
         * Invitation code. Only the company you invite will return the invitation code.
         * You can use this invitation code to count new pulls from different channels. Otherwise, the value is an empty string.
         */
        private String inviteCode;

        /**
         * Enterprise Invitation Link
         */
        private String inviteUrl;

        private Boolean isAuthenticated;

        /**
         * serial number
         */
        private String licenseCode;
    }

    @Getter
    @Setter
    @ToString
    public static class AuthInfo {
        private List<Agent> agent;
    }

    @Getter
    @Setter
    @ToString
    public static class Agent {
        /**
         * The administrator userid who has administrative privileges for this microapp.
         */
        private List<String> adminList;

        /**
         * Authorizer application name
         */
        private String agentName;

        /**
         * authorizer app id
         */
        private Long agentid;

        private Long appid;

        /**
         * Authorizer App Avatar
         */
        private String logoUrl;
    }

    @Getter
    @Setter
    @ToString
    public static class AuthUserInfo {
        @JsonProperty("userId")
        private String userId;
    }

    @Getter
    @Setter
    @ToString
    public static class AuthScope {
        private Integer errcode;

        private String errmsg;

        private List<String> conditionField;

        private List<String> authUserField;

        private AuthOrgScopes authOrgScopes;
    }

    @Getter
    @Setter
    @ToString
    public static class AuthOrgScopes {
        private List<String> authedUser;

        private List<String> authedDept;
    }
}
