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

package com.apitable.shared.util;

import static com.apitable.shared.constants.DateFormatConstants.SLAVE_DATE_PATTERN;
import static com.apitable.shared.constants.PatternConstants.PURE_NUMBER;

import cn.hutool.core.util.StrUtil;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * String util.
 *
 * @author Shawn Deng
 */
public class StringUtil {

    private static final Pattern pattern = Pattern.compile("\\$\\{(.*?)\\}");

    /**
     * trim slash.
     *
     * @param url url
     * @return String
     */
    public static String trimSlash(String url) {
        if (StrUtil.isNotBlank(url)) {
            if (!url.startsWith("http")) {
                // Non-http domain name, representing the resource bucket prefix
                if (url.startsWith(StrUtil.SLASH)) {
                    // prefix has find if there are more than one
                    int startPos = 0;
                    int endPos = url.length();
                    while (startPos >= 0 && url.charAt(startPos) == '/') {
                        startPos++;
                    }
                    url = url.substring(startPos, endPos);
                }
                url = StrUtil.SLASH + url;
            }
            if (url.endsWith(StrUtil.SLASH)) {
                // remove more slash
                int endPos = url.length() - 1;
                while (endPos >= 0 && url.charAt(endPos) == '/') {
                    endPos--;
                }
                url = url.substring(0, endPos + 1);
            }
            url += StrUtil.SLASH;
        }
        return url;
    }

    public static boolean isPureNumber(String str) {
        return Pattern.matches(PURE_NUMBER, str);
    }

    /**
     * Format string Use {key} in the string to represent placeholders.
     *
     * @param template string to match
     * @param param    parameter
     * @return String
     */
    public static String format(String template, Map<String, Object> param) {
        String targetStr = template;
        if (param == null) {
            return targetStr;
        }
        try {
            Matcher matcher = pattern.matcher(targetStr);
            while (matcher.find()) {
                String key = matcher.group();
                String keyClone = key.substring(2, key.length() - 1).trim();
                Object value = param.get(keyClone);
                if (value != null) {
                    targetStr = targetStr.replace(key, value.toString());
                }
            }
        } catch (Exception e) {
            return null;
        }
        return targetStr;
    }

    /**
     * build path.
     */
    public static String buildPath(String prefix) {
        String date = DateTimeFormatter.ofPattern(SLAVE_DATE_PATTERN).format(LocalDate.now());
        return StrUtil.join("/", prefix, date, cn.hutool.core.util.IdUtil.fastSimpleUUID());
    }
}
