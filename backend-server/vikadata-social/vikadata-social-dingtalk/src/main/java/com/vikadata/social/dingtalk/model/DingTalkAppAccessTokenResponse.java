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
public class DingTalkAppAccessTokenResponse extends BaseResponse {
    /**
     * Generated access token
     */
    private String accessToken;

    /**
     * The expiration time of the access token, in seconds
     */
    private int expiresIn;
}
