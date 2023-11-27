/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.util;

import cn.hutool.core.net.url.UrlQuery;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import java.util.regex.Pattern;

/**
 * <p>
 * UrlQuery Extend Tool.
 * </p>
 *
 * @author Pengap
 */
public class UrlQueryExtend extends UrlQuery {

    /**
     * remove the specified parameter from the url.
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
