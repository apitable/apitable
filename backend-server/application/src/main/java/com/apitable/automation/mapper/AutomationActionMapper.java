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

import com.apitable.automation.entity.AutomationActionEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * automation action mapper.
 */
public interface AutomationActionMapper extends BaseMapper<AutomationActionEntity> {

    /**
     * query by robot id list.
     *
     * @param robotIds robot id list
     * @return action list
     */
    List<AutomationActionEntity> selectByRobotIdIds(
        @Param("robotIds") Collection<String> robotIds);

    /**
     * insert batch.
     *
     * @param entities entity list
     */
    void insertList(@Param("entities") Collection<AutomationActionEntity> entities);

    /**
     * update action type id and input by robot id.
     *
     * @param robotId             robot id
     * @param updatedActionTypeId updated action type id
     * @param updatedInput        updated input
     * @return affected rows
     */
    int updateActionTypeIdAndInputByRobotId(@Param("robotId") String robotId,
                                            @Param("updatedActionTypeId")
                                            String updatedActionTypeId,
                                            @Param("updatedInput") String updatedInput);

}
