package com.apitable.starter.idaas.core.constant;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * Path constant
 * </p>
 *
 */
public class UrlConstant {

    private static final String IDAAS_AUTHORIZE_URL = "{authorizeEndpoint}?response_type=code&client_id={clientId}&redirect_uri={redirectUri}&scope=openid%20offline_access&state={state}";

    /**
     * Get the final IDaaS login authorization address
     *
     * @param authorizeEndpoint IDaaS login path
     * @param clientId application Client ID
     * @param redirectUri Callback address after successful login
     * @param state random character
     * @return final IDaaS login authorization address
     */
    public static String getAuthorizationUrl(String authorizeEndpoint,
            String clientId, String redirectUri, String state) {
        Dict variable = Dict.create()
                .set("authorizeEndpoint", authorizeEndpoint)
                .set("clientId", clientId)
                .set("redirectUri", redirectUri)
                .set("state", state);

        return StrUtil.format(IDAAS_AUTHORIZE_URL, variable);
    }

}
