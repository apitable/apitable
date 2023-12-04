package com.apitable.shared.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * http servlet util.
 *
 * @author Shawn Deng
 */
public class HttpServletUtil {

    /**
     * get cookies as Map.
     *
     * @param request servlet request
     * @return Map
     */
    public static Map<String, String> getParameterAsMap(HttpServletRequest request,
                                                        boolean fetchCookies) {
        Map<String, String> parameters = new HashMap<>();
        Map<String, String[]> parameterMap = request.getParameterMap();
        for (String key : parameterMap.keySet()) {
            String[] values = parameterMap.get(key);
            if (values.length > 0) {
                parameters.put(key, values[0]);
            }
        }
        if (fetchCookies) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    parameters.put(cookie.getName(), DecoderUtil.decode(cookie.getValue()));
                }
            }
        }
        return parameters;
    }
}
