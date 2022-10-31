package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get the identity information of the application administrator
 */
@Setter
@Getter
@ToString
public class DingTalkSsoUserInfoResponse extends BaseResponse {
    private UserInfo userInfo;

    /**
     * Is the administrator. true: yes false: no
     */
    private Boolean isSys;

    private CorpInfo corpInfo;

    @Setter
    @Getter
    @ToString
    public static class UserInfo {
        /**
         * Avatar address
         */
        private String avatar;

        /**
         * email address
         */
        private String email;

        /**
         * Username
         */
        private String name;

        /**
         * The userid of the employee in the company
         */
        private String userid;
    }

    @Setter
    @Getter
    @ToString
    public static class CorpInfo {
        /**
         * company name
         */
        private String corpName;

        /**
         * company corpid
         */
        private String corpid;
    }
}
