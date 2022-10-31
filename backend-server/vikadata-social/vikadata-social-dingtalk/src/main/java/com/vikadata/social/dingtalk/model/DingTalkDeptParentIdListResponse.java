package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get a list of all parent departments of a specified department
 */
@Setter
@Getter
@ToString
public class DingTalkDeptParentIdListResponse extends BaseResponse {

    private String requestId;

    private DingTalkDeptParentIdList result;

    @Setter
    @Getter
    @ToString
    public static class DingTalkDeptParentIdList {
        /**
         * List of all parent department IDs for this department
         */
        private List<Long> parentIdList;
    }
}
