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

import com.apitable.automation.entity.AutomationTriggerEntity;
import com.apitable.automation.mapper.AutomationTriggerMapper;
import com.apitable.automation.model.AutomationTriggerDto;
import com.apitable.automation.service.IAutomationTriggerService;
import java.util.List;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AutomationTriggerServiceImpl implements IAutomationTriggerService {

    @Resource
    private AutomationTriggerMapper triggerMapper;

    @Override
    public List<AutomationTriggerDto> getTriggers(String seqId, String resourceId) {
        return triggerMapper.getTriggers(seqId, resourceId);
    }

    @Override
    public void create(AutomationTriggerEntity entity) {
        triggerMapper.insert(entity);
    }

    @Override
    public void updateByTriggerId(AutomationTriggerEntity trigger) {
        triggerMapper.updateByTriggerId(trigger.getTriggerId(),
            trigger.getTriggerTypeId(), trigger.getInput());
    }

}
