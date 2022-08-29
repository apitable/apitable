package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 获取应用管理员的身份信息
 * </p>
 * @author zoe zheng
 * @date 2021/9/22 15:58
 */
@Setter
@Getter
@ToString
public class DingTalkSsoUserInfoResponse extends BaseResponse {
    private UserInfo userInfo;

    /**
     * 是否是管理员。 true：是 false：不是
     */
    private Boolean isSys;

    private CorpInfo corpInfo;

    @Setter
    @Getter
    @ToString
    public static class UserInfo {
        /**
         * 头像地址
         */
        private String avatar;

        /**
         * email地址
         */
        private String email;

        /**
         * 用户名字
         */
        private String name;

        /**
         * 员工在企业内的userid
         */
        private String userid;
    }

    @Setter
    @Getter
    @ToString
    public static class CorpInfo {
        /**
         * 公司名字
         */
        private String corpName;

        /**
         * 公司corpid
         */
        private String corpid;
    }
}
