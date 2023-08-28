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
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AutomationTriggerMapper extends BaseMapper<AutomationTriggerEntity> {

    /**
     * Get triggers.
     */
    List<AutomationTriggerDto> getTriggers(@Param("seqId") String seqId,
        @Param("robotResourceId") String robotResourceId);

    /**
     * Update trigger.
     */
    void updateByTriggerId(@Param("triggerId") String triggerId,
        @Param("triggerTypeId") String triggerTypeId, @Param("input") String input);

}
