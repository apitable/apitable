package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取指定用户的所有父部门列表
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
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
        /**
         * 父部门列表集合
         */
        private List<DeptParentResponse> parentList;
    }

    @Setter
    @Getter
    @ToString
    public static class DeptParentResponse {
        /**
         * 父部门列表
         */
        private List<Long> parentDeptIdList;
    }
}
