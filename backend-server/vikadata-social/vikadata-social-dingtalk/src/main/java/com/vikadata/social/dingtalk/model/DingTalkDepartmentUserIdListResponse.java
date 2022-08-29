package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 用户ID列表返回
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
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
