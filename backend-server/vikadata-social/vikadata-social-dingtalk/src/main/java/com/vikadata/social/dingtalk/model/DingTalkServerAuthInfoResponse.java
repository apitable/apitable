package com.vikadata.social.dingtalk.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门列表ID返回
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkServerAuthInfoResponse extends BaseResponse {
    /**
     * 授权应用信息
     */
    private DingTalkServerAuthInfo authInfo;

    /**
     * 授权方管理员信息
     */
    private AgentAuthUserInfo authUserInfo;

    /**
     * 授权方企业信息
     */
    private DingTalkAuthCorpInfo authCorpInfo;

    /**
     * 授权的服务窗应用信息列表
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
         * 授权方应用ID
         */
        private Long agentid;

        /**
         * 授权方应用头像
         */
        private String logoUrl;

        /**
         * 应用Id
         */
        private Long appid;

        /**
         * 授权方应用名字
         */
        private String agentName;

        /**
         * 对此微应用有管理权限的管理员userid。
         */
        private List<String> adminList;
    }

    @Setter
    @Getter
    @ToString
    public static class AgentAuthUserInfo {
        /**
         * 管理员的userid
         */
        private String userId;
    }

    @Setter
    @Getter
    @ToString
    public static class DingTalkAuthCorpInfo {
        /**
         * 授权企业的CorpId
         */
        private String corpid;

        /**
         * 邀请码，只有自己邀请的企业才会返回邀请码，可用该邀请码统计不同渠道的拉新，否则值为空字符串。
         */
        private String inviteCode;

        /**
         * 企业所属行业
         */
        private String industry;

        /**
         * 授权方企业名称。
         */
        private String corpName;

        /**
         * 序列号
         */
        private String licenseCode;

        /**
         * 渠道码。
         */
        private String authChannel;

        /**
         * 渠道类型。
         *
         * 为了避免渠道码重复，可与渠道码共同确认渠道。可能为空，非空时当前只有满天星类型，值为STAR_ACTIVITY。
         */
        private String authChannelType;

        /**
         * 企业认证等级：
         * 0：未认证
         * 1：高级认证
         * 2：中级认证
         * 3：初级认证
         */
        private Integer authLevel;

        /**
         * 企业邀请链接
         */
        private String inviteUrl;

        /**
         * 企业logo
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
         * 授权方应用名字
         */
        private String agentName;

        /**
         * 授权方应用ID
         */
        private Long agentid;

        /**
         * 授权方应用头像
         */
        private String logoUrl;

        /**
         * 应用Id
         */
        private Long appid;
    }

}
