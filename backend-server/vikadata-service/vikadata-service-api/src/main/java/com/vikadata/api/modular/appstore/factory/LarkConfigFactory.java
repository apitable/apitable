package com.vikadata.api.modular.appstore.factory;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import cn.hutool.http.HttpUtil;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.modular.social.constants.LarkConstants;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

/**
 * 飞书应用配置工厂
 * @author Shawn Deng
 * @date 2022-01-18 01:05:43
 */
public class LarkConfigFactory {

    private static final String baseUrl = "https://open.feishu.cn/open-apis/authen/v1/index";

    public static String createRedirectUri(String appInstanceId) {
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        return constProperties.getServerDomain() + LarkConstants.formatInternalLoginUrl(appInstanceId);
    }

    public static String createAuthUrl(String appId, String redirectUri) {
        Map<String, Object> queryMap = new HashMap<>(2);
        queryMap.put("app_id", appId);
        queryMap.put("redirect_uri", redirectUri);
        return HttpUtil.urlWithForm(baseUrl, queryMap, StandardCharsets.UTF_8, false);
    }

    public static String createEventUri(String appInstanceId) {
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        return constProperties.getServerDomain() + LarkConstants.formatInternalEventUrl(appInstanceId);
    }
}
