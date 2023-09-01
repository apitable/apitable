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
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.mapper.AutomationRobotMapper;
import com.apitable.automation.model.AutomationCopyOptions;
import com.apitable.automation.model.AutomationRobotDto;
import com.apitable.automation.model.AutomationTriggerDto;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.service.IAutomationActionService;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.automation.service.IAutomationTriggerService;
import com.apitable.core.exception.BusinessException;
import com.apitable.shared.util.IdUtil;
import com.apitable.template.enums.TemplateException;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.NodeInfo;
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

}
