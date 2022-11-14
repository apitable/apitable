package com.vikadata.api.shared.util.information;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.EscapeUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.useragent.Browser;
import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;

import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.core.util.HttpContextUtil;

import static com.vikadata.api.shared.constants.ParamsConstants.VIKA_DESKTOP;

/**
 * general information processing tool
 *
 * @author Chambers
 */
public class InformationUtil {

    /**
     * enumeration of supported desensitization types
     */
    public enum InformationType {
        SECRET_KEY,
        MIDDLE
    }

    /**
     * keyword highlighting
     */
    public static String keywordHighlight(String originName, String keyword, String className) {
        if (StrUtil.isNotBlank(keyword)) {
            Pattern pattern = Pattern.compile(Pattern.quote(EscapeUtil.escapeHtml4(keyword)), Pattern.CASE_INSENSITIVE);
            Matcher mc = pattern.matcher(EscapeUtil.escapeHtml4(originName));
            StringBuffer sb = new StringBuffer();
            while (mc.find()) {
                mc.appendReplacement(sb, StrUtil.format("<span class = \"{}\">{}</span>", className, mc.group()));
            }
            mc.appendTail(sb);
            return sb.toString();
        }
        else {
            return originName;
        }
    }

    public static ClientOriginInfo getClientOriginInfo(HttpServletRequest request, boolean ip, boolean cookies) {
        return getClientOriginInfo(ip, cookies, request);
    }

    public static ClientOriginInfo getClientOriginInfo(boolean ip, boolean cookies) {
        HttpServletRequest req = HttpContextUtil.getRequest();
        return getClientOriginInfo(ip, cookies, req);
    }

    private static ClientOriginInfo getClientOriginInfo(boolean ip, boolean cookies, HttpServletRequest req) {
        ClientOriginInfo originInfo = new ClientOriginInfo();
        originInfo.setUserAgent(req.getHeader(ParamsConstants.USER_AGENT));
        if (ip) {
            originInfo.setIp(req.getRemoteAddr());
        }
        if (cookies) {
            originInfo.setCookies(req.getCookies());
        }
        return originInfo;
    }

    public static String getVikaDesktop(String userAgent, boolean browser) {
        if (StrUtil.isBlank(userAgent)) {
            return null;
        }
        UserAgent ua = UserAgentUtil.parse(userAgent);
        // return client information first
        if (StrUtil.containsIgnoreCase(userAgent, VIKA_DESKTOP)) {
            int start = StrUtil.indexOfIgnoreCase(userAgent, VIKA_DESKTOP);
            return StrUtil.subBefore(userAgent.substring(start), ' ', false) +
                    StrUtil.format(" ({})", ua.getPlatform());
        }
        // otherwise return the platform type
        StringBuilder platform = new StringBuilder(ua.getPlatform().toString());
        if (browser && !ua.getBrowser().equals(Browser.Unknown)) {
            platform.append(" ").append(ua.getBrowser().toString());
        }
        return platform.toString();
    }

    /**
     * Desensitization, using the default desensitization strategy
     *
     * @param str              strings
     * @param informationType  Desensitization type; can be desensitized: key, mobile phone number
     * @return string after desensitization
     */
    public static String desensitized(String str, InformationUtil.InformationType informationType) {
        if (StrUtil.isBlank(str)) {
            return StrUtil.EMPTY;
        }
        switch (informationType) {
            case SECRET_KEY:
                str = InformationUtil.secretKey(str);
                break;
            case MIDDLE:
                str = InformationUtil.hideMiddle(str);
                break;
            default:
        }
        return str;
    }

    /**
     * [Mobile phone number] The first three, the last three, the others are hidden, such as 135210
     *
     * @param value phone number
     * @return cell phone number after desensitization
     */
    public static String hideMiddle(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        int length = value.length();
        if (length == 1) {
            return value;
        }
        int half = length / 2;
        int remainder = length % 2 != 0 ? 1 : 0;
        int quarter = half / 2;
        return StrUtil.hide(value, half - quarter, half + quarter + remainder);
    }

    /**
     * [Key] Replace all characters of the key with
     *
     * @param secretKey key
     * @return desensitized key
     */
    public static String secretKey(String secretKey) {
        if (StrUtil.isBlank(secretKey)) {
            return StrUtil.EMPTY;
        }
        return StrUtil.repeat('*', secretKey.length());
    }
}
