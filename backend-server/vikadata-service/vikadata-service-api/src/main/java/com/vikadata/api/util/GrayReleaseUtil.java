package com.vikadata.api.util;

import java.util.Arrays;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.vikadata.api.config.properties.ConstProperties;

import static com.vikadata.api.constants.ParamsConstants.INTERNAL_REQUEST;

public class GrayReleaseUtil {

    private static final String NEW_BACKEND_FEATURE_NAME = "vika_feature_new_backend";

    private static final String FEATURE_VALUE_ON = "on";

    private static final int COOKIE_EXPIRY_DURATION = 30 * 24 * 3600;

    public static void setCookieBy(boolean spaceInWhitelist, HttpServletResponse response) {
        if (spaceInWhitelist) {
            setTheCookie(response);
        }
        else {
            unsetTheCookie(response);
        }
    }

    private static void setTheCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(NEW_BACKEND_FEATURE_NAME, FEATURE_VALUE_ON);
        cookie.setMaxAge(COOKIE_EXPIRY_DURATION);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    private static void unsetTheCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(NEW_BACKEND_FEATURE_NAME, "");
        cookie.setMaxAge(1);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public static boolean isSpaceInWhitelist(String spaceId, ConstProperties constProperties) {
        String spaceIdsStr = constProperties.getNewBackendSpaceIds().trim();

        return Arrays.asList(spaceIdsStr.split(",")).contains(spaceId);
    }

    public static boolean isGrayVersion(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (null == cookies) {
            return false;
        }

        return Arrays.stream(cookies).anyMatch((cookie) ->
                NEW_BACKEND_FEATURE_NAME.equals(cookie.getName()) && FEATURE_VALUE_ON.equals(cookie.getValue())
        );
    }

    public static boolean isInternalRequestHeader(HttpServletRequest request) {
        String header = request.getHeader(INTERNAL_REQUEST);
        return "yes".equals(header);
    }

}
