package com.vikadata.api.helper;


import cn.hutool.core.collection.CollUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 请求忽略路径
 * 单例模式
 * </p>
 *
 * @author Chambers
 * @date 2020/4/29
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
