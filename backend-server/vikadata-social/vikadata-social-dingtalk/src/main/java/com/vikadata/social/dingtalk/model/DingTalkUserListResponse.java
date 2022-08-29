package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取部门用户详情返回信息
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkUserListResponse extends BaseResponse {

    private String requestId;

    private UserPageResult result;

    @Setter
    @Getter
    @ToString
    public static class UserPageResult {
        /**
         * 是否还有更多的数据。
         */
        private Boolean hasMore;

        /**
         * 下一次分页的游标，如果has_more为false，表示没有更多的分页数据。
         */
        private Long nextCursor;

        /**
         * 用户信息列表。
         */
        private List<DingTalkUserDetail> list;
    }
}
