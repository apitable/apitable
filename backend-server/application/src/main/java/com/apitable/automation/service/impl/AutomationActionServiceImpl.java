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

import static com.apitable.automation.enums.AutomationException.AUTOMATION_ROBOT_NOT_EXIST;
import static com.apitable.automation.enums.AutomationException.AUTOMATION_TRIGGER_LIMIT;
import static com.apitable.automation.model.ActionSimpleVO.actionComparator;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.entity.AutomationActionEntity;
import com.apitable.automation.mapper.AutomationActionMapper;
import com.apitable.automation.model.ActionVO;
import com.apitable.automation.model.CreateActionRO;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.model.UpdateActionRO;
import com.apitable.automation.service.IAutomationActionService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.util.IdUtil;
import com.apitable.starter.databus.client.api.AutomationDaoApiApi;
import com.apitable.starter.databus.client.model.ApiResponseAutomationActionPO;
import com.apitable.starter.databus.client.model.AutomationActionPO;
import com.apitable.starter.databus.client.model.AutomationRobotActionRO;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

/**
 * automation action service impl.
 */
@Slf4j
@Service
public class AutomationActionServiceImpl implements IAutomationActionService {

    @Resource
    private AutomationActionMapper actionMapper;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private AutomationDaoApiApi automationDaoApiApi;

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
                .id(BigInteger.valueOf(IdWorker.getId()))
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

    @Override
    public List<ActionVO> createByDatabus(Long userId, CreateActionRO data) {
        AutomationRobotActionRO ro = new AutomationRobotActionRO();
        ro.setUserId(userId);
        ro.setInput(JSONUtil.toJsonStr(data.getInput()));
        ro.setPrevActionId(data.getPrevActionId());
        ro.setActionTypeId(data.getActionTypeId());
        ro.setLimitCount(Long.valueOf(limitProperties.getAutomationActionCount()));
        try {
            ApiResponseAutomationActionPO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotAction(data.getRobotId(), ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
            ExceptionUtil.isFalse(
                AUTOMATION_TRIGGER_LIMIT.getCode().equals(response.getCode()),
                AUTOMATION_TRIGGER_LIMIT);
            return formatVoFromDatabusResponse(response.getData());
        } catch (RestClientException e) {
            log.error("Robot create action: {}", data.getRobotId(), e);
        }
        return new ArrayList<>();
    }

    @Override
    public List<ActionVO> updateByDatabus(String actionId, Long userId, UpdateActionRO data) {
        AutomationRobotActionRO ro = new AutomationRobotActionRO();
        ro.setUserId(userId);
        ro.setInput(JSONUtil.toJsonStr(data.getInput()));
        ro.setPrevActionId(data.getPrevActionId());
        ro.setActionTypeId(data.getActionTypeId());
        ro.setActionId(actionId);
        try {
            ApiResponseAutomationActionPO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotAction(data.getRobotId(), ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
            return formatVoFromDatabusResponse(response.getData());
        } catch (RestClientException e) {
            log.error("Robot update action: {}", data.getRobotId(), e);
        }
        return new ArrayList<>();
    }

    @Override
    public void deleteByDatabus(String robotId, String actionId, Long userId) {
        AutomationRobotActionRO ro = new AutomationRobotActionRO();
        ro.setUserId(userId);
        ro.setIsDeleted(true);
        ro.setActionId(actionId);
        try {
            ApiResponseAutomationActionPO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotAction(robotId, ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
        } catch (RestClientException e) {
            log.error("Delete action: {}", actionId, e);
        }
    }

    private List<ActionVO> formatVoFromDatabusResponse(List<AutomationActionPO> data) {
        if (null != data) {
            return data.stream().map(i -> {
                ActionVO vo = new ActionVO();
                vo.setActionId(i.getActionId());
                vo.setActionTypeId(i.getActionTypeId());
                vo.setPrevActionId(i.getPrevActionId());
                vo.setInput(i.getInput());
                return vo;
            }).sorted(actionComparator).collect(toList());
        }
        return new ArrayList<>();
    }

}
