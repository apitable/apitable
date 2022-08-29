package com.vikadata.api.modular.workspace.service.impl;

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

import com.vikadata.api.component.audit.AuditInfoField;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.enums.labs.LabsFeatureEnum;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.event.NodeShareDisableEvent;
import com.vikadata.api.holder.AuditFieldHolder;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.NodeShareInfoVO;
import com.vikadata.api.model.vo.node.NodeShareSettingInfoVO;
import com.vikadata.api.model.vo.node.NodeShareSettingPropsVO;
import com.vikadata.api.model.vo.node.NodeShareTree;
import com.vikadata.api.modular.labs.service.ILabsApplicantService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.model.NodeSharePropsDTO;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareService;
import com.vikadata.api.modular.workspace.service.INodeShareSettingService;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.IdUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.tree.DefaultTreeBuildFactory;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.LabsApplicantEntity;
import com.vikadata.entity.NodeEntity;
import com.vikadata.entity.NodeShareSettingEntity;
import com.vikadata.entity.SpaceEntity;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.NodeException.CLOSE_SHARE_ERROR;
import static com.vikadata.api.enums.exception.NodeException.NOT_ALLOW;
import static com.vikadata.api.enums.exception.NodeException.OPEN_SHARE_ERROR;
import static com.vikadata.api.enums.exception.NodeException.SHARE_EXPIRE;
import static com.vikadata.api.enums.exception.NodeException.SHARE_NODE_DISABLE_SAVE;
import static com.vikadata.api.enums.exception.NodeException.SHARE_NODE_STORE_FAIL;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_TOO_OFTEN;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * 节点分享 服务接口实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 19:55
 */
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
        log.info("获取节点分享设置信息");
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
            // 开启分享者
            String spaceId = nodeMapper.selectSpaceIdByNodeIdIncludeDeleted(nodeId);
            MemberDto dto = memberMapper.selectDtoByUserIdAndSpaceId(setting.getUpdatedBy(), spaceId);
            settingInfoVO.setShareOpenOperator(dto.getMemberName());
            // 获取分享者的节点权限
            ControlRoleDict roleDict = controlTemplate.fetchNodeRole(dto.getId(), Collections.singletonList(nodeId));
            if (roleDict.isEmpty()) {
                settingInfoVO.setOperatorHasPermission(false);
            }
            else {
                // 若开启了分享可编辑，校验分享者是否拥有节点可编辑或以上权限
                JSONObject props = JSONUtil.parseObj(setting.getProps());
                String roleCole = props.getBool("canBeEdited", false) ? Node.EDITOR : Node.READER;
                ControlRole requireRole = ControlRoleManager.parseNodeRole(roleCole);
                settingInfoVO.setOperatorHasPermission(roleDict.get(nodeId).isGreaterThanOrEqualTo(requireRole));
            }
        }
        // 查询关联表信息
        List<BaseNodeInfo> linkNodes = iNodeService.getForeignSheet(nodeId);
        if (CollUtil.isNotEmpty(linkNodes)) {
            settingInfoVO.setLinkNodes(CollUtil.getFieldValues(linkNodes, "nodeName", String.class));
        }
        // 查询分享的节点（包括子后代）是否包含了成员字段
        settingInfoVO.setContainMemberFld(iNodeService.judgeAllSubNodeContainMemberFld(nodeId));
        return settingInfoVO;
    }

    @Override
    public String updateShareSetting(Long userId, String nodeId, NodeSharePropsDTO props) {
        log.info("更改分享配置选项");
        JSONObject propsJson = JSONUtil.parseObj(props);
        // 只能存在一个参数
        if (propsJson.size() > 1) {
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        if (BooleanUtil.isFalse(propsJson.getBool(CollUtil.getFirst(propsJson.keySet())))) {
            // 传递参数只能存在一个为true
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        String lockKey = StrUtil.format(GENERAL_LOCKED, "node:share", nodeId);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
        Boolean result = ops.setIfAbsent("", 5, TimeUnit.SECONDS);
        ExceptionUtil.isTrue(BooleanUtil.isTrue(result), INVITE_TOO_OFTEN);
        // 查询节点分享设置,前提是已设置开启
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
            // 节点校验，仪表盘不允许单独分享
            NodeType nodeType = iNodeService.getTypeByNodeId(nodeId);
            ExceptionUtil.isFalse(nodeType.equals(NodeType.ROOT), NOT_ALLOW);
            ExceptionUtil.isFalse(nodeType.equals(NodeType.DASHBOARD), OPEN_SHARE_ERROR);
            // 开启分享，设置新的分享链接
            setting = new NodeShareSettingEntity();
            setting.setNodeId(nodeId);
            setting.setShareId(IdUtil.createShareId());
        }
        // 设置选项
        setting.setProps(propsJson.toString());
        setting.setIsEnabled(true);
        setting.setUpdatedBy(userId);
        boolean flag = iNodeShareSettingService.saveOrUpdate(setting);
        ExceptionUtil.isTrue(flag, OPEN_SHARE_ERROR);
        redisTemplate.delete(lockKey);
        // 发布空间审计事件
        info.set(AuditConstants.SHARE_ID, setting.getShareId());
        AuditSpaceArg arg = AuditSpaceArg.builder().action(action).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return setting.getShareId();
    }

    @Override
    public NodeShareInfoVO getNodeShareInfo(String shareId) {
        log.info("获取节点分享信息");
        NodeShareInfoVO nodeShareInfoVo = new NodeShareInfoVO();
        // 查找分享设置信息，不存在则失效
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByShareId(shareId);
        ExceptionUtil.isTrue(setting != null && setting.getIsEnabled(), SHARE_EXPIRE);
        // 设置
        nodeShareInfoVo.setShareId(shareId);
        // 查找节点是否存在
        NodeEntity node = nodeMapper.selectByNodeId(setting.getNodeId());
        ExceptionUtil.isNotNull(node, SHARE_EXPIRE);
        // 校验是否是根节点，保证分享准确
        ExceptionUtil.isTrue(node.getType() != NodeType.ROOT.getNodeType(), SHARE_EXPIRE);
        // 设置
        nodeShareInfoVo.setSpaceId(node.getSpaceId());
        // 校验空间是否已删除
        SpaceEntity space = spaceMapper.selectBySpaceId(node.getSpaceId());
        ExceptionUtil.isFalse(Objects.isNull(space) || !Objects.isNull(space.getPreDeletionTime()), SHARE_EXPIRE);
        SpaceGlobalFeature feature = JSONUtil.toBean(space.getProps(), SpaceGlobalFeature.class);
        // 如果关闭『允许分享文件』，则失效已公开的链接
        Boolean fileSharable = feature.getFileSharable();
        ExceptionUtil.isTrue(Objects.isNull(fileSharable) || fileSharable, SHARE_EXPIRE);
        // 设置
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
        // 实验性功能
        // 目前只有一个，直接查询单个，后面有了多个需求，扩展一下
        LabsApplicantEntity spaceLabs = iLabsApplicantService.getApplicantByApplicantAndFeatureKey(node.getSpaceId(), LabsFeatureEnum.VIEW_MANUAL_SAVE.name());
        nodeShareInfoVo.setFeatureViewManualSave(Objects.nonNull(spaceLabs));

        if (!JSONUtil.isNull(setting.getProps())) {
            JSONObject props = JSONUtil.parseObj(setting.getProps());
            nodeShareInfoVo.setAllowSaved(props.getBool("canBeStored", false));
            nodeShareInfoVo.setAllowEdit(props.getBool("canBeEdited", false));
        }
        // 获取最后的操作者，判断是否不存在
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(setting.getUpdatedBy(), node.getSpaceId());
        ExceptionUtil.isNotNull(memberId, SHARE_EXPIRE);
        MemberDto member = memberMapper.selectDtoByMemberId(memberId);
        nodeShareInfoVo.setLastModifiedBy(member.getMemberName());
        nodeShareInfoVo.setLastModifiedAvatar(member.getAvatar());
        nodeShareInfoVo.setHasLogin(HttpContextUtil.hasSession());
        // 如果是目录节点，查询分享者的权限，排除没有权限的子节点
        List<String> nodeIds = CollUtil.newArrayList(node.getNodeId());
        boolean hasChildren = nodeMapper.selectHasChildren(node.getNodeId());
        nodeShareInfoVo.setIsFolder(hasChildren);
        if (hasChildren) {
            List<String> subNodeIds = nodeMapper.selectSubNodesByOrder(node.getSpaceId(), node.getNodeId(), 0);
            if (CollUtil.isNotEmpty(subNodeIds)) {
                nodeIds.addAll(subNodeIds);
            }
        }

        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, nodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), SHARE_EXPIRE);
        // 过滤节点，若允许他人编辑，需可编辑以上权限，节点才可以展示，否则仅需要可查看权限
        ControlRole requireRole = ControlRoleManager.parseNodeRole(nodeShareInfoVo.getAllowEdit() ? Node.EDITOR : Node.READER);
        List<String> filterNodeIds = roleDict.entrySet().stream()
                .filter(entry -> entry.getValue().isGreaterThanOrEqualTo(requireRole))
                .map(Map.Entry::getKey).collect(Collectors.toList());
        ExceptionUtil.isNotEmpty(filterNodeIds, SHARE_EXPIRE);
        // 查询分享节点树
        List<NodeShareTree> list = nodeMapper.selectShareTree(filterNodeIds);
        // 节点切换成内存自定义排序
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
        ExceptionUtil.isTrue(setting != null && setting.getIsEnabled(), SHARE_EXPIRE);
    }

    @Override
    public void checkNodeHasShare(String dstId) {
        log.info("检查数表是否分享");
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
        log.info("关闭节点分享");
        NodeShareSettingEntity setting = nodeShareSettingMapper.selectByNodeId(nodeId);
        ExceptionUtil.isNotNull(setting, CLOSE_SHARE_ERROR);
        JSONObject oldProps = JSONUtil.parseObj(setting.getProps());
        setting.setIsEnabled(false);
        setting.setProps(JSONUtil.createObj().toString());
        setting.setUpdatedBy(userId);
        boolean flag = iNodeShareSettingService.updateById(setting);
        ExceptionUtil.isTrue(flag, CLOSE_SHARE_ERROR);
        // 发布节点分享关闭事件
        SpringContextHolder.getApplicationContext().publishEvent(new NodeShareDisableEvent(this, Collections.singletonList(nodeId)));
        // 发布空间审计事件
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
            ExceptionUtil.isTrue(res > 0, CLOSE_SHARE_ERROR);
            // 发布节点分享关闭事件
            SpringContextHolder.getApplicationContext().publishEvent(new NodeShareDisableEvent(this, nodeIds));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String storeShareData(Long userId, String spaceId, String shareId) {
        log.info("转存分享节点");
        NodeShareSettingEntity nodeSetting = nodeShareSettingMapper.selectByShareId(shareId);
        ExceptionUtil.isNotNull(nodeSetting, SHARE_NODE_STORE_FAIL);
        ExceptionUtil.isTrue(!JSONUtil.isNull(nodeSetting.getProps()) && JSONUtil.parseObj(nodeSetting.getProps()).getBool("canBeStored", false), SHARE_NODE_DISABLE_SAVE);
        // 查询分享所在的空间
        String nodeSpaceId = nodeMapper.selectSpaceIdByNodeId(nodeSetting.getNodeId());
        ExceptionUtil.isNotNull(nodeSpaceId, SHARE_EXPIRE);
        // 获取最后的操作者，判断是否不存在
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(nodeSetting.getUpdatedBy(), nodeSpaceId);
        ExceptionUtil.isNotNull(memberId, SHARE_EXPIRE);
        // 获取节点及子后代的节点ID
        List<String> nodeIds = nodeMapper.selectBatchAllSubNodeIds(Collections.singletonList(nodeSetting.getNodeId()), false);
        // 过滤节点要求的权限，同步分享节点树的展示逻辑
        ControlRoleDict roleDict = controlTemplate.fetchShareNodeTree(memberId, nodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), SHARE_EXPIRE);
        NodeCopyOptions options = NodeCopyOptions.builder().copyData(true).verifyNodeCount(true).filterPermissionField(true).build();
        if (roleDict.keySet().size() != nodeIds.size()) {
            List<String> filterNodeIds = CollUtil.subtractToList(nodeIds, roleDict.keySet());
            options.setFilterNodeIds(filterNodeIds);
        }
        // 审计变量，记录变更值
        AuditFieldHolder.set(AuditInfoField.builder().sourceNodeId(nodeSetting.getNodeId()).build());
        return iNodeService.copyNodeToSpace(userId, spaceId, null, nodeSetting.getNodeId(), options);
    }

    @Override
    public Optional<String> getNodeNameByShareId(String shareId) {
        String nodeId = nodeShareSettingMapper.selectNodeIdByShareId(shareId);
        String nodeName = nodeMapper.selectNodeNameByNodeId(nodeId);
        return Optional.ofNullable(nodeName);
    }


}
