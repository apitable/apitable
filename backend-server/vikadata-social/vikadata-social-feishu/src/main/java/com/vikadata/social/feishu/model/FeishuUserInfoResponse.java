package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * 飞书用户信息 响应
 *
 * @author Shawn Deng
 * @date 2020-11-26 15:57:56
 */
@Setter
@Getter
public class FeishuUserInfoResponse extends BaseResponse {

    private FeishuUserAuthInfo data;
}
