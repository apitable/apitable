package com.vikadata.api.modular.internal.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.NodeRole;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.space.SpaceResourceGroupCode;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.vo.node.DatasheetPermissionView;
import com.vikadata.api.model.vo.node.FieldPermissionView;
import com.vikadata.api.modular.internal.service.IPermissionService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.space.service.ISpaceMemberRoleRelService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeFavoriteService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareSettingService;

import org.springframework.stereotype.Service;

/**
 * Permission Service Implements
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

    @Resource
    private ISpaceMemberRoleRelService iSpaceMemberRoleRelService;

    @Override
    public List<DatasheetPermissionView> getDatasheetPermissionView(Long userId, List<String> nodeIds, String shareId) {
        // Determine whether the nodes belong to the template (only part of the template triggers an exception)
        Boolean isTemplate = iNodeService.getIsTemplateByNodeIds(nodeIds);
        List<DatasheetPermissionView> views = new ArrayList<>(nodeIds.size());
        String uuid = iUserService.getUuidByUserId(userId);
        // template permissions are returned directly
        if (BooleanUtil.isTrue(isTemplate)) {
            DatasheetPermissionView templateView = ControlRoleManager.parseNodeRole(Node.TEMPLATE_VISITOR).permissionToBean(DatasheetPermissionView.class);
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
        Long owner = StrUtil.isNotBlank(shareId) ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : userId;
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(owner, spaceId);
        // non space station member
        if (memberId == null) {
            for (String nodeId : nodeIds) {
                views.add(this.getEmptyPermissionView(userId, uuid, memberId, nodeId, shareId));
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
            DatasheetPermissionView permissionView = controlRole.permissionToBean(DatasheetPermissionView.class, feature);
            permissionView.setHasRole(true);
            permissionView.setUserId(userId);
            permissionView.setUuid(uuid);
            permissionView.setRole(controlRole.getRoleTag());
            permissionView.setIsGhostNode(controlRole.isGhostNode());
            // permission to get all fields of the data table
            FieldPermissionView fieldPermissionView = iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId);
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
    public boolean checkMemberIsAdmin(String spaceId, Long memberId, List<String> resourceGroupCodes) {
        if (CollUtil.isEmpty(resourceGroupCodes)) {
            resourceGroupCodes = SpaceResourceGroupCode.codes();
        }
        List<Long> memberAdminIds = iSpaceMemberRoleRelService.getMemberId(spaceId, resourceGroupCodes);
        Long adminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        if (adminMemberId != null) {
            memberAdminIds.add(adminMemberId);
        }
        return CollUtil.contains(memberAdminIds, memberId);
    }

    private DatasheetPermissionView getEmptyPermissionView(Long userId, String uuid, Long memberId, String nodeId, String shareId) {
        DatasheetPermissionView emptyPermissionView = new DatasheetPermissionView();
        emptyPermissionView.setUserId(userId);
        emptyPermissionView.setUuid(uuid);
        // permission to get all fields of the data table
        FieldPermissionView fieldPermissionView = iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId);
        if (fieldPermissionView != null) {
            emptyPermissionView.setDatasheetId(fieldPermissionView.getDatasheetId());
            emptyPermissionView.setFieldPermissionMap(fieldPermissionView.getFieldPermissionMap());
        }
        emptyPermissionView.setNodeId(nodeId);
        return emptyPermissionView;
    }

}
