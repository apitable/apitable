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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.base.enums.ParameterException;
import com.apitable.space.enums.LabsFeatureEnum;
import com.apitable.space.service.ILabsApplicantService;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.listener.event.NodeShareDisableEvent;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.NodeShareInfoVO;
import com.apitable.workspace.vo.NodeShareSettingInfoVO;
import com.apitable.workspace.vo.NodeShareSettingPropsVO;
import com.apitable.workspace.vo.NodeShareTree;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import com.apitable.workspace.dto.MemberInfoDTO;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.dto.NodeSharePropsDTO;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareService;
import com.apitable.workspace.service.INodeShareSettingService;
import com.apitable.shared.util.CollectionUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.enums.NodeType;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.space.entity.LabsApplicantEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.entity.NodeShareSettingEntity;
import com.apitable.space.entity.SpaceEntity;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.apitable.organization.enums.OrganizationException.INVITE_TOO_OFTEN;
import static com.apitable.core.constants.RedisConstants.GENERAL_LOCKED;

@Service
@Slf4j
public class NodeShareServiceImpl implements INodeShareService {

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private INodeShareSettingService iNodeShareSettingService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ILabsApplicantService iLabsApplicantService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public NodeShareSettingInfoVO getNodeShareSettings(String nodeId) {
        log.info("Obtain node sharing settings");
        NodeShareSettingInfoVO settingInfoVO = new NodeShareSettingInfoVO();
        NodeBaseInfoDTO baseNodeInfo = nodeMapper.selectNodeBaseInfoByNodeId(nodeId);
        settingInfoVO.setNodeId(baseNodeInfo.getNodeId());
        settingInfoVO.setNodeName(baseNodeInfo.getNodeName());
        settingInfoVO.setNodeIcon(baseNodeInfo.getIcon());
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByNodeId(nodeId);
        if (setting != null && setting.getIsEnabled()) {
            settingInfoVO.setShareId(setting.getShareId());
            settingInfoVO.setShareOpened(true);
            settingInfoVO.setProps(JSONUtil.toBean(setting.getProps(), NodeShareSettingPropsVO.class));
            // turn on sharers
            String spaceId = nodeMapper.selectSpaceIdByNodeIdIncludeDeleted(nodeId);
            MemberDTO dto = memberMapper.selectDtoByUserIdAndSpaceId(setting.getUpdatedBy(), spaceId);
            // compatible member no longer in space station
            if (dto == null) {
                settingInfoVO.setOperatorHasPermission(false);
                return settingInfoVO;
            }
            settingInfoVO.setShareOpenOperator(dto.getMemberName());
            // Obtain the node permissions of the sharer
            ControlRoleDict roleDict = controlTemplate.fetchNodeRole(dto.getId(), Collections.singletonList(nodeId));
            if (roleDict.isEmpty()) {
                settingInfoVO.setOperatorHasPermission(false);
            }
            else {
                // If sharing editable is enabled, check whether the sharer has node editable or above permissions.
                JSONObject props = JSONUtil.parseObj(setting.getProps());
                String roleCole = props.getBool("canBeEdited", false) ? Node.EDITOR : Node.READER;
                ControlRole requireRole = ControlRoleManager.parseNodeRole(roleCole);
                settingInfoVO.setOperatorHasPermission(roleDict.get(nodeId).isGreaterThanOrEqualTo(requireRole));
            }
        }
        // Query association table information
        List<BaseNodeInfo> linkNodes = iNodeService.getForeignSheet(nodeId);
        if (CollUtil.isNotEmpty(linkNodes)) {
            settingInfoVO.setLinkNodes(CollUtil.getFieldValues(linkNodes, "nodeName", String.class));
        }
        // Query whether the shared node (including child descendants) contains member fields
        settingInfoVO.setContainMemberFld(iNodeService.judgeAllSubNodeContainMemberFld(nodeId));
        return settingInfoVO;
    }

