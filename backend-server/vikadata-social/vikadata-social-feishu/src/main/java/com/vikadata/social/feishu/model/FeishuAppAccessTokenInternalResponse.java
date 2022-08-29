package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
* <p>
*
* </p>
* @author Shawn Deng
* @date 2020/11/21 16:30
*/
@Setter
@Getter
@ToString
public class FeishuAppAccessTokenInternalResponse extends BaseResponse {

    private String appAccessToken;

    private int expire;
}
