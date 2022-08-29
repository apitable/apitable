package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * app_access_token response
 * </p>
 * @author zoe zheng
 * @date 2021/4/6 6:49 下午
 */
@Setter
@Getter
@ToString
public class DingTalkAppAccessTokenResponse extends BaseResponse {
    /**
     * 生成的access_token
     */
    private String accessToken;

    /**
     * access_token的过期时间，单位秒
     */
    private int expiresIn;
}
