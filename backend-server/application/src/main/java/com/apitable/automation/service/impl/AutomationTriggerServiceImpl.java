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
import static com.apitable.automation.enums.AutomationException.AUTOMATION_TRIGGER_NOT_EXIST;
import static com.apitable.automation.model.TriggerSimpleVO.triggerComparator;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.entity.AutomationTriggerEntity;
import com.apitable.automation.enums.AutomationTriggerType;
import com.apitable.automation.mapper.AutomationTriggerMapper;
import com.apitable.automation.model.AutomationCopyOptions;
import com.apitable.automation.model.AutomationTriggerDto;
import com.apitable.automation.model.CreateTriggerRO;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.model.TriggerVO;
import com.apitable.automation.model.UpdateTriggerRO;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.automation.service.IAutomationTriggerService;
import com.apitable.automation.service.IAutomationTriggerTypeService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.automation.facede.AutomationServiceFacade;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.util.IdUtil;
import com.apitable.starter.databus.client.api.AutomationDaoApiApi;
import com.apitable.starter.databus.client.model.ApiResponseAutomationTriggerSO;
import com.apitable.starter.databus.client.model.AutomationRobotTriggerRO;
import com.apitable.starter.databus.client.model.AutomationTriggerSO;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;

/**
 * automation trigger service impl.
 */
@Slf4j
@Service
public class AutomationTriggerServiceImpl implements IAutomationTriggerService {

    @Resource
    private AutomationDaoApiApi automationDaoApiApi;

    @Resource
    private AutomationTriggerMapper triggerMapper;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private IAutomationTriggerTypeService iAutomationTriggerTypeService;

    @Resource
    private AutomationServiceFacade automationServiceFacade;

    @Resource
    private IAutomationRobotService iAutomationRobotService;

    @Override
    public List<AutomationTriggerDto> getTriggersByRobotIds(List<String> robotIds) {
        return triggerMapper.selectTriggersByRobotIds(robotIds);
    }

