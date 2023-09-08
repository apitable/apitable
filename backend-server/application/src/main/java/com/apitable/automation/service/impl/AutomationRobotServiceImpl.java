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

import static com.apitable.automation.model.ActionSimpleVO.actionComparator;
import static com.apitable.automation.model.TriggerSimpleVO.triggerComparator;
import static java.util.stream.Collectors.groupingBy;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.mapper.AutomationRobotMapper;
import com.apitable.automation.model.ActionSimpleVO;
import com.apitable.automation.model.ActionVO;
import com.apitable.automation.model.AutomationCopyOptions;
import com.apitable.automation.model.AutomationRobotDto;
import com.apitable.automation.model.AutomationSimpleVO;
import com.apitable.automation.model.AutomationTriggerDto;
import com.apitable.automation.model.AutomationVO;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.model.TriggerSimpleVO;
import com.apitable.automation.model.TriggerVO;
import com.apitable.automation.model.UpdateRobotRO;
import com.apitable.automation.service.IAutomationActionService;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.automation.service.IAutomationTriggerService;
import com.apitable.core.exception.BusinessException;
import com.apitable.databusclient.ApiException;
import com.apitable.databusclient.api.AutomationDaoApiApi;
import com.apitable.databusclient.model.AutomationActionIntroductionPO;
import com.apitable.databusclient.model.AutomationRobotIntroductionPO;
import com.apitable.databusclient.model.AutomationRobotIntroductionSO;
import com.apitable.databusclient.model.AutomationRobotSO;
import com.apitable.databusclient.model.AutomationRobotUpdateRO;
import com.apitable.databusclient.model.AutomationSO;
import com.apitable.databusclient.model.AutomationTriggerIntroductionPO;
import com.apitable.shared.util.IdUtil;
import com.apitable.template.enums.TemplateException;
import com.apitable.user.service.IUserService;
import com.apitable.user.vo.UserSimpleVO;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.NodeInfo;
import com.apitable.workspace.vo.NodeSimpleVO;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AutomationRobotServiceImpl implements IAutomationRobotService {

    @Resource
    private INodeService iNodeService;

    @Resource
    private IAutomationTriggerService iAutomationTriggerService;

    @Resource
    private IAutomationActionService iAutomationActionService;

    @Resource
    private AutomationRobotMapper robotMapper;

    @Resource
    private AutomationDaoApiApi automationDaoApiApi;

    @Resource
    private IUserService iUserService;

    @Override
    public List<AutomationRobotDto> getRobotListByResourceId(String resourceId) {
        return robotMapper.selectRobotsByResourceIds(Collections.singletonList(resourceId));
    }

    @Override
    public void create(AutomationRobotEntity robot) {
        robotMapper.insert(robot);
    }

    @Override
    public void copy(Long userId, List<String> resourceIds,
                     AutomationCopyOptions options, Map<String, String> newNodeMap) {
        if (CollUtil.isEmpty(resourceIds)) {
            return;
        }
        List<AutomationRobotEntity> robots = robotMapper.selectByResourceIds(resourceIds);
        if (CollUtil.isEmpty(robots)) {
            return;
        }
        Map<String, String> newRobotMap = new HashMap<>(robots.size());
        List<AutomationRobotEntity> entities = new ArrayList<>(robots.size());
        for (AutomationRobotEntity robot : robots) {
            String robotId = IdUtil.createAutomationRobotId();
            AutomationRobotEntity entity = AutomationRobotEntity.builder()
                .id(IdWorker.getId())
                .resourceId(newNodeMap.get(robot.getResourceId()))
                .robotId(robotId)
                .name(Optional.ofNullable(options.getOverriddenName()).orElse(robot.getName()))
                .description(robot.getDescription())
                .props(JSONUtil.createObj().toString())
                .isActive(false)
                .seqId(robot.getSeqId())
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            entities.add(entity);
            newRobotMap.put(robot.getRobotId(), robotId);
        }
        robotMapper.insertList(entities);

        TriggerCopyResultDto resultDto =
            iAutomationTriggerService.copy(userId, options.isSameSpace(), newRobotMap, newNodeMap);
        iAutomationActionService.copy(userId, newRobotMap, resultDto);
    }

    @Override
    public void updateNameByResourceId(String resourceId, String name) {
        robotMapper.updateNameByResourceId(resourceId, name);
    }

    @Override
    public void updateByRobotId(AutomationRobotEntity robot) {
        robotMapper.updateByRobotId(robot.getRobotId(), robot.getName(),
            robot.getDescription(), robot.getResourceId());
    }

    @Override
    public void updateIsDeletedByResourceIds(Long userId, List<String> resourceIds,
                                             Boolean isDeleted) {
        robotMapper.updateIsDeletedByResourceIds(userId, resourceIds, isDeleted);
    }

    @Override
    public void delete(List<String> robotIds) {
        robotMapper.removeByRobotIds(robotIds);
    }

    @Override
    public List<AutomationSimpleVO> getRobotsByResourceId(String resourceId) {
        List<AutomationSimpleVO> vos = new ArrayList<>();
        AutomationRobotIntroductionSO result = getRobotsByResourceIdFromDatabus(resourceId);
        if (null == result) {
            return vos;
        }
        List<AutomationRobotIntroductionPO> robots = result.getRobots();
        Map<String, List<AutomationActionIntroductionPO>> actionMap =
            result.getActions().stream()
                .collect(groupingBy(AutomationActionIntroductionPO::getRobotId));
        Map<String, List<AutomationTriggerIntroductionPO>> triggerMap =
            result.getTriggers().stream()
                .collect(groupingBy(AutomationTriggerIntroductionPO::getRobotId));
        for (AutomationRobotIntroductionPO robot : robots) {
            // convert to robot vo.
            AutomationSimpleVO vo =
                AutomationSimpleVO.builder().robotId(robot.getRobotId()).name(robot.getName())
                    .description(robot.getDescription())
                    .resourceId(robot.getResourceId())
                    .isActive(robot.getIsActive())
                    .build();
            // get robot triggers.
            List<TriggerSimpleVO> triggers =
                Optional.ofNullable(triggerMap.get(robot.getRobotId())).orElse(new ArrayList<>())
                    .stream()
                    .map(i -> {
                        TriggerSimpleVO trigger = new TriggerSimpleVO();
                        trigger.setTriggerId(i.getTriggerId());
                        trigger.setTriggerTypeId(i.getTriggerTypeId());
                        trigger.setPrevTriggerId(i.getPrevTriggerId());
                        return trigger;
                    }).sorted(triggerComparator).collect(Collectors.toList());
            // get robot actions.
            List<ActionSimpleVO> actions =
                Optional.ofNullable(actionMap.get(robot.getRobotId())).orElse(new ArrayList<>())
                    .stream()
                    .map(i -> {
                        ActionSimpleVO action = new ActionSimpleVO();
                        action.setActionId(i.getActionId());
                        action.setPrevActionId(i.getPrevActionId());
                        action.setNextActionId(i.getActionId());
                        action.setActionTypeId(i.getActionTypeId());
                        return action;
                    }).sorted(actionComparator).collect(Collectors.toList());
            vo.setTriggers(triggers);
            vo.setActions(actions);
            vos.add(vo);
        }
        return vos;
    }

    @Override
    public AutomationVO getRobotByRobotId(String robotId) {
        AutomationSO automation = getRobotByRobotIdFromDatabus(robotId);
        if (null == automation) {
            return null;
        }
        AutomationRobotSO robot = automation.getRobot();
        AutomationVO vo = AutomationVO.builder()
            .robotId(robot.getRobotId()).name(robot.getName())
            .description(robot.getDescription())
            .resourceId(robot.getResourceId())
            .isActive(robot.getIsActive())
            .props(
                BeanUtil.toBean(JSONUtil.parse(robot.getProps()),
                    AutomationSimpleVO.AutomationPropertyVO.class))
            .updatedAt(robot.getUpdatedAt())
            .recentlyRunCount(robot.getRecentlyRunCount())
            .build();
        UserSimpleVO user = iUserService.getUserSimpleInfoMap(ListUtil.toList(robot.getUpdatedBy()))
            .get(robot.getUpdatedBy());
        vo.setUpdatedBy(user);
        List<NodeSimpleVO> relatedResources =
            Optional.ofNullable(automation.getRelatedResources()).orElse(new ArrayList<>()).stream()
                .map(i -> {
                    NodeSimpleVO node = new NodeSimpleVO();
                    node.setNodeId(i.getNodeId());
                    node.setIcon(i.getIcon());
                    node.setNodeName(i.getNodeName());
                    return node;
                }).collect(Collectors.toList());
        List<TriggerVO> triggers =
            Optional.of(automation.getTriggers()).orElse(new ArrayList<>()).stream().map(i -> {
                TriggerVO trigger = new TriggerVO();
                trigger.setTriggerId(i.getTriggerId());
                trigger.setTriggerTypeId(i.getTriggerTypeId());
                trigger.setPrevTriggerId(i.getPrevTriggerId());
                trigger.setInput(i.getInput());
                return trigger;
            }).sorted(triggerComparator).collect(Collectors.toList());
        List<ActionVO> actions =
            Optional.of(automation.getActions()).orElse(new ArrayList<>()).stream().map(i -> {
                ActionVO action = new ActionVO();
                action.setInput(i.getInput());
                action.setActionId(i.getActionId());
                action.setPrevActionId(i.getPrevActionId());
                action.setNextActionId(i.getActionId());
                action.setActionTypeId(i.getActionTypeId());
                return action;
            }).sorted(actionComparator).collect(Collectors.toList());
        vo.setTriggers(triggers);
        vo.setActions(actions);
        vo.setRelatedResources(relatedResources);
        return vo;
    }


    @Override
    public void checkAutomationReference(List<String> subNodeIds, List<String> resourceIds) {
        if (CollUtil.isEmpty(resourceIds)) {
            return;
        }
        List<AutomationRobotDto> robots = robotMapper.selectRobotsByResourceIds(resourceIds);
        if (CollUtil.isEmpty(robots)) {
            return;
        }
        List<String> robotIds = robots.stream()
            .map(AutomationRobotDto::getRobotId).collect(Collectors.toList());
        List<AutomationTriggerDto> triggers =
            iAutomationTriggerService.getTriggersByRobotIds(robotIds);
        if (CollUtil.isEmpty(triggers)) {
            return;
        }
        List<String> referenceResourceIds = triggers.stream()
            .map(AutomationTriggerDto::getResourceId)
            .filter(StrUtil::isNotBlank).collect(Collectors.toList());
        Collection<String> disjunction = CollUtil.disjunction(referenceResourceIds, subNodeIds);
        if (CollUtil.isEmpty(disjunction)) {
            return;
        }
        Optional<AutomationTriggerDto> trigger = triggers.stream()
            .filter(i -> i.getResourceId().equals(CollUtil.getFirst(disjunction)))
            .findFirst();
        if (!trigger.isPresent()) {
            return;
        }
        Optional<AutomationRobotDto> robot = robots.stream()
            .filter(i -> i.getRobotId().equals(trigger.get().getRobotId()))
            .findFirst();
        if (!robot.isPresent()) {
            return;
        }
        List<String> nodeIds = new ArrayList<>();
        nodeIds.add(trigger.get().getResourceId());
        nodeIds.add(robot.get().getResourceId());
        List<NodeInfo> nodes = iNodeService.getNodeInfoByNodeIds(nodeIds);
        Map<String, Object> body = new HashMap<>();
        for (NodeInfo node : nodes) {
            if (node.getNodeId().equals(robot.get().getResourceId())) {
                body.put("AUTOMATION_NAME", node.getNodeName());
                continue;
            }
            body.put("NODE_NAME", node.getNodeName());
        }
        throw new BusinessException(TemplateException.FOLDER_AUTOMATION_LINK_FOREIGN_NODE, body);
    }

    @Override
    public boolean update(String robotId, UpdateRobotRO data) {
        AutomationRobotUpdateRO ro = new AutomationRobotUpdateRO();
        if (null != data.getDescription()) {
            ro.setDescription(data.getDescription());
        }
        if (StrUtil.isNotBlank(data.getName())) {
            ro.setName(data.getName());
        }
        if (null != data.getProps() && null != data.getProps().getFailureNotifyEnable()) {
            UpdateRobotRO.AutomationPropertyRO propertyRO =
                new UpdateRobotRO.AutomationPropertyRO();
            propertyRO.setFailureNotifyEnable(data.getProps().getFailureNotifyEnable());
            ro.setProps(JSONUtil.toJsonStr(propertyRO));
        }
        try {
            automationDaoApiApi.daoUpdateAutomationRobot(robotId, ro);
            return true;
        } catch (ApiException e) {
            log.error("Update automation error", e);
            return false;
        }
    }

    private AutomationRobotIntroductionSO getRobotsByResourceIdFromDatabus(String resourceId) {
        try {
            AutomationRobotIntroductionSO result =
                automationDaoApiApi.daoGetRobotsByResourceId(resourceId).getData();
            if (null == result) {
                return null;
            }
            List<AutomationRobotIntroductionPO> robots = result.getRobots();
            if (robots.isEmpty()) {
                return null;
            }
            return result;
        } catch (ApiException e) {
            log.error("Get automation error", e);
            return null;
        }
    }

    private AutomationSO getRobotByRobotIdFromDatabus(String robotId) {
        try {
            return automationDaoApiApi.daoGetRobotByRobotId(robotId).getData();
        } catch (ApiException e) {
            log.error("Get automation detail error", e);
            return null;
        }
    }
}
