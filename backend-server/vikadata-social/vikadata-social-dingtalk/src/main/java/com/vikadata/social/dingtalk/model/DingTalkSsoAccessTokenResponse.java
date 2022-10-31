package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * app_access_token response
 */
@Setter
@Getter
@ToString
public class DingTalkSsoAccessTokenResponse extends BaseResponse {
    /**
     * generated access token
     */
    private String accessToken;
}
