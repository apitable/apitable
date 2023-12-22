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

package com.apitable.space.mapper;

import com.apitable.space.entity.LabsFeaturesEntity;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Experimental menu Mapper interface.
 * </p>
 */
public interface LabsFeatureMapper extends BaseMapper<LabsFeaturesEntity> {

    /**
     * Query all experimental functions according to feature keys.
     *
     * @param featureKeys List of laboratory function identification
     * @return LabsFeaturesEntity List
     */
    @InterceptorIgnore(illegalSql = "true")
    List<LabsFeaturesEntity> selectAllByFeatureKeys(@Param("featureKeys") List<String> featureKeys);

    /**
     * Query all experimental functions according to the laboratory function category.
     *
     * @param types List of laboratory function categories
     * @return LabsFeaturesEntity List
     */
    @InterceptorIgnore(illegalSql = "true")
    List<LabsFeaturesEntity> selectAllFeaturesByType(@Param("types") List<Integer> types);

    /**
     * Query ID according to the unique ID of the laboratory function.
     *
     * @param featureKey Laboratory function identification
     * @return id
     */
    @InterceptorIgnore(illegalSql = "true")
    Long selectIdByFeatureKey(@Param("featureKey") String featureKey);

    /**
     * Query laboratory functions according to a single feature Hey.
     *
     * @param featureKey Laboratory function identification
     * @return LabsFeaturesEntity
     */
    @InterceptorIgnore(illegalSql = "true")
    LabsFeaturesEntity selectByFeatureKey(@Param("featureKey") String featureKey);

    /**
     * Query laboratory functions according to function ID and function scope.
     *
     * @param featureKey   Unique identification of laboratory function
     * @param featureScope Lab Functional Scope
     * @return LabsFeaturesEntity
     */
    @InterceptorIgnore(illegalSql = "true")
    LabsFeaturesEntity selectByFeatureKeyAndFeatureScope(@Param("featureKey") String featureKey,
                                                         @Param("featureScope")
                                                         Integer featureScope);

}
