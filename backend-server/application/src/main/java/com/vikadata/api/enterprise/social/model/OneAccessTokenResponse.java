package com.vikadata.api.enterprise.social.model;

import lombok.Data;

/**
 * OneAccess token response
 */
@Data
public class OneAccessTokenResponse {

    private String error_code;

    private String msg;

    private String access_token;

    private int expires_in;

    private String refresh_token;

    private String uid;
}
