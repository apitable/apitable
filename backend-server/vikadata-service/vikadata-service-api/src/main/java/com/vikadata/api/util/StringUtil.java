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
 * 字符串工具类
 * @author Shawn Deng
 * @date 2021-03-25 12:38:00
 */
public class StringUtil {

    private static final Pattern pattern = Pattern.compile("\\$\\{(.*?)\\}");

    public static String trimSlash(String url) {
        if (StrUtil.isNotBlank(url)) {
            if (!url.startsWith("http")) {
                // 非http域名，代表资源存储桶前缀
                if (url.startsWith(StrUtil.SLASH)) {
                    // 前缀有/, 查找是否存在多个/
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
                // 去除多余的/
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
     * 当给定字符串为 null、“null”、“undefined” 时，转换为Empty
     *
     * @param str 被转换的字符串
     * @return 转换后的字符串
     * @author Pengap
     * @date 2021/7/12
     */
    public static String undefinedToEmpty(CharSequence str) {
        return StrUtil.isNullOrUndefined(str) ? StrUtil.EMPTY : str.toString();
    }

    /**
     * 格式化字符串 字符串中使用${key}表示占位符
     *
     * @param template   需要匹配的字符串
     * @param param     参数集
     * @return java.lang.String
     * @author Pengap
     * @date 2021/12/29 17:16:00
     */
    public static String format(String template, Map<String, Object> param) {
        String targetStr = template;
        if (param == null)
            return targetStr;
        try {
            Matcher matcher = pattern.matcher(targetStr);
            while (matcher.find()) {
                String key = matcher.group();
                String keyClone = key.substring(2, key.length() - 1).trim();
                Object value = param.get(keyClone);
                if (value != null)
                    targetStr = targetStr.replace(key, value.toString());
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
