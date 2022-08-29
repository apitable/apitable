package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门列表ID返回
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
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
