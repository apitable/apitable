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

import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;

/**
 * <p>
 * api helper.
 * </p>
 *
 * @author Chambers
 */
public class ApiHelper {

    private static final String API_KEY_PREFIX = "usk";

    public static String createKey() {
        return API_KEY_PREFIX + RandomUtil.randomString(
            RandomUtil.BASE_CHAR_NUMBER + RandomUtil.BASE_CHAR.toUpperCase(), 20);
    }

    /**
     * get api key from request header.
     *
     * @param request http servlet request
     * @return api key
     */
    public static String getApiKey(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StrUtil.isBlank(bearerToken)) {
            return null;
        }
        String apiKey = StrUtil.removePrefix(bearerToken, "Bearer").trim();
        if (StrUtil.startWith(apiKey, API_KEY_PREFIX)) {
            return apiKey;
        }
        return null;
    }
}
