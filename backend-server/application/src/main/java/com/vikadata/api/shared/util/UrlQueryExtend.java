package com.vikadata.api.shared.util;

import java.util.regex.Pattern;

import cn.hutool.core.net.url.UrlQuery;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * UrlQuery Extend Tool
 * </p>
 *
 * @author Pengap
 */
public class UrlQueryExtend extends UrlQuery {

    /**
     * remove the specified parameter from the url
     *
     * @param url      Url
     * @param paramKey param key
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
