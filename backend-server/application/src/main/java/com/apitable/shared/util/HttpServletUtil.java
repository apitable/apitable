package com.apitable.shared.util;

import java.util.Enumeration;
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
    public static Map<String, String> getParameterAsMap(HttpServletRequest request,
                                                        boolean fetchCookies) {
        Map<String, String> queryMap = new HashMap<>();
        if (fetchCookies) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    queryMap.put(cookie.getName(), DecoderUtil.decode(cookie.getValue()));
                }
            }
        }
        return queryMap;
    }
}
