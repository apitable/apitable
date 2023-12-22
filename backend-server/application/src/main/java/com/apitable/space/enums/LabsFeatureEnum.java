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
import lombok.Getter;

/**
 * labs feature enum.
 */
@Getter
public enum LabsFeatureEnum {

    RENDER_PROMPT("render_prompt", LabsApplicantTypeEnum.USER_LEVEL_FEATURE),

    RENDER_NORMAL("render_normal", LabsApplicantTypeEnum.USER_LEVEL_FEATURE),

    ASYNC_COMPUTE("async_compute", LabsApplicantTypeEnum.USER_LEVEL_FEATURE),

    ROBOT("robot", LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE),

    WIDGET_CENTER("widget_center", LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE),

    VIEW_MANUAL_SAVE("view_manual_save", LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE),

    UNKNOWN_LAB_FEATURE("unknown_lab_feature", LabsApplicantTypeEnum.UNKNOWN_LEVEL_FEATURE);

    private final String featureName;

    private final LabsApplicantTypeEnum applicantType;

    LabsFeatureEnum(String featureName, LabsApplicantTypeEnum applicantType) {
        this.featureName = featureName;
        this.applicantType = applicantType;
    }

    /**
     * transform featureKey to featureName.
     *
     * @param featureKey featureKey
     * @return featureName
     */
    public static String ofFeatureKey(String featureKey) {
        for (LabsFeatureEnum featureEnum : LabsFeatureEnum.values()) {
            if (featureEnum.name().equalsIgnoreCase(featureKey)) {
                return featureEnum.getFeatureName();
            }
        }
        return UNKNOWN_LAB_FEATURE.getFeatureName();
    }

    /**
     * transform featureName to LabsFeatureEnum.
     *
     * @param featureName featureName
     * @return LabsFeatureEnum
     */
    public static LabsFeatureEnum ofLabsFeature(String featureName) {
        if (StrUtil.isBlank(featureName)) {
            return UNKNOWN_LAB_FEATURE;
        }
        for (LabsFeatureEnum featureEnum : LabsFeatureEnum.values()) {
            if (Objects.equals(featureName, featureEnum.getFeatureName())
                || Objects.equals(featureName, featureEnum.name())) {
                return featureEnum;
            }
        }
        return UNKNOWN_LAB_FEATURE;
    }
}
