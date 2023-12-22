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
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.model.AutomationTaskSimpleVO;
import com.apitable.automation.service.IAutomationRunHistoryService;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.starter.databus.client.api.AutomationDaoApiApi;
import com.apitable.starter.databus.client.model.AutomationRunHistoryPO;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Automation run history interface implement.
 */
@Slf4j
@Service
public class AutomationRunHistoryServiceImpl implements IAutomationRunHistoryService {

    @Resource
    private AutomationDaoApiApi automationDaoApiApi;


    @Override
    public List<AutomationTaskSimpleVO> getRobotRunHistory(String robotId, Integer pageSize,
                                                           Integer pageNum) {
        return getAutomationRobotRunHistoryFromDatabus(robotId, pageSize, pageNum);
    }

    private List<AutomationTaskSimpleVO> getAutomationRobotRunHistoryFromDatabus(String robotId,
                                                                                 Integer pageSize,
                                                                                 Integer pageNum) {
        List<AutomationTaskSimpleVO> results = new ArrayList<>();
        try {
            List<AutomationRunHistoryPO> tasks =
                automationDaoApiApi.daoGetAutomationRunHistory(pageSize, pageNum, robotId)
                    .getData();
            if (null == tasks) {
                return results;
            }
            tasks.forEach(task -> {
                AutomationTaskSimpleVO result = new AutomationTaskSimpleVO();
                result.setRobotId(task.getRobotId());
                result.setStatus(task.getStatus());
                result.setTaskId(task.getTaskId());
                result.setCreatedAt(
                    LocalDateTimeUtil.parse(task.getCreatedAt())
                        .atZone(ClockManager.me().getDefaultTimeZone()).toInstant().toEpochMilli());
                result.setRobotId(task.getRobotId());
                // format action execution list
                if (StrUtil.isNotBlank(task.getActionIds())) {
                    List<AutomationTaskSimpleVO.ActionExecutionVO> executions = new ArrayList<>();
                    List<Object> actionIds =
                        new ArrayList<>(JSONUtil.parseArray(task.getActionIds()));
                    List<Object> actionTypeIds =
                        new ArrayList<>(JSONUtil.parseArray(task.getActionTypeIds()));
                    List<List<Object>> errorMessages =
                        new ArrayList<>(
                            JSONUtil.parseArray(task.getErrorStacks())).stream().map(
                            JSONUtil::parseArray).collect(Collectors.toList());
                    for (int i = 0; i < actionIds.size(); i++) {
                        AutomationTaskSimpleVO.ActionExecutionVO execution =
                            new AutomationTaskSimpleVO.ActionExecutionVO();
                        // exclude trigger
                        if (!ObjectUtil.contains(actionIds.get(i),
                            IdRulePrefixEnum.AUTOMATION_TRIGGER.getIdRulePrefixEnum())) {
                            execution.setActionId(actionIds.get(i).toString());
                            execution.setActionTypeId(actionTypeIds.get(i).toString());
                            execution.setSuccess(CollUtil.get(errorMessages, i).isEmpty());
                            executions.add(execution);
                        }
                    }
                    result.setExecutedActions(executions);
                }
                results.add(result);
            });
            return results;
        } catch (Exception e) {
            log.error("Get automation history error: {}", robotId, e);
            return results;
        }
    }
}
