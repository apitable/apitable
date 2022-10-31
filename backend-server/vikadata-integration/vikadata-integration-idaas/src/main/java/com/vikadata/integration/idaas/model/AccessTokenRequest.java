package com.vikadata.integration.idaas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Access to access user information_ token
 * </p>
 *
 */
@Setter
@Getter
public class AccessTokenRequest {

    /**
     * way of authorization
     */
    @JsonProperty("grant_type")
    private String grantType = "authorization_code";

    /**
     * auth code
     */
    @JsonProperty("code")
    private String code;

    /**
     * token url
     */
    @JsonProperty("redirect_uri")
    private String redirectUri;

}
