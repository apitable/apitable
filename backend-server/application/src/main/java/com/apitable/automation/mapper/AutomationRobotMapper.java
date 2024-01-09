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

package com.apitable.automation.mapper;

import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.model.AutomationRobotDto;
import com.apitable.automation.model.RobotTriggerDto;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * automation robot mapper.
 */
public interface AutomationRobotMapper extends BaseMapper<AutomationRobotEntity> {

    /**
     * query by resource id list.
     *
     * @param resourceIds resource id list
     * @return robot list
     */
    List<AutomationRobotDto> selectRobotsByResourceIds(
        @Param("resourceIds") Collection<String> resourceIds);

    /**
     * query with resource id list.
     *
     * @param resourceIds resource id list
     * @return robot list
     */
    List<AutomationRobotEntity> selectByResourceIds(
        @Param("resourceIds") Collection<String> resourceIds);

    /**
     * insert batch entities.
     *
     * @param entities entity list
     * @return insert count
     */
    int insertList(@Param("entities") Collection<AutomationRobotEntity> entities);

    /**
     * update name by resource id.
     *
     * @param resourceId resource id
     * @param name       name
     */
    void updateNameByResourceId(@Param("resourceId") String resourceId, @Param("name") String name);

    /**
     * update description by resource id.
     *
     * @param robotId     robot id
     * @param name        name
     * @param description description
     * @param resourceId  resource id
     */
    void updateByRobotId(@Param("robotId") String robotId, @Param("name") String name,
                         @Param("description") String description,
                         @Param("resourceId") String resourceId);

    /**
     * update is deleted by resource id.
     *
     * @param userId      user id
     * @param resourceIds resource id list
     * @param isDeleted   is deleted
     */
    void updateIsDeletedByResourceIds(@Param("userId") Long userId,
                                      @Param("resourceIds") List<String> resourceIds,
                                      @Param("isDeleted") Boolean isDeleted);

    /**
     * delete by robot ids.
     *
     * @param robotIds robot id list
     */
    void removeByRobotIds(@Param("robotIds") List<String> robotIds);

    /**
     * query robot triggers.
     *
     * @param seqId      seq id
     * @param resourceId resource id
     * @return robot trigger list
     */
    List<RobotTriggerDto> getRobotTriggers(@Param("seqId") String seqId,
                                           @Param("resourceId") String resourceId);

    /**
     * query count by robot id.
     *
     * @param robotId robot id
     * @return Integer
     */
    Integer selectCountByRobotId(@Param("robotId") String robotId);

    /**
     * update robot info.
     *
     * @param robotId   robot id
     * @param updatedBy updater
     * @return rows
     */
    int updateUpdatedByRobotId(@Param("robotId") String robotId,
                               @Param("updatedBy") Long updatedBy);
}