    @Override
    public String updateShareSetting(Long userId, String nodeId, NodeSharePropsDTO props) {
        log.info("Change sharing configuration options");
        JSONObject propsJson = JSONUtil.parseObj(props);
        // There can only be one parameter
        if (propsJson.size() > 1) {
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        if (BooleanUtil.isFalse(propsJson.getBool(CollUtil.getFirst(propsJson.keySet())))) {
            // Only one pass parameter can exist as true
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        String lockKey = StrUtil.format(GENERAL_LOCKED, "node:share", nodeId);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
        Boolean result = ops.setIfAbsent("", 5, TimeUnit.SECONDS);
        ExceptionUtil.isTrue(BooleanUtil.isTrue(result), INVITE_TOO_OFTEN);
        // Query node sharing settings, provided that it is enabled
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByNodeId(nodeId);
        AuditSpaceAction action = AuditSpaceAction.UPDATE_NODE_SHARE_SETTING;
        JSONObject info = JSONUtil.createObj();
        if (setting == null || Boolean.FALSE.equals(setting.getIsEnabled())) {
            action = AuditSpaceAction.ENABLE_NODE_SHARE;
        }
        else {
            info.set(AuditConstants.OLD_SHARE_PROPS, JSONUtil.parseObj(setting.getProps()));
            info.set(AuditConstants.SHARE_PROPS, propsJson);
        }
        if (setting == null) {
            // Node verification. Dashboards are not allowed to be shared separately.
            NodeType nodeType = iNodeService.getTypeByNodeId(nodeId);
            ExceptionUtil.isFalse(nodeType.equals(NodeType.ROOT), NodeException.NOT_ALLOW);
            ExceptionUtil.isFalse(nodeType.equals(NodeType.DASHBOARD), NodeException.OPEN_SHARE_ERROR);
            // Open sharing and set up a new sharing link
            setting = new NodeShareSettingEntity();
            setting.setNodeId(nodeId);
            setting.setShareId(IdUtil.createShareId());
        }
        // Setting options
        setting.setProps(propsJson.toString());
        setting.setIsEnabled(true);
        setting.setUpdatedBy(userId);
        boolean flag = iNodeShareSettingService.saveOrUpdate(setting);
        ExceptionUtil.isTrue(flag, NodeException.OPEN_SHARE_ERROR);
        redisTemplate.delete(lockKey);
        // Publish Space Audit Events
        info.set(AuditConstants.SHARE_ID, setting.getShareId());
        AuditSpaceArg arg = AuditSpaceArg.builder().action(action).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return setting.getShareId();
    }

    @Override
    public NodeShareInfoVO getNodeShareInfo(String shareId) {
        log.info("Obtain node sharing information");
        NodeShareInfoVO nodeShareInfoVo = new NodeShareInfoVO();
        // Find the sharing setting information, if it does not exist, it will be invalid.
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByShareId(shareId);
        ExceptionUtil.isTrue(setting != null && setting.getIsEnabled(), NodeException.SHARE_EXPIRE);
        // settings
        nodeShareInfoVo.setShareId(shareId);
        // find if a node exists
        NodeEntity node = nodeMapper.selectByNodeId(setting.getNodeId());
        ExceptionUtil.isNotNull(node, NodeException.SHARE_EXPIRE);
        // Check whether it is the root node to ensure accurate sharing.
        ExceptionUtil.isTrue(node.getType() != NodeType.ROOT.getNodeType(), NodeException.SHARE_EXPIRE);
        // settings
        nodeShareInfoVo.setSpaceId(node.getSpaceId());
        // Check whether the space has been deleted
        SpaceEntity space = spaceMapper.selectBySpaceId(node.getSpaceId());
        ExceptionUtil.isFalse(Objects.isNull(space) || !Objects.isNull(space.getPreDeletionTime()), NodeException.SHARE_EXPIRE);
        SpaceGlobalFeature feature = JSONUtil.toBean(space.getProps(), SpaceGlobalFeature.class);
        // If "Allow file sharing" is closed, the public link will become invalid
        Boolean fileSharable = feature.getFileSharable();
        ExceptionUtil.isTrue(Objects.isNull(fileSharable) || fileSharable, NodeException.SHARE_EXPIRE);
        // settings
        Boolean allowApply = feature.getJoinable();
        nodeShareInfoVo.setAllowApply(allowApply);
        Boolean allowCopyDataToExternal = feature.getAllowCopyDataToExternal();
        nodeShareInfoVo.setAllowCopyDataToExternal(Objects.isNull(allowCopyDataToExternal) || allowCopyDataToExternal);
        Boolean allowDownloadAttachment = feature.getAllowDownloadAttachment();
        nodeShareInfoVo.setAllowDownloadAttachment(Objects.isNull(allowDownloadAttachment) || allowDownloadAttachment);
        nodeShareInfoVo.setSpaceName(space.getName());
        nodeShareInfoVo.setShareNodeId(setting.getNodeId());
        nodeShareInfoVo.setShareNodeName(node.getNodeName());
        nodeShareInfoVo.setShareNodeType(node.getType());
        nodeShareInfoVo.setShareNodeIcon(node.getIcon());
        // laboratory feature
        // At present, there is only one, which directly queries a single one, and there are multiple requirements behind it. Expand it
        LabsApplicantEntity spaceLabs = iLabsApplicantService.getApplicantByApplicantAndFeatureKey(node.getSpaceId(), LabsFeatureEnum.VIEW_MANUAL_SAVE.name());
        nodeShareInfoVo.setFeatureViewManualSave(Objects.nonNull(spaceLabs));

        if (!JSONUtil.isNull(setting.getProps())) {
            JSONObject props = JSONUtil.parseObj(setting.getProps());
            nodeShareInfoVo.setAllowSaved(props.getBool("canBeStored", false));
            nodeShareInfoVo.setAllowEdit(props.getBool("canBeEdited", false));
        }
        // Get the last operator info
        MemberInfoDTO memberInfo = memberMapper.selectIdByUserIdAndSpaceIdExcludeDelete(setting.getUpdatedBy(), node.getSpaceId());
        ExceptionUtil.isNotNull(memberInfo, NodeException.SHARE_EXPIRE);
        nodeShareInfoVo.setIsDeleted(memberInfo.getIsDeleted());
        MemberDTO member = memberMapper.selectDtoByMemberId(memberInfo.getId());
        nodeShareInfoVo.setLastModifiedBy(member.getMemberName());
        nodeShareInfoVo.setLastModifiedAvatar(member.getAvatar());
        nodeShareInfoVo.setHasLogin(HttpContextUtil.hasSession());
        // If it is a directory node, query the permissions of the sharer and exclude child nodes without permissions.
        List<String> nodeIds = CollUtil.newArrayList(node.getNodeId());
        boolean hasChildren = nodeMapper.selectHasChildren(node.getNodeId());
        nodeShareInfoVo.setIsFolder(hasChildren);
        if (hasChildren) {
            List<String> subNodeIds = nodeMapper.selectSubNodesByOrder(node.getSpaceId(), node.getNodeId(), 0);
            if (CollUtil.isNotEmpty(subNodeIds)) {
                nodeIds.addAll(subNodeIds);
            }
        }

        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberInfo.getId(), nodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), NodeException.SHARE_EXPIRE);
        // Filter nodes. If you allow others to edit the nodes, you need to edit the above permissions before you can display the nodes. Otherwise, you only need to view the permissions.
        ControlRole requireRole = ControlRoleManager.parseNodeRole(nodeShareInfoVo.getAllowEdit() ? Node.EDITOR : Node.READER);
        List<String> filterNodeIds = roleDict.entrySet().stream()
                .filter(entry -> entry.getValue().isGreaterThanOrEqualTo(requireRole))
                .map(Map.Entry::getKey).collect(Collectors.toList());
        ExceptionUtil.isNotEmpty(filterNodeIds, NodeException.SHARE_EXPIRE);
        // query sharing node tree
        List<NodeShareTree> list = nodeMapper.selectShareTree(filterNodeIds);
        // node switches to memory custom sort
        CollectionUtil.customSequenceSort(list, NodeShareTree::getNodeId, new ArrayList<>(filterNodeIds));
        List<NodeShareTree> treeList = new DefaultTreeBuildFactory<NodeShareTree>(node.getNodeId()).doTreeBuild(list);
        nodeShareInfoVo.setNodeTree(treeList);
        NodeShareTree nodeTree = new NodeShareTree();
        nodeTree.setNodeId(node.getNodeId());
        nodeTree.setNodeName(node.getNodeName());
        nodeTree.setType(node.getType());
        nodeTree.setIcon(node.getIcon());
        nodeTree.setChildren(treeList);
        nodeShareInfoVo.setShareNodeTree(nodeTree);
        return nodeShareInfoVo;
    }