    @Override
    public void create(AutomationTriggerEntity entity) {
        triggerMapper.insert(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<TriggerVO> create(Long userId, String spaceId, CreateTriggerRO data) {
        iAutomationRobotService.checkRobotExists(data.getRobotId());
        checkTriggerLimitation(data.getRobotId());
        String scheduleTriggerTypeId = iAutomationTriggerTypeService.getTriggerTypeByEndpoint(
            AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType());
        AutomationTriggerEntity entity = AutomationTriggerEntity.builder()
            .robotId(data.getRobotId())
            .triggerTypeId(data.getTriggerTypeId())
            .prevTriggerId(data.getPrevTriggerId())
            .resourceId(data.getRelatedResourceId())
            .input(JSONUtil.toJsonStr(data.getInput()))
            .triggerId(IdUtil.createAutomationTriggerId())
            .build();
        create(entity);
        iAutomationRobotService.updateUpdaterByRobotId(data.getRobotId(), userId);
        if (StrUtil.equals(scheduleTriggerTypeId, data.getTriggerTypeId())) {
            automationServiceFacade.createSchedule(spaceId, entity.getTriggerId(),
                JSONUtil.toJsonStr(
                    ObjectUtil.defaultIfNull(data.getScheduleConfig(), JSONUtil.createObj())));
        }
        return formatVoFromEntities(ListUtil.of(entity));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<TriggerVO> update(Long userId, String triggerId, String spaceId,
                                  UpdateTriggerRO data) {
        iAutomationRobotService.checkRobotExists(data.getRobotId());
        AutomationTriggerEntity trigger =
            triggerMapper.selectByTriggerId(triggerId);
        ExceptionUtil.isNotNull(trigger, AUTOMATION_TRIGGER_NOT_EXIST);
        String scheduleTriggerTypeId = iAutomationTriggerTypeService.getTriggerTypeByEndpoint(
            AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType());
        if (StrUtil.isNotBlank(data.getTriggerTypeId())) {
            // change trigger type to schedule should create schedule
            if (!trigger.getTriggerId().equals(scheduleTriggerTypeId)
                && data.getTriggerTypeId().equals(scheduleTriggerTypeId)) {
                automationServiceFacade.createSchedule(spaceId, triggerId,
                    JSONUtil.toJsonStr(JSONUtil.createObj()));
            }
            // change schedule to another type
            if (trigger.getTriggerId().equals(scheduleTriggerTypeId)
                && !data.getTriggerTypeId().equals(scheduleTriggerTypeId)) {
                automationServiceFacade.updateSchedule(triggerId,
                    JSONUtil.toJsonStr(JSONUtil.createObj()));
            }
            trigger.setTriggerTypeId(data.getTriggerTypeId());
        }
        if (StrUtil.isNotBlank(data.getPrevTriggerId())) {
            trigger.setPrevTriggerId(data.getPrevTriggerId());
        }
        if (ObjectUtil.isNotNull(data.getInput())) {
            trigger.setInput(JSONUtil.toJsonStr(data.getInput()));
        }
        if (StrUtil.isNotBlank(data.getRelatedResourceId())) {
            trigger.setResourceId(data.getRelatedResourceId());
        }
        if (ObjectUtil.isNotNull(data.getScheduleConfig())) {
            automationServiceFacade.updateSchedule(triggerId,
                JSONUtil.toJsonStr(data.getScheduleConfig()));
        }
        iAutomationRobotService.updateUpdaterByRobotId(data.getRobotId(), userId);
        triggerMapper.updateById(trigger);
        return formatVoFromEntities(ListUtil.of(trigger));
    }

    @Override
    public void deleteByDatabus(String robotId, String triggerId, Long userId) {
        AutomationRobotTriggerRO ro = new AutomationRobotTriggerRO();
        ro.setUserId(userId);
        ro.setIsDeleted(true);
        ro.setTriggerId(triggerId);
        try {
            ApiResponseAutomationTriggerSO response =
                automationDaoApiApi.daoCreateOrUpdateAutomationRobotTrigger(robotId, ro);
            ExceptionUtil.isFalse(
                AUTOMATION_ROBOT_NOT_EXIST.getCode().equals(response.getCode()),
                AUTOMATION_ROBOT_NOT_EXIST);
        } catch (RestClientException e) {
            log.error("Delete trigger: {}", triggerId, e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTriggerId(String robotId, String triggerId, Long userId) {
        AutomationTriggerEntity trigger = triggerMapper.selectByTriggerId(triggerId);
        ExceptionUtil.isNotNull(trigger, AUTOMATION_TRIGGER_NOT_EXIST);
        String scheduleTriggerTypeId = iAutomationTriggerTypeService.getTriggerTypeByEndpoint(
            AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType());
        if (trigger.getTriggerTypeId().equals(scheduleTriggerTypeId)) {
            automationServiceFacade.deleteSchedule(triggerId, userId);
        }
        triggerMapper.deleteById(trigger.getId());
        iAutomationRobotService.updateUpdaterByRobotId(robotId, userId);
    }

    @Override
    public TriggerCopyResultDto copy(Long userId, AutomationCopyOptions options,
                                     Map<String, String> newRobotMap,
                                     Map<String, String> newNodeMap) {
        List<AutomationTriggerEntity> triggers =
            triggerMapper.selectByRobotIds(newRobotMap.keySet());
        if (CollUtil.isEmpty(triggers)) {
            return new TriggerCopyResultDto();
        }
        String buttonClickedTypeId = iAutomationTriggerTypeService.getTriggerTypeByEndpoint(
            AutomationTriggerType.BUTTON_CLICKED.getType());
        Map<String, String> newTriggerMap = triggers.stream()
            .collect(Collectors.toMap(AutomationTriggerEntity::getTriggerId,
                i -> IdUtil.createAutomationTriggerId()));
        List<AutomationTriggerEntity> entities = new ArrayList<>(triggers.size());
        for (AutomationTriggerEntity trigger : triggers) {
            AutomationTriggerEntity entity = AutomationTriggerEntity.builder()
                .id(BigInteger.valueOf(IdWorker.getId()))
                .robotId(newRobotMap.get(trigger.getRobotId()))
                .triggerTypeId(trigger.getTriggerTypeId())
                .triggerId(newTriggerMap.get(trigger.getTriggerId()))
                .input(trigger.getInput())
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            if (trigger.getPrevTriggerId() != null) {
                entity.setPrevTriggerId(newTriggerMap.get(trigger.getPrevTriggerId()));
            }
            if (StrUtil.isNotBlank(trigger.getResourceId())) {
                // clear button trigger input
                if (options.isRemoveButtonClickedInput()
                    && StrUtil.isNotBlank(buttonClickedTypeId)
                    && buttonClickedTypeId.equals(trigger.getTriggerTypeId())) {
                    entity.setResourceId(StrUtil.EMPTY);
                    entity.setInput(null);
                } else {
                    String newNodeId = options.isSameSpace() ? trigger.getResourceId() :
                        Optional.ofNullable(newNodeMap.get(trigger.getResourceId()))
                            .orElse(StrUtil.EMPTY);
                    String input = options.isSameSpace() ? trigger.getInput() :
                        trigger.getInput().replace(trigger.getResourceId(), newNodeId);
                    entity.setResourceId(newNodeId);
                    entity.setInput(input);
                }
            } else {
                entity.setResourceId(StrUtil.EMPTY);
            }
            entities.add(entity);
        }
        triggerMapper.insertList(entities);
        Map<String, List<String>> robotIdToTriggerIdsMap =
            triggers.stream().collect(Collectors.groupingBy(AutomationTriggerEntity::getRobotId,
                Collectors.mapping(AutomationTriggerEntity::getTriggerId, toList())));
        automationServiceFacade.copy(newTriggerMap);
        return new TriggerCopyResultDto(robotIdToTriggerIdsMap, newTriggerMap);
    }

    @Override
    public void updateByTriggerId(AutomationTriggerEntity trigger) {
        triggerMapper.updateByTriggerId(trigger.getTriggerId(),
            trigger.getTriggerTypeId(), trigger.getInput());
    }

    @Override
    public void updateInputByRobotIdsAndTriggerTypeIds(List<String> robotIds, String triggerTypeId,
                                                       String input) {
        triggerMapper.updateTriggerInputByRobotIdsAndTriggerType(robotIds, triggerTypeId, input);
    }

    private List<TriggerVO> handleTriggerResponse(List<AutomationTriggerSO> data) {
        if (null != data) {
            return data.stream().map(i -> {
                TriggerVO vo = new TriggerVO();
                vo.setTriggerId(i.getTriggerId());
                vo.setTriggerTypeId(i.getTriggerTypeId());
                vo.setRelatedResourceId(i.getResourceId());
                vo.setPrevTriggerId(i.getPrevTriggerId());
                vo.setInput(i.getInput());
                if (null != i.getScheduleId()) {
                    automationServiceFacade.publishSchedule(i.getScheduleId());
                }
                return vo;
            }).sorted(triggerComparator).collect(toList());
        }
        return new ArrayList<>();
    }

    private List<TriggerVO> formatVoFromEntities(List<AutomationTriggerEntity> entities) {
        if (null != entities) {
            return entities.stream().map(i -> {
                TriggerVO vo = new TriggerVO();
                vo.setTriggerId(i.getTriggerId());
                vo.setTriggerTypeId(i.getTriggerTypeId());
                vo.setRelatedResourceId(i.getResourceId());
                vo.setPrevTriggerId(i.getPrevTriggerId());
                vo.setInput(i.getInput());
                return vo;
            }).sorted(triggerComparator).collect(toList());
        }
        return new ArrayList<>();
    }

    private void checkTriggerLimitation(String robotId) {
        Integer triggerCount = triggerMapper.selectCountByRobotId(robotId);
        ExceptionUtil.isFalse(triggerCount >= limitProperties.getAutomationTriggerCount(),
            AUTOMATION_TRIGGER_LIMIT);
    }
}
