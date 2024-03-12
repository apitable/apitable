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

package com.apitable.shared.util.information;

import cn.hutool.core.util.EscapeUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.shared.constants.ParamsConstants;
import jakarta.servlet.http.HttpServletRequest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * general information processing tool.
 *
 * @author Chambers
 */
public class InformationUtil {

    /**
     * enumeration of supported desensitization types.
     */
    public enum InformationType {
        SECRET_KEY,
        MIDDLE
    }

    /**
     * keyword highlighting.
     */
    public static String keywordHighlight(String originName, String keyword, String className) {
        if (StrUtil.isNotBlank(keyword)) {
            Pattern pattern = Pattern.compile(Pattern.quote(EscapeUtil.escapeHtml4(keyword)),
                Pattern.CASE_INSENSITIVE);
            Matcher mc = pattern.matcher(EscapeUtil.escapeHtml4(originName));
            StringBuffer sb = new StringBuffer();
            while (mc.find()) {
                mc.appendReplacement(sb,
                    StrUtil.format("<span class = \"{}\">{}</span>", className, mc.group()));
            }
            mc.appendTail(sb);
            return sb.toString();
        } else {
            return originName;
        }
    }

    public static ClientOriginInfo getClientOriginInfoInCurrentHttpContext(boolean fetchIp,
                                                                           boolean fetchCookies) {
        HttpServletRequest req = HttpContextUtil.getRequest();
        return getClientOriginInfo(req, fetchIp, fetchCookies);
    }

    /**
     * get client origin info from request.
     *
     * @param req          servlet request
     * @param fetchIp      whether fetch ip
     * @param fetchCookies whether fetch cookies
     * @return ClientOriginInfo
     */
    public static ClientOriginInfo getClientOriginInfo(HttpServletRequest req, boolean fetchIp,
                                                       boolean fetchCookies) {
        ClientOriginInfo originInfo = new ClientOriginInfo();
        originInfo.setUserAgent(req.getHeader(ParamsConstants.USER_AGENT));
        if (fetchIp) {
            originInfo.setIp(req.getRemoteAddr());
        }
        if (fetchCookies) {
            originInfo.setCookies(req.getCookies());
        }
        return originInfo;
    }


    /**
     * Desensitization, using the default desensitization strategy.
     *
     * @param str             strings
     * @param informationType Desensitization type; can be desensitized: key, mobile phone number
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
     * [Mobile phone number] The first three, the last three, the others are hidden, such as 135210.
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
     * [Key] Replace all characters of the key with.
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
