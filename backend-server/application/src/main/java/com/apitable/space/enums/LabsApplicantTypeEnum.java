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

package com.apitable.space.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * labs applicant type enum.
 */
@Getter
@AllArgsConstructor
public enum LabsApplicantTypeEnum {

    USER_LEVEL_FEATURE("user_feature", 0),

    SPACE_LEVEL_FEATURE("space_feature", 1),

    UNKNOWN_LEVEL_FEATURE("unknown_level_feature", -1);

    private final String applicantTypeName;

    private final Integer code;
}
