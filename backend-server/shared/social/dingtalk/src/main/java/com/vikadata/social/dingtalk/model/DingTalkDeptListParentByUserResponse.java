package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get a list of all parent departments of a specified user
 */
@Setter
@Getter
@ToString
public class DingTalkDeptListParentByUserResponse extends BaseResponse {

    private String requestId;

    private DingTalkUserParentDeptList result;

    @Setter
    @Getter
    @ToString
    public static class DingTalkUserParentDeptList {
        private List<DeptParentResponse> parentList;
    }

    @Setter
    @Getter
    @ToString
    public static class DeptParentResponse {
        /**
         * Parent Department List
         */
        private List<Long> parentDeptIdList;
    }
}
