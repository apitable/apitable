package com.vikadata.api.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.EscapeUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.useragent.Browser;
import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;

import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.core.util.HttpContextUtil;

import static com.vikadata.api.constants.ParamsConstants.VIKA_DESKTOP;

/**
 * 信息通用处理工具
 *
 * @author Chambers
 * @since 2019/10/21
 */
public class InformationUtil {

    /**
     * 支持的脱敏类型枚举
     */
    public enum InformationType {
        // 密钥
        SECRET_KEY,
        // 手机号
        MIDDLE
    }

    /**
     * 关键词高亮处理
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

    /**
     * 获取请求来源信息
     */
    public static ClientOriginInfo getClientOriginInfo(HttpServletRequest request, boolean ip, boolean cookies) {
        ClientOriginInfo originInfo = new ClientOriginInfo();
        originInfo.setUserAgent(request.getHeader(ParamsConstants.USER_AGENT));
        if (ip) {
            originInfo.setIp(request.getRemoteAddr());
        }
        if (cookies) {
            originInfo.setCookies(request.getCookies());
        }
        return originInfo;
    }

    /**
     * 获取请求来源信息
     */
    public static ClientOriginInfo getClientOriginInfo(boolean ip, boolean cookies) {
        HttpServletRequest req = HttpContextUtil.getRequest();
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

    /**
     * 获取 Vika 客户端信息
     */
    public static String getVikaDesktop(String userAgent, boolean browser) {
        if (StrUtil.isBlank(userAgent)) {
            return null;
        }
        UserAgent ua = UserAgentUtil.parse(userAgent);
        // 优先返回客户端信息
        if (StrUtil.containsIgnoreCase(userAgent, VIKA_DESKTOP)) {
            int start = StrUtil.indexOfIgnoreCase(userAgent, VIKA_DESKTOP);
            return StrUtil.subBefore(userAgent.substring(start), ' ', false) +
                    StrUtil.format(" ({})", ua.getPlatform());
        }
        // 否则返回平台类型
        StringBuilder platform = new StringBuilder(ua.getPlatform().toString());
        if (browser && !ua.getBrowser().equals(Browser.Unknown)) {
            platform.append(" ").append(ua.getBrowser().toString());
        }
        return platform.toString();
    }

    /**
     * 脱敏，使用默认的脱敏策略
     *
     * @param str              字符串
     * @param informationType  脱敏类型;可以脱敏：密钥、手机号
     * @return 脱敏之后的字符串
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
     * 【手机号】前三位，后三位，其他隐藏，比如135*****210
     *
     * @param value 手机号
     * @return 脱敏后的手机号
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
     * 【密钥】密钥全部字符都用*代替，比如：******
     *
     * @param secretKey 密钥
     * @return 脱敏后的密钥
     */
    public static String secretKey(String secretKey) {
        if (StrUtil.isBlank(secretKey)) {
            return StrUtil.EMPTY;
        }
        return StrUtil.repeat('*', secretKey.length());
    }
}
