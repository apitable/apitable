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

package com.apitable.shared.context;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.apitable.AbstractIntegrationTest;
import com.apitable.shared.constants.LanguageConstants;
import java.util.Locale;
import org.junit.jupiter.api.Test;

public class I18nContextTest extends AbstractIntegrationTest {

    @Test
    public void testTransform() {
        LanguageConstants.SUPPORTED_LANGUAGE.stream()
            .map(locale -> I18nContext.me().transform("SEND_CAPTCHA_TOO_MUSH", locale))
            .forEach(System.out::println);
    }

    @Test
    public void testChinese() {
        System.out.println(Locale.CHINESE);
        System.out.println(Locale.SIMPLIFIED_CHINESE);
        System.out.println(Locale.TRADITIONAL_CHINESE);

        assertEquals(Locale.CHINESE.getLanguage(), Locale.SIMPLIFIED_CHINESE.getLanguage());
        assertEquals(Locale.CHINESE.getLanguage(), Locale.TRADITIONAL_CHINESE.getLanguage());
    }

}
