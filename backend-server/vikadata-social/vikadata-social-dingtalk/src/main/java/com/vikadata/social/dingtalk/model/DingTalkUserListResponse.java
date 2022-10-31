package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get department user details and return information
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
         * Is there any more data.
         */
        private Boolean hasMore;

        /**
         * The cursor for the next paging, if has more is false, it means there is no more paging data.
         */
        private Long nextCursor;

        /**
         * User information list.
         */
        private List<DingTalkUserDetail> list;
    }
}
