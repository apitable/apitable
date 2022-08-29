package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 获取 app_access_token
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/21 16:31
 */
@Setter
@Getter
@ToString
public class FeishuAppAccessTokenInternalRequest {

    private String appId;

    private String appSecret;
}
