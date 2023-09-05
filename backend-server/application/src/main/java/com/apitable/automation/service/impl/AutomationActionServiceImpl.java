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

import cn.hutool.core.collection.CollUtil;
import com.apitable.automation.entity.AutomationActionEntity;
import com.apitable.automation.mapper.AutomationActionMapper;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.service.IAutomationActionService;
import com.apitable.shared.util.IdUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
    public void copy(Long userId, Map<String, String> newRobotMap, TriggerCopyResultDto resultDto) {
        List<AutomationActionEntity> actions =
            actionMapper.selectByRobotIdIds(newRobotMap.keySet());
        if (CollUtil.isEmpty(actions)) {
            return;
        }
        Map<String, List<String>> robotIdToTriggerIdsMap = resultDto.getRobotIdToTriggerIdsMap();
        Map<String, String> newTriggerMap = resultDto.getNewTriggerMap();
        Map<String, String> newActionMap = actions.stream()
            .collect(Collectors.toMap(AutomationActionEntity::getActionId,
                i -> IdUtil.createAutomationActionId()));
        List<AutomationActionEntity> entities = new ArrayList<>(actions.size());
        for (AutomationActionEntity action : actions) {
            AutomationActionEntity entity = AutomationActionEntity.builder()
                .id(IdWorker.getId())
                .robotId(newRobotMap.get(action.getRobotId()))
                .actionTypeId(action.getActionTypeId())
                .actionId(newActionMap.get(action.getActionId()))
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            if (action.getPrevActionId() != null) {
                entity.setPrevActionId(newActionMap.get(action.getPrevActionId()));
            }
            String input = action.getInput();
            if (input != null) {
                if (robotIdToTriggerIdsMap.containsKey(action.getRobotId())) {
                    for (String triggerId : robotIdToTriggerIdsMap.get(action.getRobotId())) {
                        input = input.replace(triggerId, newTriggerMap.get(triggerId));
                    }
                }
                entity.setInput(input);
            }
            entities.add(entity);
        }
        actionMapper.insertList(entities);
    }

    @Override
    public void updateActionTypeIdAndInputByRobotId(String robotId,
        String actionTypeId, String input) {
        actionMapper.updateActionTypeIdAndInputByRobotId(robotId, actionTypeId, input);
    }
}
