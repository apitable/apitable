package com.apitable.starter.vika.core;

import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;

public class Utils {

    public static String getRelativePath(String attachCellValue) {
        return getRelativePath(attachCellValue, null);
    }

    public static String getRelativePath(String attachCellValue, String defaultValue) {
        String matchStr = ReUtil.getGroup1("\\((.+)\\)", attachCellValue);
        if (matchStr == null) {
            return defaultValue;
        }
        return StrUtil.removePrefix(URLUtil.getPath(matchStr), "/");
    }
}
