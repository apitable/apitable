package com.vikadata.api.shared.util;

import cn.hutool.core.util.RandomUtil;

/**
 * random automatic generation extension tool class
 *
 * @author Benson Cheung
 */
public class RandomExtendUtil extends RandomUtil {

    public static final String BASE_CHAR = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    public static final String BASE_CHAR_NUMBER = BASE_CHAR + BASE_NUMBER;

    /**
     * Get a random string (only numbers and uppercase and lowercase characters)
     *
     * @param length the length of the string
     * @return random string
     */
    public static String randomString(int length) {
        return randomString(BASE_CHAR_NUMBER, length);
    }

    /**
     * get a random string (only numbers and lowercase characters)
     *
     * @param length the length of the string
     * @return random string
     */
    public static String randomStringLowerCase(int length) {
        return randomString(RandomUtil.BASE_CHAR_NUMBER, length);
    }
}
