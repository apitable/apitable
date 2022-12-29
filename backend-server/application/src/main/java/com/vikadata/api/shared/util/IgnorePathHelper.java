package com.vikadata.api.shared.util;


import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.collection.CollUtil;

/**
 * <p>
 * request ignore path helper
 * singleton pattern
 * </p>
 *
 * @author Chambers
 */
public class IgnorePathHelper {

    private static List<String> ignores = null;

    public static List<String> getInstant() {
        if (CollUtil.isEmpty(ignores)) {
            ignores = new ArrayList<>();
        }
        return ignores;
    }
}
