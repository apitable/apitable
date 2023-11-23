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

import com.apitable.automation.entity.AutomationActionEntity;
import com.apitable.automation.model.ActionVO;
import com.apitable.automation.model.CreateActionRO;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.model.UpdateActionRO;
import java.util.List;
import java.util.Map;

/**
 * automation action service.
 */
public interface IAutomationActionService {

    /**
     * create action.
     *
     * @param action entity
     */
    void create(AutomationActionEntity action);

    /**
     * copy action.
     *
     * @param userId      user id
     * @param newRobotMap new robot map
     * @param resultDto   result dto
     */
    void copy(Long userId, Map<String, String> newRobotMap, TriggerCopyResultDto resultDto);

    /**
     * update action type id and input by robot id.
     *
     * @param robotId      robot id
     * @param actionTypeId action type id
     * @param input        input
     */
    void updateActionTypeIdAndInputByRobotId(String robotId, String actionTypeId, String input);

    /**
     * Create trigger.
     *
     * @param userId creator's user id
     * @param data   data
     * @return ActionVO
     */
    List<ActionVO> createByDatabus(Long userId, CreateActionRO data);

    /**
     * Update trigger.
     *
     * @param userId   creator's user id
     * @param actionId action id
     * @param data     data
     * @return ActionVO
     */
    List<ActionVO> updateByDatabus(String actionId, Long userId, UpdateActionRO data);

    /**
     * Delete trigger.
     *
     * @param robotId  robot id
     * @param actionId action id
     * @param userId   operator user id
     */
    void deleteByDatabus(String robotId, String actionId, Long userId);
}
