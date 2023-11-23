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
 * I18n Type.
 * </p>
 */
@RequiredArgsConstructor
@Getter
public enum I18nTypes {

    AR_SA("ar_SA", new String[] {"ar-SA"}, true),
    DE_DE("de_DE", new String[] {"de-DE"}, true),
    EN_US("en_US", new String[] {"en-US"}, true),
    ES_ES("es_ES", new String[] {"es-ES"}, true),
    FR_FR("fr_FR", new String[] {"fr-FR"}, true),
    IT_IT("it_IT", new String[] {"it-IT"}, true),
    ja_JP("ja_JP", new String[] {"ja-JP"}, true),
    ko_KR("ko_KR", new String[] {"ko-KR"}, true),
    ru_RU("ru_RU", new String[] {"ru-RU"}, true),
    ZH_CN("zh_CN", new String[] {"zh-CN"}, true),


    ZH_HK("zh_HK", new String[] {"zh-HK"}, true);

    private final String name;

    private final String[] alias;

    private final boolean isSupport;

    /**
     * transform name to I18nTypes.
     *
     * @param name name
     * @return I18nTypes
     */
    public static I18nTypes of(String name) {
        for (I18nTypes value : I18nTypes.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return I18nTypes.ZH_CN;
    }

    /**
     * transform name to I18nTypes.
     *
     * @param name name
     * @return I18nTypes
     */
    public static I18nTypes aliasOf(String name) {
        for (I18nTypes value : I18nTypes.values()) {
            if (value.getName().equals(name)
                || (null != value.getAlias() && Arrays.asList(value.getAlias()).contains(name))) {
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
