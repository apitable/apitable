package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取指定部门的所有父部门列表
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
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
         * 该部门的所有父部门ID列表
         */
        private List<Long> parentIdList;
    }
}
