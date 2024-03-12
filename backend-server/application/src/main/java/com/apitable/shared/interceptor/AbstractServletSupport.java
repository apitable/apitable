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

package com.apitable.shared.interceptor;

import jakarta.servlet.http.HttpServletRequest;

/**
 * <p>
 * base servlet interceptor.
 * </p>
 *
 * @author Shawn Deng
 */
public abstract class AbstractServletSupport {

    protected String resolveServletPath(HttpServletRequest httpServletRequest) {
        String requestPath = httpServletRequest.getServletPath();
        String suffix = "/";
        if (requestPath.length() > 1 && requestPath.endsWith(suffix)) {
            // /foo/ -> /foo
            requestPath = requestPath.substring(0, requestPath.length() - 1);
        }
        return requestPath;
    }

}
