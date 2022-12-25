/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.core.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.springframework.http.HttpHeaders.ORIGIN;

/**
 * <p>
 *  HttpServletRequest & HttpServletResponse shortcut actions
 * </p>
 */
public class HttpContextUtil {

    public static final String UNKNOWN = "unknown";

    public static final String X_FORWARDED_FOR = "X-Forwarded-For";

    public static final String X_FORWARDED_PROTO = "X-Forwarded-Proto";

    public static final String X_REAL_IP = "X-Real-IP";

    public static final String X_REAL_HOST = "X-Real-Host";

    public static final String PROXY_CLIENT_IP = "Proxy-Client-IP";

    public static final String WL_PROXY_CLIENT_IP = "WL-Proxy-Client-IP";

    public static final String HTTP_CLIENT_IP = "HTTP_CLIENT_IP";

    public static final String HTTP_X_FORWARDED_FOR = "HTTP_X_FORWARDED_FOR";

    public static final String LOCALHOST_IP = "127.0.0.1";

    public static final String LOCALHOST_IP_16 = "0:0:0:0:0:0:0:1";

    public static final int MAX_IP_LENGTH = 15;

    /**
     * get the current request's HttpServletRequest Object
     *
     * @return HttpServletRequest
     */
    public static HttpServletRequest getRequest() {
        return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
    }

    /**
     * get the current request's HttpServletResponse Object
     *
     * @return HttpServletResponse
     */
    public static HttpServletResponse getResponse() {
        return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getResponse();
    }

    /**
     * Whether there is a cookies session
     * @return true | false
     */
    public static boolean hasSession() {
        return getSession(false) != null;
    }

    public static boolean hasSession(HttpServletRequest request) {
        return request.getSession(false) != null;
    }

    /**
     * Returns the current HttpSession associated with this request or,
     * if there is no current session and create is true, returns a new session.
     *
     * @param create    true to create a new session for this request if necessary;
     *                  false to return null if there's no current session
     * @return HttpSession
     */
    public static HttpSession getSession(boolean create) {
        return getRequest().getSession(create);
    }

    public static String getParameter(String name) {
        return getRequest().getParameter(name);
    }

    /**
     * get the remote IP address
     *
     * @param request servlet's request
     * @return the request's IP address
     */
    public static String getRemoteAddr(HttpServletRequest request) {
        String ipAddress = request.getHeader(X_REAL_IP);
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader(X_FORWARDED_FOR);
        }
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader(PROXY_CLIENT_IP);
        }
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader(WL_PROXY_CLIENT_IP);
        }
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader(HTTP_CLIENT_IP);
        }
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader(HTTP_X_FORWARDED_FOR);
        }
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (StrUtil.isEmpty(ipAddress) || UNKNOWN.equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            if (LOCALHOST_IP.equals(ipAddress) || LOCALHOST_IP_16.equals(ipAddress)) {
                // get the IP address configured on the local PC by the NIC
                InetAddress inet;
                try {
                    inet = InetAddress.getLocalHost();
                }
                catch (UnknownHostException e) {
                    throw new IllegalStateException(String.format("get IP address, exception: %s", e.getMessage()), e);
                }
                assert inet != null;
                ipAddress = inet.getHostAddress();
            }
        }
        // In the case of multiple proxies, the first IP is the real IP of the client.
        //  Multiple IP addresses are separated by ','.
        //  "****.****.****.****".length() = 15
        if (ipAddress != null && ipAddress.length() > MAX_IP_LENGTH) {
            if (ipAddress.indexOf(Symbol.COMMA) > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(Symbol.COMMA));
            }
        }
        return ipAddress;
    }

    /**
     * get the remote domain name
     *
     * @param request servlet's request
     * @return the request's domain name
     */
    public static String getRemoteHost(HttpServletRequest request) {
        String requestHost;

        String realHost;
        if (StrUtil.isNotBlank(realHost = request.getHeader(X_REAL_HOST))) {
            requestHost = realHost;
        }
        else if (StrUtil.isNotBlank(realHost = request.getHeader(ORIGIN))) {
            try {
                requestHost = new URL(realHost).getHost();
            }
            catch (MalformedURLException ignored) {
                requestHost = "";
            }
        }
        else {
            requestHost = request.getServerName();
        }

        return requestHost;
    }

    /**
     * get scheme
     *
     * @param request servlet request
     * @return request's scheme
     */
    public static String getScheme(HttpServletRequest request) {
        String scheme = request.getHeader(X_FORWARDED_PROTO);
        // if scheme is null, get ServletRequest's scheme
        if (StrUtil.isEmpty(scheme)) {
            scheme = request.getScheme();
        }
        return scheme;
    }

    public static final class Symbol {
        private Symbol() {
        }

        /**
         * The constant COMMA.
         */
        public static final String COMMA = ",";

        public static final String SPOT = ".";

        /**
         * The constant UNDER_LINE.
         */
        public final static String UNDER_LINE = "_";

        /**
         * The constant PER_CENT.
         */
        public final static String PER_CENT = "%";

        /**
         * The constant AT.
         */
        public final static String AT = "@";

        /**
         * The constant PIPE.
         */
        public final static String PIPE = "||";

        public final static String SHORT_LINE = "-";

        public final static String SPACE = " ";

        public static final String SLASH = "/";

        public static final String MH = ":";

    }

    /**
     * response
     *
     * @param response    HttpServletResponse
     * @param contentType content-type
     * @param status      http status code
     * @param value       response body
     * @throws IOException IOException
     */
    public static void makeResponse(HttpServletResponse response, String contentType,
            int status, Object value) throws IOException {
        response.setContentType(contentType);
        response.setStatus(status);
        response.getOutputStream().write(JSONUtil.toJsonStr(value).getBytes());
    }

    public static String getBody(HttpServletRequest request) throws IOException {
        BufferedReader reader = request.getReader();
        // get http body content
        StringBuilder buffer = new StringBuilder();
        String string;
        while ((string = reader.readLine()) != null) {
            buffer.append(string);
        }
        reader.close();
        return buffer.toString();
    }
}
