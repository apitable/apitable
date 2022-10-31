package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * user basic information
 */
@Setter
@Getter
@ToString
public class DingTalkUserInfoRequest {

    private String tmpAuthCode;
}
