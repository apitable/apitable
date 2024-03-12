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

package com.apitable.workspace.service.impl;

import static com.apitable.workspace.enums.NodeException.RUBBISH_NODE_NOT_EXIST;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.interfaces.document.facade.DocumentServiceFacade;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.component.TaskManager;
import com.apitable.space.service.ISpaceAssetService;
import com.apitable.space.service.ISpaceService;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeRubbishService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.RubbishNodeVo;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * node rubbish service implementation.
 */
@Slf4j
@Service
public class NodeRubbishServiceImpl implements INodeRubbishService {

    @Resource
    private INodeService iNodeService;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private IDatasheetService iDatasheetService;

    @Resource
    private IAutomationRobotService iAutomationRobotService;

    @Resource
    private DocumentServiceFacade documentServiceFacade;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private IControlService iControlService;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private ISpaceService iSpaceService;


    @Override
    public List<RubbishNodeVo> getRubbishNodeList(String spaceId, Long memberId, Integer size,
                                                  String lastNodeId) {
        log.info(
            "The member [{}] of the space [{}] obtains the node list of the rubbish, and the ID of the last node in the loaded list:[{}]",
            memberId, spaceId, lastNodeId);

        // Obtain the maximum storage days of the rubbish corresponding to the space subscription plan.
        SubscriptionInfo subscriptionInfo = iSpaceService.getSpaceSubscription(spaceId);
        long retainDay = subscriptionInfo.getFeature().getRemainTrashDays().getValue();
        // Push back start time (not included)
        LocalDate dateNow = ClockManager.me().getLocalDateNow();
        LocalDateTime beginTime = retainDay != -1
            ? LocalDateTime.of(dateNow.minusDays(retainDay), LocalTime.MAX) : null;
        LocalDateTime endTime = null;

        // If it is not loaded for the first time, determine whether the ID of the last node in the loaded list exceeds the number of days to save the subscription plan.
        if (StrUtil.isNotBlank(lastNodeId)) {
            LocalDateTime rubbishUpdatedAt =
                nodeMapper.selectRubbishUpdatedAtByNodeId(lastNodeId);
            // If the last node is not in the rubbish (recovered or completely deleted), the location fails and an abnormal service status code is returned. The client can request the last node again.
            ExceptionUtil.isNotNull(rubbishUpdatedAt, RUBBISH_NODE_NOT_EXIST);
            // It cannot be loaded for more than the number of days saved in the reading plan.
            if (beginTime != null && !rubbishUpdatedAt.isAfter(beginTime)) {
                return new ArrayList<>();
            }
            endTime = rubbishUpdatedAt;
        }
        while (true) {
            // Query the rubbish node ID (modify the reverse time sequence)
            List<String> rubbishNodeIds =
                nodeMapper.selectRubbishNodeIds(spaceId, size, beginTime, endTime);
            if (rubbishNodeIds.isEmpty()) {
                return new ArrayList<>();
            }
            // obtain node permissions
            ControlRoleDict roleDict =
                controlTemplate.fetchRubbishNodeRole(memberId, rubbishNodeIds);
            if (!roleDict.isEmpty()) {
                // filter nodes with inconsistent permissions
                List<String> rubbishNodeIdsAfterFilter = roleDict.entrySet().stream()
                    .filter(entry -> entry.getValue()
                        .isGreaterThanOrEqualTo(ControlRoleManager.parseNodeRole(Node.MANAGER)))
                    .map(Map.Entry::getKey).collect(Collectors.toList());
                if (CollUtil.isNotEmpty(rubbishNodeIdsAfterFilter)) {
                    List<RubbishNodeVo> rubbishNodeVos =
                        nodeMapper.selectRubbishNodeInfo(spaceId, rubbishNodeIdsAfterFilter);
                    rubbishNodeVos.forEach(vo -> vo.setRemainDay(retainDay
                        - (dateNow.toEpochDay() - vo.getDeletedAt().toLocalDate().toEpochDay())));
                    return rubbishNodeVos;
                }
            }
            // There is no permission.
            // If the number of nodes is less than the expected number of loads,
            // it indicates that the load has been completed and the end is returned.
            // Otherwise, the modification time of the new last node is taken
            // as the end time, and the load is loaded forward (timeline) again.
            int count = rubbishNodeIds.size();
            if (count < size) {
                return new ArrayList<>();
            }
            endTime = nodeMapper.selectRubbishUpdatedAtByNodeId(rubbishNodeIds.get(count - 1));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void recoverRubbishNode(Long userId, String nodeId, String parentId) {
        log.info("The user [{}] restores the node [{}] of the rubbish to the parent node [{}]",
            userId, nodeId, parentId);
        // Obtain the node ID of the node and its child descendants.
        List<String> subNodeIds =
            iNodeService.getNodeIdsInNodeTree(nodeId, -1, true, new ArrayList<>());
        if (CollUtil.isNotEmpty(subNodeIds)) {
            // recovery datasheet
            iDatasheetService.updateIsDeletedStatus(userId, subNodeIds, false);
            iAutomationRobotService.updateIsDeletedByResourceIds(userId, subNodeIds, false);
            documentServiceFacade.recover(userId, subNodeIds);
            // Restore the spatial attachment resources of the node
            iSpaceAssetService.updateIsDeletedByNodeIds(subNodeIds, false);
            // Only child nodes are restored, and the original node is handed over to the method of restoring node information.
            if (subNodeIds.size() > 1) {
                subNodeIds.remove(nodeId);
                boolean flag = SqlHelper.retBool(
                    nodeMapper.updateIsRubbishByNodeIdIn(userId, subNodeIds, false));
                ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
            }
        }
        // Modify the pre-node ID of the first node under the original parent node
        nodeMapper.updatePreNodeIdBySelf(nodeId, null, parentId);
        // duplicate name modification at the same level
        BaseNodeInfo nodeInfo = nodeMapper.selectBaseNodeInfoByNodeId(nodeId);
        String name =
            iNodeService.duplicateNameModify(parentId, nodeInfo.getType(), nodeInfo.getNodeName(),
                null, null);
        // modify the information of the recovery node
        boolean flag =
            SqlHelper.retBool(nodeMapper.updateInfoByNodeId(nodeId, parentId, null, name, null));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void delRubbishNode(Long userId, String nodeId) {
        log.info("User [{}] completely delete the node of the rubbish [{}]", userId, nodeId);
        // Obtain the node ID of the node and its child descendants.
        List<String> subNodeIds =
            iNodeService.getNodeIdsInNodeTree(nodeId, -1, true, new ArrayList<>());
        // logical delete node
        boolean flag = SqlHelper.retBool(nodeMapper.updateIsDeletedByNodeId(userId, nodeId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        if (CollUtil.isEmpty(subNodeIds)) {
            return;
        }
        TaskManager.me().execute(() -> {
            // delete all roles of the node
            iNodeRoleService.deleteByNodeId(userId, subNodeIds);
            // Clear the field permissions of the deleted grid datasheet
            List<NodeBaseInfoDTO> baseNodeInfos =
                nodeMapper.selectNodeBaseInfosByNodeIds(subNodeIds, true);
            baseNodeInfos.stream()
                .filter(info -> NodeType.toEnum(info.getType()).equals(NodeType.DATASHEET))
                .forEach(info -> {
                    List<String> controlIds =
                        iControlService.getControlIdByControlIdPrefixAndType(info.getNodeId(),
                            ControlType.DATASHEET_FIELD.getVal());
                    if (CollUtil.isNotEmpty(controlIds)) {
                        // turn off field permissions
                        iControlService.removeControl(userId, controlIds, true);
                    }
                });
        });
    }

    @Override
    public void checkRubbishNode(String spaceId, Long memberId, String nodeId) {
        log.info(
            "Check whether the rubbish node [{}] exists and whether the member [{}] has permission",
            nodeId, memberId);
        // Query the modification time of the rubbish node to determine whether it exists.
        LocalDateTime rubbishUpdatedAt = nodeMapper.selectRubbishUpdatedAtByNodeId(nodeId);
        ExceptionUtil.isNotNull(rubbishUpdatedAt, RUBBISH_NODE_NOT_EXIST);

        // Obtain the maximum storage days of the rubbish corresponding to the space subscription plan.
        long retainDay = iSpaceService.getSpaceSubscription(spaceId)
            .getFeature().getRemainTrashDays().getValue();
        // Subscription function restriction check
        ExceptionUtil.isTrue(retainDay < 0
            || rubbishUpdatedAt.isAfter(LocalDateTime.of(ClockManager.me()
                .getLocalDateNow()
                .minusDays(retainDay),
            LocalTime.MAX)
        ), RUBBISH_NODE_NOT_EXIST);

        // Check node permissions
        ControlRoleDict roleDict =
            controlTemplate.fetchRubbishNodeRole(memberId, Collections.singletonList(nodeId));
        ExceptionUtil.isFalse(roleDict.isEmpty()
                || roleDict.get(nodeId).isLessThan(ControlRoleManager.parseNodeRole(Node.MANAGER)),
            PermissionException.NODE_OPERATION_DENIED);
    }
}
