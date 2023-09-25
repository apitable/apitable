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

package com.apitable.automation.service;

import com.apitable.automation.entity.AutomationTriggerEntity;
import com.apitable.automation.model.AutomationTriggerDto;
import com.apitable.automation.model.CreateTriggerRO;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.model.TriggerVO;
import com.apitable.automation.model.UpdateTriggerRO;
import java.util.List;
import java.util.Map;

public interface IAutomationTriggerService {

    List<AutomationTriggerDto> getTriggersByRobotIds(List<String> robotIds);

    void create(AutomationTriggerEntity entity);

    /**
     * Create trigger.
     *
     * @param userId  creator's user id
     * @param data    data
     * @return TriggerVO
     */
    List<TriggerVO> createByDatabus(Long userId, CreateTriggerRO data);

    /**
     * Update trigger.
     *
     * @param userId    creator's user id
     * @param triggerId trigger id
     * @param data      data
     * @return TriggerVO
     */
    List<TriggerVO> updateByDatabus(String triggerId, Long userId, UpdateTriggerRO data);

    TriggerCopyResultDto copy(Long userId, boolean sameSpace,
        Map<String, String> newRobotMap, Map<String, String> newNodeMap);

    /**
     * Update trigger by trigger id.
     *
     * @param trigger trigger
     */
    void updateByTriggerId(AutomationTriggerEntity trigger);

}
