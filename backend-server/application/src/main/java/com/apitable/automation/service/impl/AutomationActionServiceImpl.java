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

package com.apitable.automation.service.impl;

import com.apitable.automation.entity.AutomationActionEntity;
import com.apitable.automation.mapper.AutomationActionMapper;
import com.apitable.automation.service.IAutomationActionService;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AutomationActionServiceImpl implements IAutomationActionService {

    @Resource
    private AutomationActionMapper actionMapper;

    @Override
    public void create(AutomationActionEntity action) {
        actionMapper.insert(action);
    }

    @Override
    public void updateActionTypeIdAndInputByRobotId(String robotId,
        String actionTypeId, String input) {
        actionMapper.updateActionTypeIdAndInputByRobotId(robotId, actionTypeId, input);
    }
}
