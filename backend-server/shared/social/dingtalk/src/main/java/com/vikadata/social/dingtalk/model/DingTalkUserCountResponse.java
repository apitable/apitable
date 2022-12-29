package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Number of enterprise users
 */
@Setter
@Getter
@ToString
public class DingTalkUserCountResponse extends BaseResponse {
    private String requestId;

    private CountUserResponse result;

    @Setter
    @Getter
    @ToString
    public static class CountUserResponse {
        private Integer count;
    }
}
