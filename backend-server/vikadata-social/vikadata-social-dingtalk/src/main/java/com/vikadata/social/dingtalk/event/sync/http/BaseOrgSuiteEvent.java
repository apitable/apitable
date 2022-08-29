package com.vikadata.social.dingtalk.event.sync.http;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 事件列表 -- 基础企业授权套件信息
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/2 3:47 下午
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
         * 企业logo
         */
        private String corpLogoUrl;

        /**
         * 授权方企业名称。
         */
        private String corpName;

        /**
         * 授权企业的CorpId
         */
        private String corpid;


        /**
         * 企业所属行业
         */
        private String industry;

        /**
         * 邀请码，只有自己邀请的企业才会返回邀请码，可用该邀请码统计不同渠道的拉新，否则值为空字符串。
         */
        private String inviteCode;

        /**
         * 企业邀请链接
         */
        private String inviteUrl;

        /**
         *
         */
        private Boolean isAuthenticated;

        /**
         * 序列号
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
         * 对此微应用有管理权限的管理员userid。
         */
        private List<String> adminList;

        /**
         * 授权方应用名字
         */
        private String agentName;

        /**
         * 授权方应用ID
         */
        private Long agentid;

        /**
         * 应用Id
         */
        private Long appid;

        /**
         * 授权方应用头像
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
