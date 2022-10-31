package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User Info
 */
@Setter
@Getter
@ToString
public class DingTalkUserDetailResponse extends BaseResponse {
    private String requestId;

    private DingTalkUserDetail result;
}
