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

package com.apitable.internal.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.NodeRole;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.internal.service.IPermissionService;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeFavoriteService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareSettingService;
import com.apitable.workspace.vo.DatasheetPermissionView;
import com.apitable.workspace.vo.FieldPermissionView;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Permission Service Implements.
 */
@Slf4j
@Service
public class PermissionServiceImpl implements IPermissionService {

    @Resource
    private IUserService iUserService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeFavoriteService iNodeFavoriteService;

    @Resource
    private INodeShareSettingService iNodeShareSettingService;

    @Resource
    private IFieldRoleService iFieldRoleService;

    @Resource
    private ControlTemplate controlTemplate;

    @Override
    public List<DatasheetPermissionView> getDatasheetPermissionView(Long userId,
                                                                    List<String> nodeIds,
                                                                    String shareId) {
        // Determine whether the nodes belong to the template (only part of the template triggers an exception)
        Boolean isTemplate = iNodeService.getIsTemplateByNodeIds(nodeIds);
        List<DatasheetPermissionView> views = new ArrayList<>(nodeIds.size());
        String uuid = iUserService.getUuidByUserId(userId);
        // template permissions are returned directly
        if (BooleanUtil.isTrue(isTemplate)) {
            DatasheetPermissionView templateView =
                ControlRoleManager.parseNodeRole(Node.TEMPLATE_VISITOR)
                    .permissionToBean(DatasheetPermissionView.class);
            templateView.setHasRole(true);
            templateView.setUserId(userId);
            templateView.setUuid(uuid);
            templateView.setRole(Node.TEMPLATE_VISITOR);
            for (String nodeId : nodeIds) {
                DatasheetPermissionView view = new DatasheetPermissionView();
                BeanUtil.copyProperties(templateView, view);
                view.setNodeId(nodeId);
                views.add(view);
            }
            return views;
        }
        // Get space ID (multiple spaces trigger exception)
        String spaceId = iNodeService.getSpaceIdByNodeIds(nodeIds);
        // When loading node permissions in sharing, the permissions of the last changer in the sharing settings shall prevail. The method includes judging whether the changer exists.
        Long owner = StrUtil.isNotBlank(shareId)
            && !shareId.startsWith(IdRulePrefixEnum.EMB.getIdRulePrefixEnum())
            ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : userId;
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(owner, spaceId);
        // non space station member
        if (memberId == null) {
            for (String nodeId : nodeIds) {
                DatasheetPermissionView view =
                    this.getEmptyPermissionView(userId, uuid, memberId, nodeId, shareId);
                view.setIsDeleted(true);
                views.add(view);
            }
            return views;
        }
        // load node permission set
        ControlRoleDict roleDict = controlTemplate.fetchInternalNodeRole(memberId, nodeIds);
        // If no node has permission, return an empty permission set
        if (roleDict.isEmpty()) {
            for (String nodeId : nodeIds) {
                views.add(this.getEmptyPermissionView(userId, uuid, memberId, nodeId, shareId));
            }
            return views;
        }
        // get spatial global properties
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        // get star node id
        List<String> favoriteNodeIds = iNodeFavoriteService.getFavoriteNodeIdsByMemberId(memberId);
        for (String nodeId : nodeIds) {
            if (!roleDict.containsKey(nodeId)) {
                // Returns an empty permission set if there is no node permission
                views.add(this.getEmptyPermissionView(userId, uuid, memberId, nodeId, shareId));
                continue;
            }
            NodeRole controlRole = (NodeRole) roleDict.get(nodeId);
            DatasheetPermissionView permissionView =
                controlRole.permissionToBean(DatasheetPermissionView.class, feature);
            permissionView.setHasRole(true);
            permissionView.setUserId(userId);
            permissionView.setUuid(uuid);
            permissionView.setRole(controlRole.getRoleTag());
            permissionView.setIsGhostNode(controlRole.isGhostNode());
            // permission to get all fields of the data table
            FieldPermissionView fieldPermissionView =
                iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId);
            if (fieldPermissionView != null) {
                permissionView.setDatasheetId(fieldPermissionView.getDatasheetId());
                permissionView.setFieldPermissionMap(fieldPermissionView.getFieldPermissionMap());
            }
            permissionView.setNodeFavorite(favoriteNodeIds.contains(nodeId));
            permissionView.setNodeId(nodeId);
            views.add(permissionView);
        }
        return views;
    }

    @Override
    public void checkPermissionBySessionOrShare(String resourceId, String shareId,
                                                NodePermission permission,
                                                Consumer<Boolean> consumer) {
        if (StrUtil.isNotBlank(shareId)) {
            // check share permission
            NodePermission sharePermission =
                iNodeShareSettingService.getPermissionByShareId(shareId);
            consumer.accept(sharePermission.equals(permission));
        } else {
            Long userId = SessionContext.getUserId();
            String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
            Long memberId = LoginContext.me().getMemberId(userId, spaceId);
            // check whether the node has the specified operation permission
            controlTemplate.checkNodePermission(memberId, resourceId, permission, consumer);
        }
    }

    private DatasheetPermissionView getEmptyPermissionView(Long userId, String uuid, Long memberId,
                                                           String nodeId, String shareId) {
        DatasheetPermissionView emptyPermissionView = new DatasheetPermissionView();
        emptyPermissionView.setUserId(userId);
        emptyPermissionView.setUuid(uuid);
        // permission to get all fields of the data table
        FieldPermissionView fieldPermissionView =
            iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId);
        if (fieldPermissionView != null) {
            emptyPermissionView.setDatasheetId(fieldPermissionView.getDatasheetId());
            emptyPermissionView.setFieldPermissionMap(fieldPermissionView.getFieldPermissionMap());
        }
        emptyPermissionView.setNodeId(nodeId);
        return emptyPermissionView;
    }
}
