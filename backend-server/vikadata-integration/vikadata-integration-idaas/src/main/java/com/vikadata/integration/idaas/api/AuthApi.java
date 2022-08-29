package com.vikadata.integration.idaas.api;

import java.nio.charset.StandardCharsets;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.text.CharSequenceUtil;

import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.model.AccessTokenRequest;
import com.vikadata.integration.idaas.model.AccessTokenResponse;
import com.vikadata.integration.idaas.model.UserInfoResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <p>
 * 登录授权 API
 * </p>
 * @author 刘斌华
 * @date 2022-05-24 16:17:56
 */
public class AuthApi {

    private final IdaasTemplate idaasTemplate;

    public AuthApi(IdaasTemplate idaasTemplate) {
        this.idaasTemplate = idaasTemplate;
    }

    /**
     * 获取访问用户信息的 access_token
     *
     * @param tokenUrl 获取 access_token 的路径
     * @param clientId IDaaS 应用的 Client ID
     * @param clientSecret IDaaS 应用的 Client Secret
     * @param request 请求参数
     * @return 访问用户信息的 access_token
     * @author 刘斌华
     * @date 2022-05-24 17:20:38
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
     * 获取用户信息
     *
     * @param userInfoUrl 获取用户信息的路径
     * @param accessToken 访问用户信息的 access_token
     * @return 用户信息
     * @author 刘斌华
     * @date 2022-05-24 17:24:21
     */
    public UserInfoResponse userInfo(String userInfoUrl, String accessToken) throws IdaasApiException {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json");
        httpHeaders.add("Authorization", "Bearer " + accessToken);

        return idaasTemplate.getFromUrl(userInfoUrl, httpHeaders, UserInfoResponse.class);
    }

}
