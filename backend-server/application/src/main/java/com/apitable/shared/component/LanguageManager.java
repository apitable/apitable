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

package com.apitable.shared.component;

import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.config.properties.ConstProperties;
import java.util.Locale;
import org.springframework.stereotype.Component;

/**
 * <p>
 * locale context manager.
 * </p>
 *
 * @author Chambers
 */
@Component
public class LanguageManager {

    public static LanguageManager me() {
        return SpringContextHolder.getBean(LanguageManager.class);
    }

    public Locale getDefaultLanguage() {
        String languageTag = SpringContextHolder.getBean(ConstProperties.class).getLanguageTag();
        return Locale.forLanguageTag(languageTag);
    }

    public String getDefaultLanguageTag() {
        return SpringContextHolder.getBean(ConstProperties.class).getLanguageTag();
    }

    /**
     * Get the default language string Tag, and convert the connecting character "-" to the underscore "_".
     *
     * @return locale string key
     */
    public String getDefaultLanguageTagWithUnderLine() {
        return getDefaultLanguageTag().replace("-", "_");
    }
}
