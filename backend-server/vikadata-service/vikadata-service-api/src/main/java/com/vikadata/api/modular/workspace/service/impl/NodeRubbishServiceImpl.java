package com.vikadata.api.modular.workspace.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.RubbishNodeVo;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.space.service.ISpaceAssetService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeRubbishService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.enums.NodeType;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.BillingException.PLAN_FEATURE_OVER_LIMIT;
import static com.vikadata.api.enums.exception.NodeException.RUBBISH_NODE_NOT_EXIST;

/**
 * <p>
 * 工作台-节点回收舱 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2021/9/14
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
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private IControlService iControlService;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private LimitProperties limitProperties;

    @Override
    public List<RubbishNodeVo> getRubbishNodeList(String spaceId, Long memberId, Integer size, String lastNodeId, Boolean isOverLimit) {
        log.info("空间「{}」的成员「{}」获取回收舱的节点列表，已加载列表中最后一个节点的ID:「{}」", memberId, spaceId, lastNodeId);

        boolean allowOverLimit = isOverLimit && Boolean.TRUE.equals(limitProperties.getIsAllowOverLimit());

        // 获取空间订阅计划的对应回收舱最大保存天数
        long subscriptionRemainDays = iSpaceSubscriptionService.getPlanTrashRemainDays(spaceId);
        long retainDay = allowOverLimit ? limitProperties.getRubbishMaxRetainDay() : subscriptionRemainDays;
        // 倒推开始时间（不包含）
        LocalDateTime beginTime = LocalDateTime.of(LocalDate.now().minusDays(retainDay), LocalTime.MAX);
        LocalDateTime endTime = null;

        // 若非首次加载，判断已加载列表中最后一个节点的ID，是否超过订阅计划的保存天数
        if (StrUtil.isNotBlank(lastNodeId)) {
            LocalDateTime rubbishUpdatedAt = nodeMapper.selectRubbishUpdatedAtByNodeId(lastNodeId);
            // 若最后一个节点不在回收舱（被恢复或彻底删除），定位失效，返回异常业务状态码，客户端可取上一个末位的节点重新请求
            ExceptionUtil.isNotNull(rubbishUpdatedAt, RUBBISH_NODE_NOT_EXIST);
            // 不可加载超过阅计划的保存天数
            if (rubbishUpdatedAt.compareTo(beginTime) <= 0) {
                return new ArrayList<>();
            }
            endTime = rubbishUpdatedAt;
        }
        while (true) {
            // 查询回收舱节点ID（修改时间倒序）
            List<String> rubbishNodeIds = nodeMapper.selectRubbishNodeIds(spaceId, size, beginTime, endTime);
            if (rubbishNodeIds.isEmpty()) {
                return new ArrayList<>();
            }
            // 获取节点权限
            ControlRoleDict roleDict = controlTemplate.fetchRubbishNodeRole(memberId, rubbishNodeIds);
            if (!roleDict.isEmpty()) {
                // 过滤权限不符的节点
                List<String> rubbishNodeIdsAfterFilter = roleDict.entrySet().stream()
                        .filter(entry -> entry.getValue().isGreaterThanOrEqualTo(ControlRoleManager.parseNodeRole(Node.MANAGER)))
                        .map(Map.Entry::getKey).collect(Collectors.toList());
                if (CollUtil.isNotEmpty(rubbishNodeIdsAfterFilter)) {
                    return nodeMapper.selectRubbishNodeInfo(spaceId, rubbishNodeIdsAfterFilter, subscriptionRemainDays);
                }
            }
            // 均无权限，若节点的数量少于期望加载数量，说明已经加载到底了，结束返回；否则取新的末位节点修改时间为结束时间，再次向前（时间线）加载
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
        log.info("用户「{}」恢复回收舱的节点「{}」到父节点「{}」下", userId, nodeId, parentId);
        // 获取节点及子后代的节点ID
        List<String> subNodeIds = nodeMapper.selectBatchAllSubNodeIds(Collections.singletonList(nodeId), true);
        if (CollUtil.isNotEmpty(subNodeIds)) {
            // 恢复数表
            iDatasheetService.updateIsDeletedStatus(userId, subNodeIds, false);
            // 恢复节点的空间附件资源
            iSpaceAssetService.updateIsDeletedByNodeIds(subNodeIds, false);
            // 仅恢复子节点，原节点交由恢复节点信息方法
            if (subNodeIds.size() > 1) {
                subNodeIds.remove(nodeId);
                boolean flag = SqlHelper.retBool(nodeMapper.updateIsRubbishByNodeIdIn(userId, subNodeIds, false));
                ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
            }
        }
        // 修改原父节点下的第一个节点的前置节点ID
        nodeMapper.updatePreNodeIdBySelf(nodeId, null, parentId);
        // 同级重复名称修改
        BaseNodeInfo nodeInfo = nodeMapper.selectBaseNodeInfoByNodeId(nodeId);
        String name = iNodeService.duplicateNameModify(parentId, nodeInfo.getType(), nodeInfo.getNodeName(), null);
        // 修改恢复节点的信息
        boolean flag = SqlHelper.retBool(nodeMapper.updateInfoByNodeId(nodeId, parentId, null, name));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void delRubbishNode(Long userId, String nodeId) {
        log.info("用户「{}」彻底删除回收舱的节点「{}」", userId, nodeId);
        // 获取节点及子后代的节点ID
        List<String> subNodeIds = nodeMapper.selectBatchAllSubNodeIds(Collections.singletonList(nodeId), true);
        // 逻辑删除节点
        boolean flag = SqlHelper.retBool(nodeMapper.updateIsDeletedByNodeId(userId, nodeId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        if (CollUtil.isEmpty(subNodeIds)) {
            return;
        }
        TaskManager.me().execute(() -> {
            // 删除节点的所有角色
            iNodeRoleService.deleteByNodeId(userId, subNodeIds);
            // 清空删除的维格表的字段权限
            List<NodeBaseInfoDTO> baseNodeInfos = nodeMapper.selectBaseNodeInfoByNodeIdsIncludeDelete(subNodeIds);
            baseNodeInfos.stream().filter(info -> NodeType.toEnum(info.getType()).equals(NodeType.DATASHEET))
                    .forEach(info -> {
                        List<String> controlIds = iControlService.getControlIdByControlIdPrefixAndType(info.getNodeId(),
                                ControlType.DATASHEET_FIELD.getVal());
                        if (CollUtil.isNotEmpty(controlIds)) {
                            // 关闭字段权限
                            iControlService.removeControl(userId, controlIds, true);
                        }
                    });
        });
    }

    @Override
    public void checkRubbishNode(String spaceId, Long memberId, String nodeId) {
        log.info("检查回收舱节点「{}」是否存在、成员「{}」是否有权限", nodeId, memberId);
        // 查询回收舱节点的修改时间，判断是否存在
        LocalDateTime rubbishUpdatedAt = nodeMapper.selectRubbishUpdatedAtByNodeId(nodeId);
        ExceptionUtil.isNotNull(rubbishUpdatedAt, RUBBISH_NODE_NOT_EXIST);

        // 获取空间订阅计划的对应回收舱最大保存天数
        long retainDay = Boolean.TRUE.equals(limitProperties.getIsAllowOverLimit()) ?
                limitProperties.getRubbishMaxRetainDay() : iSpaceSubscriptionService.getPlanTrashRemainDays(spaceId);
        // 订阅功能限制校验
        ExceptionUtil.isTrue(rubbishUpdatedAt.isAfter(LocalDateTime.of(LocalDate.now().minusDays(retainDay), LocalTime.MAX)), PLAN_FEATURE_OVER_LIMIT);

        // 校验节点权限
        ControlRoleDict roleDict = controlTemplate.fetchRubbishNodeRole(memberId, Collections.singletonList(nodeId));
        ExceptionUtil.isFalse(roleDict.isEmpty() ||
                roleDict.get(nodeId).isLessThan(ControlRoleManager.parseNodeRole(Node.MANAGER)), PermissionException.NODE_OPERATION_DENIED);
    }
}
