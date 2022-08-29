package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 获取第三方企业应用的suite_access_token
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/15 7:48 下午
 */
@Setter
@Getter
@ToString
public class DingTalkSuiteAccessTokenResponse extends BaseResponse {

    /**
     * 第三方企业应用的凭证
     */
    private String suiteAccessToken;

    /**
     * 第三方企业应用的凭证过期时间，单位秒
     */
    private int expiresIn;
}
