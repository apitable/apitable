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

package com.apitable.space.service;

import com.apitable.space.entity.LabsFeaturesEntity;
import com.apitable.space.enums.LabsFeatureTypeEnum;
import com.apitable.space.vo.UserSpaceLabsFeatureVo;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * laboratory function service.
 */
public interface ILabsFeatureService extends IService<LabsFeaturesEntity> {

    /**
     * Get all laboratory functions that can operate normally.
     *
     * @return LabsFeaturesEntity List
     */
    List<LabsFeaturesEntity> getAvailableLabFeatures();

    /**
     * get row id by feature key.
     *
     * @param featureKey lab feature key
     * @return id
     */
    Long getIdByFeatureKey(String featureKey);

    /**
     * Get the list of experimental functions enabled and disabled by the user and the space station.
     *
     * @return UserSpaceLabsFeatureVo
     */
    UserSpaceLabsFeatureVo getAvailableLabsFeature();

    /**
     * Get the current laboratory function category.
     *
     * @param featureKey Unique identification of laboratory function
     * @return LabsFeatureTypeEnum
     */
    LabsFeatureTypeEnum getCurrentLabsFeatureType(String featureKey);
}
