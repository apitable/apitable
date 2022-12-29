package com.apitable.starter.idaas.core.api;

import java.nio.charset.StandardCharsets;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.text.CharSequenceUtil;

import com.apitable.starter.idaas.core.IdaasApiException;
import com.apitable.starter.idaas.core.IdaasTemplate;
import com.apitable.starter.idaas.core.model.AccessTokenRequest;
import com.apitable.starter.idaas.core.model.AccessTokenResponse;
import com.apitable.starter.idaas.core.model.UserInfoResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <p>
 * Login authorization API
 * </p>
 */
public class AuthApi {

    private final IdaasTemplate idaasTemplate;

    public AuthApi(IdaasTemplate idaasTemplate) {
        this.idaasTemplate = idaasTemplate;
    }

    /**
     * Get access user information's access_token
     *
     * @param tokenUrl access_token's path
     * @param clientId IDaaS application Client ID
     * @param clientSecret IDaaS application Client Secret
     * @param request request parameters
     * @return Access user information's access_token
     */
    public AccessTokenResponse accessToken(String tokenUrl, String clientId, String clientSecret, AccessTokenRequest request) throws IdaasApiException {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/x-www-form-urlencoded");
        httpHeaders.add("Authorization", "Basic " +
                Base64.encode(CharSequenceUtil.join(":", clientId, clientSecret), StandardCharsets.UTF_8));
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>(4);
        form.set("grant_type", request.getGrantType());
        form.set("code", request.getCode());
        form.set("redirect_uri", request.getRedirectUri());

        return idaasTemplate.postFromUrl(tokenUrl, httpHeaders, form, AccessTokenResponse.class);
    }

    /**
     * Get user information
     *
     * @param userInfoUrl Path to obtain user information
     * @param accessToken Access to user information_ token
     * @return user information
     */
    public UserInfoResponse userInfo(String userInfoUrl, String accessToken) throws IdaasApiException {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json");
        httpHeaders.add("Authorization", "Bearer " + accessToken);

        return idaasTemplate.getFromUrl(userInfoUrl, httpHeaders, UserInfoResponse.class);
    }

}
