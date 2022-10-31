package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Feishu User Information Response
 */
@Setter
@Getter
public class FeishuUserInfoResponse extends BaseResponse {

    private FeishuUserAuthInfo data;
}
