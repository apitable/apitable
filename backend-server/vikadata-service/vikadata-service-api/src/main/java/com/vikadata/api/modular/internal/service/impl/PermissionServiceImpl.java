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
 * <p>
 * Permission Service Implements
 * </p>
 *
 * @author Chambers
 * @date 2021/12/14
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
        // 判断节点是否都属于模板（仅部分是模板触发异常）
        Boolean isTemplate = iNodeService.getIsTemplateByNodeIds(nodeIds);
        List<DatasheetPermissionView> views = new ArrayList<>(nodeIds.size());
        String uuid = iUserService.getUuidByUserId(userId);
        // 模版权限直接返回
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
        // 获取空间ID（多个空间触发异常）
        String spaceId = iNodeService.getSpaceIdByNodeIds(nodeIds);
        // 在分享中加载节点权限时，以分享设置最后的变更人的权限为准，方法包含判断变更人是否存在
        Long owner = StrUtil.isNotBlank(shareId) ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : userId;
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(owner, spaceId);
        // 非空间站的成员
        if (memberId == null) {
            for (String nodeId : nodeIds) {
                views.add(this.getEmptyPermissionView(userId, uuid, memberId, nodeId, shareId));
            }
            return views;
        }
        // 加载节点权限集
        ControlRoleDict roleDict = controlTemplate.fetchInternalNodeRole(memberId, nodeIds);
        // 节点均无权限则返回空权限集
        if (roleDict.isEmpty()) {
            for (String nodeId : nodeIds) {
                views.add(this.getEmptyPermissionView(userId, uuid, memberId, nodeId, shareId));
            }
            return views;
        }
        // 获取空间全局属性
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        // 获取星标节点ID
        List<String> favoriteNodeIds = iNodeFavoriteService.getFavoriteNodeIdsByMemberId(memberId);
        for (String nodeId : nodeIds) {
            if (!roleDict.containsKey(nodeId)) {
                // 无节点权限则返回空权限集
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
            // 获取数表所有字段的权限
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
        // 获取数表所有字段的权限
        FieldPermissionView fieldPermissionView = iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId);
        if (fieldPermissionView != null) {
            emptyPermissionView.setDatasheetId(fieldPermissionView.getDatasheetId());
            emptyPermissionView.setFieldPermissionMap(fieldPermissionView.getFieldPermissionMap());
        }
        emptyPermissionView.setNodeId(nodeId);
        return emptyPermissionView;
    }

}
