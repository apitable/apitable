package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 企业用户人数
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
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
