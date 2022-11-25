package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Obtain the suite access token for third-party enterprise applications
 */
@Setter
@Getter
@ToString
public class DingTalkSuiteAccessTokenResponse extends BaseResponse {

    /**
     * Credentials for third-party enterprise applications
     */
    private String suiteAccessToken;

    /**
     * Credential expiration time for third-party enterprise applications, in seconds
     */
    private int expiresIn;
}
