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

package com.apitable.shared.constants;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import com.apitable.shared.sysconfig.i18n.I18nTypes;

/**
 *
 * @author Shawn Deng
 * @date 2022-03-18 15:31:23
 */
public class LanguageConstantsTest {

    @Test
    public void testStringI18nType() {
        Set<I18nTypes> languages = LanguageConstants.SUPPORTED_LANGUAGE.stream()
                .map(locale -> I18nTypes.aliasOf(locale.toLanguageTag()))
                .collect(Collectors.toSet());
        Assertions.assertThat(languages).isNotEmpty()
                .contains(I18nTypes.EN_US, I18nTypes.ZH_CN, I18nTypes.ZH_HK, I18nTypes.FR_FR);
    }
}
