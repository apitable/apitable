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

import cn.hutool.core.util.StrUtil;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * labs feature type enum.
 */
@Getter
@AllArgsConstructor
public enum LabsFeatureTypeEnum {

    UNKNOWN_LABS_FEATURE_TYPE(null, 0),

    STATIC("static", 1),

    REVIEW("review", 2),

    NORMAL("normal", 3),

    NORMAL_PERSIST("normal_persist", 4),

    GLOBAL("global", 5);

    private final String featureKey;

    private final Integer type;

    /**
     * transform feature type name to enum.
     *
     * @param featureTypeName feature type name
     * @return feature type enum
     */
    public static LabsFeatureTypeEnum ofLabsFeatureType(String featureTypeName) {
        if (StrUtil.isBlank(featureTypeName)) {
            return UNKNOWN_LABS_FEATURE_TYPE;
        }
        for (LabsFeatureTypeEnum featureEnum : LabsFeatureTypeEnum.values()) {
            if (featureTypeName.equalsIgnoreCase(featureEnum.getFeatureKey())) {
                return featureEnum;
            }
        }
        return UNKNOWN_LABS_FEATURE_TYPE;
    }

    /**
     * transform feature type code to enum.
     *
     * @param typeCode feature type code
     * @return feature type enum
     */
    public static LabsFeatureTypeEnum ofLabsFeatureType(Integer typeCode) {
        if (Objects.isNull(typeCode) || typeCode == 0) {
            return UNKNOWN_LABS_FEATURE_TYPE;
        }
        for (LabsFeatureTypeEnum featureEnum : LabsFeatureTypeEnum.values()) {
            if (Objects.equals(typeCode, featureEnum.getType())) {
                return featureEnum;
            }
        }
        return UNKNOWN_LABS_FEATURE_TYPE;
    }
}
