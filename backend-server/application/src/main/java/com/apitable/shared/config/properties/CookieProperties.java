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

package com.apitable.shared.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.server.Cookie;

/**
 * <p>
 * Cookie properties.
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = "cookie")
public class CookieProperties {

    /**
     * cookies name.
     */
    private String cookieName;

    /**
     * Session Domain Name Scope.
     */
    private String domainName;

    /**
     * locale 118n cookies name.
     */
    private String i18nCookieName = "lang";

    /**
     * Session Domain Name Scope（use regex pattern，use domainName first if existed）.
     */
    private String domainNamePattern;

    /**
     * Whether to open the http only, default: false.
     */
    private Boolean httpOnly;

    /**
     * Whether to open the session https, default: false.
     */
    private Boolean secure;

    /**
     * Available values：Strict，Lax，None，default: none.
     */
    private Cookie.SameSite sameSite;
}
