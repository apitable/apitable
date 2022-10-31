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
public class DingTalkDeptListParentByDeptResponse extends BaseResponse {

    private String requestId;

    private DeptListParentByDeptIdResponse result;

    @Setter
    @Getter
    @ToString
    public static class DeptListParentByDeptIdResponse {
        private List<Long> parentIdList;
    }
}
