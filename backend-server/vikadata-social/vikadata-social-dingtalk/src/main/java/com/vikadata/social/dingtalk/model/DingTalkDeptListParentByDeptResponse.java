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
public class DingTalkDeptListParentByDeptResponse extends BaseResponse {

    private String requestId;

    private DeptListParentByDeptIdResponse result;

    @Setter
    @Getter
    @ToString
    public static class DeptListParentByDeptIdResponse {
        /**
         * 父部门列表集合
         */
        private List<Long> parentIdList;
    }
}
