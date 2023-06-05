package com.apitable.shared.util;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

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
    public static Map<String, String> getCookiesAsMap(HttpServletRequest request) {
        Map<String, String> cookieMap = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookieMap.put(cookie.getName(), DecoderUtil.decode(cookie.getValue()));
            }
        }
        return cookieMap;
    }
}
