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
public class DingTalkUserInfoResponse extends BaseResponse {
    private UserInfo userInfo;

}
