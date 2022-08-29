package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * 获取登录用户身份 响应
 *
 * @author Shawn Deng
 * @date 2020-11-26 10:16:06
 */
@Setter
@Getter
public class FeishuAccessTokenResponse extends BaseResponse {

    private FeishuAccessToken data;
}