    @Override
    public void checkShareIfExist(String shareId) {
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByShareId(shareId);
        ExceptionUtil.isTrue(setting != null && setting.getIsEnabled(), NodeException.SHARE_EXPIRE);
    }

    @Override
    public void checkNodeHasShare(String dstId) {
        log.info("Check whether the number table is shared");
        List<String> nodes = iNodeService.getPathParentNode(dstId);
        boolean hasShare = false;
        for (String node : nodes) {
            NodeShareSettingEntity setting = nodeShareSettingMapper.selectByNodeId(node);
            if (setting != null && setting.getIsEnabled()) {
                hasShare = true;
                break;
            }
        }
        ExceptionUtil.isTrue(hasShare, PermissionException.NODE_ACCESS_DENIED);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disableNodeShare(Long userId, String nodeId) {
        log.info("Turn off node sharing");
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByNodeId(nodeId);
        ExceptionUtil.isNotNull(setting, NodeException.CLOSE_SHARE_ERROR);
        JSONObject oldProps = JSONUtil.parseObj(setting.getProps());
        setting.setIsEnabled(false);
        setting.setProps(JSONUtil.createObj().toString());
        setting.setUpdatedBy(userId);
        boolean flag = iNodeShareSettingService.updateById(setting);
        ExceptionUtil.isTrue(flag, NodeException.CLOSE_SHARE_ERROR);
        // Publish node sharing shutdown event
        SpringContextHolder.getApplicationContext().publishEvent(new NodeShareDisableEvent(this, Collections.singletonList(nodeId)));
        // Publish Space Audit Events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.SHARE_ID, setting.getShareId());
        info.set(AuditConstants.OLD_SHARE_PROPS, oldProps);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DISABLE_NODE_SHARE).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disableNodeSharesByUserId(Long userId) {
        List<NodeShareSettingEntity> nodeShareSettings = nodeShareSettingMapper.selectEnabledByUserId(userId);
        List<String> nodeIds = nodeShareSettings.stream().map(setting -> setting.getNodeId()).collect(Collectors.toList());
        if (nodeIds.size() > 0) {
            int res = nodeShareSettingMapper.disableByNodeIds(nodeIds);
            ExceptionUtil.isTrue(res > 0, NodeException.CLOSE_SHARE_ERROR);
            // Publish node sharing shutdown event
            SpringContextHolder.getApplicationContext().publishEvent(new NodeShareDisableEvent(this, nodeIds));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String storeShareData(Long userId, String spaceId, String shareId) {
        log.info("Transfer sharing node");
        NodeShareSettingEntity nodeSetting = nodeShareSettingMapper.selectByShareId(shareId);
        ExceptionUtil.isNotNull(nodeSetting, NodeException.SHARE_NODE_STORE_FAIL);
        ExceptionUtil.isTrue(!JSONUtil.isNull(nodeSetting.getProps()) && JSONUtil.parseObj(nodeSetting.getProps()).getBool("canBeStored", false), NodeException.SHARE_NODE_DISABLE_SAVE);
        // Query the space where the sharing is located
        String nodeSpaceId = nodeMapper.selectSpaceIdByNodeId(nodeSetting.getNodeId());
        ExceptionUtil.isNotNull(nodeSpaceId, NodeException.SHARE_EXPIRE);
        // Get the last operator to determine if it does not exist.
        MemberInfoDTO member = memberMapper.selectIdByUserIdAndSpaceIdExcludeDelete(nodeSetting.getUpdatedBy(), nodeSpaceId);
        ExceptionUtil.isNotNull(member.getId(), NodeException.SHARE_EXPIRE);
        // Obtain the node ID of the node and its child descendants.
        List<String> nodeIds = nodeMapper.selectBatchAllSubNodeIds(Collections.singletonList(nodeSetting.getNodeId()), false);
        // Filter the required permissions of the node and share the display logic of the node tree synchronously.
        ControlRoleDict roleDict = controlTemplate.fetchShareNodeTree(member.getId(), nodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), NodeException.SHARE_EXPIRE);
        NodeCopyOptions options = NodeCopyOptions.builder().copyData(true).verifyNodeCount(true).filterPermissionField(true).build();
        if (roleDict.keySet().size() != nodeIds.size()) {
            List<String> filterNodeIds = CollUtil.subtractToList(nodeIds, roleDict.keySet());
            options.setFilterNodeIds(filterNodeIds);
        }
        return iNodeService.copyNodeToSpace(userId, spaceId, null, nodeSetting.getNodeId(), options);
    }

    @Override
    public Optional<String> getNodeNameByShareId(String shareId) {
        String nodeId = nodeShareSettingMapper.selectNodeIdByShareId(shareId);
        String nodeName = nodeMapper.selectNodeNameByNodeId(nodeId);
        return Optional.ofNullable(nodeName);
    }
}
