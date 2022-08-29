package com.vikadata.core.util;

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
 * 快捷操作HttpServletRequest,HttpServletResponse相关内容
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/16 16:03
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
     * 获取当前请求的HttpServletRequest
     *
     * @return HttpServletRequest
     */
    public static HttpServletRequest getRequest() {
        return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
    }

    /**
     * 获取当前请求的HttpServletResponse
     *
     * @return HttpServletResponse
     */
    public static HttpServletResponse getResponse() {
        return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getResponse();
    }

    /**
     * 是否有 cookies 会话
     * @return true | false
     */
    public static boolean hasSession() {
        return getSession(false) != null;
    }

    public static boolean hasSession(HttpServletRequest request) {
        return request.getSession(false) != null;
    }

    /**
     * 获取当前HttpSession，create决定是否自动创建会话
     *
     * @param create 不存在时是否创建新会话
     * @return HttpSession
     */
    public static HttpSession getSession(boolean create) {
        return getRequest().getSession(create);
    }

    public static String getParameter(String name) {
        return getRequest().getParameter(name);
    }

    /**
     * 获取远程IP地址
     *
     * @param request servlet请求
     * @return 请求IP地址
     * @author Shawn Deng
     * @date 2019/11/12 17:51
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
                //根据网卡取本机配置的IP
                InetAddress inet;
                try {
                    inet = InetAddress.getLocalHost();
                }
                catch (UnknownHostException e) {
                    throw new IllegalStateException(String.format("获取IP地址, 出现异常: %s", e.getMessage()), e);
                }
                assert inet != null;
                ipAddress = inet.getHostAddress();
            }
        }
        // 对于通过多个代理的情况, 第一个IP为客户端真实IP,多个IP按照','分割 //"***.***.***.***".length() = 15
        if (ipAddress != null && ipAddress.length() > MAX_IP_LENGTH) {
            if (ipAddress.indexOf(Symbol.COMMA) > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(Symbol.COMMA));
            }
        }
        return ipAddress;
    }

    /**
     * 获取远程域名
     *
     * @param request servlet请求
     * @return 请求域名
     * @author Pengap
     * @date 2021/8/25 20:55:33
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
     * 获取Scheme
     *
     * @param request servlet请求
     * @return 请求Scheme
     * @author Pengap
     * @date 2022/6/16 17:20:38
     */
    public static String getScheme(HttpServletRequest request) {
        String scheme = request.getHeader(X_FORWARDED_PROTO);
        // 为空获取ServletRequest的
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
     * 设置响应
     *
     * @param response    HttpServletResponse
     * @param contentType content-type
     * @param status      http状态码
     * @param value       响应内容
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
        // 获得 http body 内容
        StringBuilder buffer = new StringBuilder();
        String string;
        while ((string = reader.readLine()) != null) {
            buffer.append(string);
        }
        reader.close();
        return buffer.toString();
    }
}
