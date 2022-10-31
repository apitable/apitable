package com.vikadata.social.dingtalk.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * department list id return
 */
@Setter
@Getter
@ToString
public class DingTalkServerAuthInfoResponse extends BaseResponse {
    /**
     * Authorized application information
     */
    private DingTalkServerAuthInfo authInfo;

    /**
     * Authorizer administrator information
     */
    private AgentAuthUserInfo authUserInfo;

    /**
     * Licensee company information
     */
    private DingTalkAuthCorpInfo authCorpInfo;

    /**
     * List of authorized service window application information
     */
    private ChannelAuthInfo channelAuthInfo;

    @Setter
    @Getter
    @ToString
    public static class DingTalkServerAuthInfo {
        private List<DingTalkAgentApp> agent;
    }


    @Setter
    @Getter
    @ToString
    public static class DingTalkAgentApp {
        /**
         * Authorizer App ID
         */
        private Long agentid;

        /**
         * Authorizer App Avatar
         */
        private String logoUrl;

        /**
         * App Id
         */
        private Long appid;

        /**
         * Authorizer application name
         */
        private String agentName;

        /**
         * The administrator userid who has administrative privileges for this microapp.
         */
        private List<String> adminList;
    }

    @Setter
    @Getter
    @ToString
    public static class AgentAuthUserInfo {
        /**
         * admin userid
         */
        private String userId;
    }

    @Setter
    @Getter
    @ToString
    public static class DingTalkAuthCorpInfo {
        /**
         * The Corp Id of the authorized company
         */
        private String corpid;

        /**
         * Invitation code. Only the company you invite will return the invitation code.
         * You can use this invitation code to count new pulls from different channels. Otherwise, the value is an empty string.
         */
        private String inviteCode;

        /**
         * The industry the company belongs to
         */
        private String industry;

        /**
         * Company name.
         */
        private String corpName;

        /**
         * License code
         */
        private String licenseCode;

        /**
         * Channel code
         */
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
         * 3: Primary Certification,
         */
        private Integer authLevel;

        /**
         * Enterprise Invitation Link
         */
        private String inviteUrl;

        /**
         * corporate logo
         */
        private String corpLogoUrl;
    }

    @Getter
    @Setter
    @ToString
    public static class ChannelAuthInfo {
        @JsonProperty("channelAgent")
        private List<ChannelAgent> channelAgent;
    }


    @Getter
    @Setter
    @ToString
    public static class ChannelAgent {
        /**
         * Authorizer application name
         */
        private String agentName;

        /**
         * Authorizer App ID
         */
        private Long agentid;

        /**
         * Authorizer App Avatar
         */
        private String logoUrl;

        /**
         * AppId
         */
        private Long appid;
    }

}
