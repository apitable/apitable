package com.vikadata.api.util;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;

import org.springframework.http.HttpHeaders;

/**
 * <p>
 * api helper
 * </p>
 *
 * @author Chambers
 */
public class ApiHelper {

    private static final String API_KEY_PREFIX = "usk";

    public static String createKey() {
        return API_KEY_PREFIX + RandomUtil.randomString(RandomUtil.BASE_CHAR_NUMBER + RandomUtil.BASE_CHAR.toUpperCase(), 20);
    }

    public static String getApiKey(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StrUtil.isBlank(bearerToken)) {
            return null;
        }
        String apiKey = StrUtil.removePrefix(bearerToken, "Bearer").trim();
        if (StrUtil.startWith(apiKey, API_KEY_PREFIX)) {
            return apiKey;
        }
        return null;
    }
}
