package com.vikadata.api.helper;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.StrUtil;

import com.vikadata.api.util.DeveloperUtil;

import org.springframework.http.HttpHeaders;

/**
 * <p>
 * 开发者API帮助类
 * </p>
 *
 * @author Chambers
 * @date 2021/11/15
 */
public class ApiHelper {

    public static String getApiKey(HttpServletRequest request) {
        // 解析apiKey
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StrUtil.isBlank(bearerToken)) {
            return null;
        }
        String apiKey = StrUtil.removePrefix(bearerToken, "Bearer").trim();
        if (StrUtil.startWith(apiKey, DeveloperUtil.API_KEY_PREFIX)) {
            return apiKey;
        }
        return null;
    }
}
