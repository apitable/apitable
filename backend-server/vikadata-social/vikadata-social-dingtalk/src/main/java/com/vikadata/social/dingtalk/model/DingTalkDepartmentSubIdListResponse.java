package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * department list id return
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentSubIdListResponse extends BaseResponse {

    private String requestId;

    private DeptListSubIdResponse result;

    @Setter
    @Getter
    @ToString
    public static class DeptListSubIdResponse {
        private List<Long> deptIdList;
    }
}
