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

import cn.hutool.core.util.ObjectUtil;
import com.apitable.control.infrastructure.ExportLevelEnum;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;

/**
 * export level validator.
 */
@Slf4j
public class ExportLevelValidator implements ConstraintValidator<ExportLevelMatch, Integer> {

    @Override
    public boolean isValid(Integer exportLevel, ConstraintValidatorContext context) {
        if (ObjectUtil.isNull(exportLevel)) {
            return true;
        }

        return Arrays.stream(ExportLevelEnum.values())
            .anyMatch(value -> value.getValue().equals(exportLevel));
    }

}
