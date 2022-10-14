package com.vikadata.integration.vika;

import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;

/**
 * <p>
 *
 * </p>
 *
 * @author Chambers
 * @date 2022/9/22
 */
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
