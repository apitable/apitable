package com.vikadata.boot.autoconfigure.social;

/**
 * 字符串工具
 * @author Shawn Deng
 * @date 2022-02-08 11:21:12
 */
public class StringUtil {

    public static String trimSlash(String path) {
        // 清除最前的斜杠
        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        if (path.length() == 0) {
            return path;
        }

        // 清除最后的斜杠
        int endPos = path.length() - 1;
        while (endPos >= 0 && path.charAt(endPos) == '/') {
            endPos--;
        }

        return path.substring(0, endPos + 1);
    }
}
