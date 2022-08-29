package com.vikadata.api.util;

import java.util.regex.Pattern;

import cn.hutool.core.net.url.UrlQuery;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * UrlQuery 扩展工具类
 * </p>
 *
 * @author Pengap
 * @date 2021/9/3 20:56:37
 */
public class UrlQueryExtend extends UrlQuery {

    /**
     * 删除URL中指定参数
     *
     * @param url      Url
     * @param paramKey 参数Key
     * @author Pengap
     * @date 2021/9/3 20:59:36
     */
    public static String ridUrlParam(String url, String paramKey) {
        if (StrUtil.hasBlank(url, paramKey)) {
            return url;
        }
        Pattern compile = Pattern.compile(String.format("([?&])%s=[^&]*(&?)", paramKey));
        return ReUtil.replaceAll(url, compile, parameter -> {
            String startIndex = parameter.group(1);
            String endIndex = parameter.group(2);
            if (StrUtil.isAllNotBlank(startIndex, endIndex)) {
                return startIndex;
            }
            return endIndex;
        });
    }

}
