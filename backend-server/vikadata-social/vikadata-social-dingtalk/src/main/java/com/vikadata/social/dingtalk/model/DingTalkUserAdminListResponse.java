package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 获取管理员列表--response
 * </p>
 * @author zoe zheng
 * @date 2021/5/14 3:20 下午
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
         * 管理员的userid。
         */
        private String userId;

        /**
         * 管理员角色：
         * 1：主管理员
         * 2：子管理员
         */
        private Integer sysLevel;

    }
}
