package com.vikadata.integration.idaas.constant;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * 路径常量
 * </p>
 * @author 刘斌华
 * @date 2022-05-24 14:31:56
 */
public class UrlConstant {

    private static final String IDAAS_AUTHORIZE_URL = "{authorizeEndpoint}?response_type=code&client_id={clientId}&redirect_uri={redirectUri}&scope=openid%20offline_access&state={state}";

    /**
     * 获取最终的 IDaaS 登录授权地址
     *
     * @param authorizeEndpoint IDaaS 登录路径
     * @param clientId 应用的 Client ID
     * @param redirectUri 登录成功后的回调地址
     * @param state 随机字符
     * @return 最终的 IDaaS 登录授权地址
     * @author 刘斌华
     * @date 2022-05-24 14:38:40
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
