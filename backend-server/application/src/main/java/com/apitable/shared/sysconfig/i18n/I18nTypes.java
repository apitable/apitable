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

package com.apitable.shared.sysconfig.i18n;

import java.util.Arrays;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * <p>
 * I18n Type
 * </p>
 */
@RequiredArgsConstructor
@Getter
public enum I18nTypes {

    ZH_CN("zh_CN", new String[] { "zh-CN" }, true),

    EN_US("en_US", new String[] { "en-US" }, true),
    FR_FR("fr_FR", new String[] { "fr-FR" }, true),

    ZH_HK("zh_HK", new String[] { "zh-HK" }, false);

    private final String name;

    private final String[] alias;

    private final boolean isSupport;

    public static I18nTypes of(String name) {
        for (I18nTypes value : I18nTypes.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return I18nTypes.ZH_CN;
    }

    public static I18nTypes aliasOf(String name) {
        for (I18nTypes value : I18nTypes.values()) {
            if (value.getName().equals(name) || (null != value.getAlias() && Arrays.asList(value.getAlias()).contains(name))) {
                return value;
            }
        }
        return I18nTypes.ZH_CN;
    }

    public I18nTypes isBackoff() {
        // Whether to back off the language to prevent the system from being temporarily compatible but unexpectedly returning
        return this.isSupport ? this : I18nTypes.ZH_CN;
    }

}
