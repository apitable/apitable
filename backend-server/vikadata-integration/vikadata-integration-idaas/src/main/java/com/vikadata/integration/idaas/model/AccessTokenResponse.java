package com.vikadata.integration.idaas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取访问用户信息的 access_token
 * </p>
 * @author 刘斌华
 * @date 2022-05-24 16:58:02
 */
@Setter
@Getter
public class AccessTokenResponse {

    /**
     * 请求 token，用于请求用户信息
     */
    @JsonProperty("access_token")
    private String accessToken;

    /**
     * 表示 token 过期时间，单位：秒
     */
    @JsonProperty("expires_in")
    private Integer expiresIn;

    /**
     * 固定为 Bearer，后续请求用户信息时需要使用此验证方式
     */
    @JsonProperty("token_type")
    private String tokenType;

    /**
     * token 作用域
     */
    @JsonProperty("scope")
    private String scope;

}
