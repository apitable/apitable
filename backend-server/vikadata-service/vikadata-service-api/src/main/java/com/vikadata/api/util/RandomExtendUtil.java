package com.vikadata.api.util;

import cn.hutool.core.util.RandomUtil;

/**
 * 随机自动生成 扩展工具类
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
public class RandomExtendUtil extends RandomUtil {

    /**
     * 用于随机选的字符
     */
    public static final String BASE_CHAR = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    /**
     * 用于随机选的字符和数字
     */
    public static final String BASE_CHAR_NUMBER = BASE_CHAR + BASE_NUMBER;

    /**
     * 获得一个随机的字符串（只包含数字和大小写字符）
     *
     * @param length 字符串的长度
     * @return 随机字符串
     */
    public static String randomString(int length) {
        return randomString(BASE_CHAR_NUMBER, length);
    }

    /**
     * 获得一个随机的字符串（只包含数字和小写字符）
     *
     * @param length 字符串的长度
     * @return 随机字符串
     */
    public static String randomStringLowerCase(int length) {
        return randomString(RandomUtil.BASE_CHAR_NUMBER, length);
    }
}
