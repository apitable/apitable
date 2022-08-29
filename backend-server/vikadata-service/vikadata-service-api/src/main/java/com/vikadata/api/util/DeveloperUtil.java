package com.vikadata.api.util;

import cn.hutool.core.util.RandomUtil;

/**
 * <p>
 * 开发者工具类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 15:43
 */
public class DeveloperUtil {

    public static final String API_KEY_PREFIX = "usk";

    public static String createKey() {
        return API_KEY_PREFIX + RandomUtil.randomString(RandomUtil.BASE_CHAR_NUMBER + RandomUtil.BASE_CHAR.toUpperCase(), 20);
    }
}
