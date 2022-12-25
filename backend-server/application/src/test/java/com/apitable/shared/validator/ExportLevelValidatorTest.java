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

package com.apitable.shared.validator;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author tao
 */
public class ExportLevelValidatorTest {


    @Test
    void givenNullExportLevelWhenVerifySpaceSecuritySettingRoThenReturnTrue() {
        ExportLevelValidator exportLevelValidator = new ExportLevelValidator();
        boolean isValid = exportLevelValidator.isValid(null, null);
        assertThat(isValid).isTrue();
    }

    @Test
    void givenLegalExportLevelWhenVerifySpaceSecuritySettingRoThenReturnTrue() {
        ExportLevelValidator exportLevelValidator = new ExportLevelValidator();
        boolean isValid = exportLevelValidator.isValid(0, null);
        assertThat(isValid).isTrue();
    }

    @Test
    void givenIllegalExportLevelWhenVerifySpaceSecuritySettingRoThenReturnFalse() {
        ExportLevelValidator exportLevelValidator = new ExportLevelValidator();
        boolean isValid = exportLevelValidator.isValid(5, null);
        assertThat(isValid).isFalse();
    }
}
