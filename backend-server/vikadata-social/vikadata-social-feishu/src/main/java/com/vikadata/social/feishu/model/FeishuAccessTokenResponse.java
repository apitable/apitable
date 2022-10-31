package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Get logged in user identity Response
 */
@Setter
@Getter
public class FeishuAccessTokenResponse extends BaseResponse {

    private FeishuAccessToken data;
}
