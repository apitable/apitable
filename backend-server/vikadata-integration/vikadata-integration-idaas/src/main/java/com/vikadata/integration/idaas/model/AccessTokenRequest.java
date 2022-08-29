package com.vikadata.integration.idaas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取访问用户信息的 access_token
 * </p>
 * @author 刘斌华
 * @date 2022-06-07 20:03:14
 */
@Setter
@Getter
public class AccessTokenRequest {

    /**
     * 授权方式
     */
    @JsonProperty("grant_type")
    private String grantType = "authorization_code";

    /**
     * auth code
     */
    @JsonProperty("code")
    private String code;

    /**
     * 回调地址
     */
    @JsonProperty("redirect_uri")
    private String redirectUri;

}
