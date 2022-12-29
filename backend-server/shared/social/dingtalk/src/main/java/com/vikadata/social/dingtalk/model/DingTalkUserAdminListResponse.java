package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * get admin list --response
 */
@Setter
@Getter
@ToString
public class DingTalkUserAdminListResponse extends BaseResponse {
    private String requestId;

    private List<DingTalkAdminList> result;

    @Setter
    @Getter
    @ToString
    public static class DingTalkAdminList {
        /**
         * The userid of the administrator.
         */
        private String userId;

        /**
         * Admin role:
         * 1: Main administrator
         *2: Sub-Administrator
         */
        private Integer sysLevel;

    }
}
