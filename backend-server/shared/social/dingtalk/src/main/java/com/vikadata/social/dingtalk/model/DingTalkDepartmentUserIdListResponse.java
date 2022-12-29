package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User ID list returned
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentUserIdListResponse extends BaseResponse {

    private String requestId;

    private ListUserByDeptResponse result;

    @Setter
    @Getter
    @ToString
    public static class ListUserByDeptResponse {
        private List<String> useridList;
    }
}
