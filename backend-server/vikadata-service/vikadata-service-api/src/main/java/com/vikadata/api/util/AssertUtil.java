package com.vikadata.api.util;

import java.util.Arrays;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;

/**
 * 断言工具
 * @author Shawn Deng
 * @date 2022-06-14 10:56:35
 */
public class AssertUtil {

    /**
     * verify object not null or empty
     * @param elements objects to assert
     */
    public static void verifyNonNullOrEmpty(final Object... elements) {
        Preconditions.checkArgument(elements.length % 2 == 0, "%s should have an even number of elements", Arrays.toString(elements));
        for (int i = 0; i < elements.length; i += 2) {
            final Object argument = elements[i];
            final Object errorMessage = elements[i + 1];
            final boolean expression = argument instanceof String ? Strings.emptyToNull((String) argument) != null : argument != null;
            Preconditions.checkArgument(expression, errorMessage);
        }
    }
}
