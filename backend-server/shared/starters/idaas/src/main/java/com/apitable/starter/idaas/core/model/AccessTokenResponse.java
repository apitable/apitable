package com.apitable.starter.idaas.core.model;

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
public class AccessTokenResponse {

    /**
     * request token, use to request user information
     */
    @JsonProperty("access_token")
    private String accessToken;

    /**
     * token expire time, Unit: second
     */
    @JsonProperty("expires_in")
    private Integer expiresIn;

    /**
     * fixed to Bearer, this authentication mode is required for subsequent user information requests
     */
    @JsonProperty("token_type")
    private String tokenType;

    /**
     * token scope
     */
    @JsonProperty("scope")
    private String scope;

}
