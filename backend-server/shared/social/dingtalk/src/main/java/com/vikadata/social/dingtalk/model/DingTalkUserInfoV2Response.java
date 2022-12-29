package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User information v2 interface returns information
 */
@Setter
@Getter
@ToString
public class DingTalkUserInfoV2Response extends BaseResponse {

    private String requestId;

    private UserInfoV2 result;

}
