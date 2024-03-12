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

import com.apitable.automation.entity.AutomationTriggerEntity;
import com.apitable.automation.model.AutomationTriggerDto;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * automation trigger mapper.
 */
public interface AutomationTriggerMapper extends BaseMapper<AutomationTriggerEntity> {

    /**
     * query by robot id list.
     *
     * @param robotIds robot id list
     * @return trigger list
     */
    List<AutomationTriggerDto> selectTriggersByRobotIds(
        @Param("robotIds") Collection<String> robotIds);

    /**
     * query by robot id list.
     *
     * @param robotIds robot id list
     * @return trigger list
     */
    List<AutomationTriggerEntity> selectByRobotIds(
        @Param("robotIds") Collection<String> robotIds);

    /**
     * insert batch.
     *
     * @param entities entity list
     * @return insert count
     */
    int insertList(@Param("entities") Collection<AutomationTriggerEntity> entities);

    /**
     * update by trigger id.
     *
     * @param triggerId     trigger id
     * @param triggerTypeId trigger type id
     * @param input         input
     */
    void updateByTriggerId(@Param("triggerId") String triggerId,
                           @Param("triggerTypeId") String triggerTypeId,
                           @Param("input") String input);

    /**
     * update input.
     *
     * @param robotIds      robot ids
     * @param triggerTypeId trigger type id
     * @param input         input
     */
    void updateTriggerInputByRobotIdsAndTriggerType(@Param("robotIds") List<String> robotIds,
                                                    @Param("triggerTypeId") String triggerTypeId,
                                                    @Param("input") String input);

    /**
     * get count by trigger id.
     *
     * @param robotId robot id
     * @return total amount
     */
    Integer selectCountByRobotId(@Param("robotId") String robotId);

    /**
     * query trigger.
     *
     * @param triggerId trigger
     * @return AutomationTriggerEntity
     */
    AutomationTriggerEntity selectByTriggerId(
        @Param("triggerId") String triggerId);

}
