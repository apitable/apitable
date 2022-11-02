package com.vikadata.api.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import cn.hutool.core.util.StrUtil;

import static com.vikadata.api.constants.DateFormatConstants.SLAVE_DATE_PATTERN;
import static com.vikadata.api.constants.PatternConstants.PURE_NUMBER;

/**
 * String util
 * @author Shawn Deng
 */
public class StringUtil {

    private static final Pattern pattern = Pattern.compile("\\$\\{(.*?)\\}");

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
     * Format string Use {key} in the string to represent placeholders
     *
     * @param template   string to match
     * @param param     parameter
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
        }
        catch (Exception e) {
            return null;
        }
        return targetStr;
    }

    /**
     * build path
     */
    public static String buildPath(String prefix) {
        String date = DateTimeFormatter.ofPattern(SLAVE_DATE_PATTERN).format(LocalDate.now());
        return StrUtil.join("/", prefix, date, cn.hutool.core.util.IdUtil.fastSimpleUUID());
    }
}
