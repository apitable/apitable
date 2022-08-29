package com.vikadata.api.modular.workspace.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.vo.node.FavoriteNodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.modular.workspace.mapper.NodeFavoriteMapper;
import com.vikadata.api.modular.workspace.service.INodeFavoriteService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.NodeFavoriteEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.NodeException.FAVORITE_NODE_NOT_EXIST;
import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * 节点收藏表 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/9/1
 */
@Slf4j
@Service
public class NodeFavoriteServiceImpl implements INodeFavoriteService {

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private NodeFavoriteMapper nodeFavoriteMapper;

    @Override
    public List<String> getFavoriteNodeIdsByMemberId(Long memberId) {
        return nodeFavoriteMapper.selectNodeIdByMemberId(memberId);
    }

    @Override
    public List<FavoriteNodeInfo> getFavoriteNodeList(String spaceId, Long memberId) {
        log.info("获取收藏的节点列表");
        List<String> nodeIds = nodeFavoriteMapper.selectOrderNodeIdByMemberId(memberId);
        if (CollUtil.isEmpty(nodeIds)) {
            return new ArrayList<>();
        }
        // 查询节点视图信息
        List<NodeInfoVo> nodeInfoVos = iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        if (CollUtil.isEmpty(nodeInfoVos)) {
            return new ArrayList<>();
        }
        // 输出收藏节点的顺序
        Map<String, String> nodeIdToPreNodeIdMap = new HashMap<>(nodeIds.size() - 1);
        for (int i = 1; i < nodeIds.size(); i++) {
            nodeIdToPreNodeIdMap.put(nodeIds.get(i), nodeIds.get(i - 1));
        }
        List<FavoriteNodeInfo> infos = new ArrayList<>(nodeInfoVos.size());
        nodeInfoVos.forEach(vo -> {
            FavoriteNodeInfo info = new FavoriteNodeInfo();
            BeanUtil.copyProperties(vo, info);
            info.setPreFavoriteNodeId(nodeIdToPreNodeIdMap.get(vo.getNodeId()));
            infos.add(info);
        });
        return infos;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void move(Long memberId, String nodeId, String preNodeId) {
        log.info("移动收藏节点的位置");
        List<String> nodeIds = nodeFavoriteMapper.selectNodeIdByMemberId(memberId);
        ExceptionUtil.isTrue(nodeIds.contains(nodeId), FAVORITE_NODE_NOT_EXIST);
        ExceptionUtil.isFalse(nodeId.equals(preNodeId), INCORRECT_ARG);
        // 空字符串处理为null
        preNodeId = StrUtil.isBlank(preNodeId) ? null : preNodeId;
        ExceptionUtil.isTrue(preNodeId == null || nodeIds.contains(preNodeId), FAVORITE_NODE_NOT_EXIST);
        String originPreNodeId = nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(memberId, nodeId);
        boolean same = (originPreNodeId == null && preNodeId == null) || (originPreNodeId != null && originPreNodeId.equals(preNodeId));
        if (same) {
            return;
        }
        // 原位置的后一个节点指向该节点的前置节点 (A <- B <- C  =>  A <- C)
        nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(originPreNodeId, nodeId, memberId);
        // 新位置的后一个节点指向该节点、该节点指向新的前置节点 (D <- E  =>  D <- B <- E)
        nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(nodeId, preNodeId, memberId);
        boolean flag = SqlHelper.retBool(nodeFavoriteMapper.updatePreNodeIdByMemberIdAndNodeId(preNodeId, memberId, nodeId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateFavoriteStatus(String spaceId, Long memberId, String nodeId) {
        log.info("更改节点的收藏状态");
        // 查询该节点是否已收藏
        boolean exist = SqlTool.retCount(nodeFavoriteMapper.countByMemberIdAndNodeId(memberId, nodeId)) > 0;
        if (exist) {
            // 已收藏，取消收藏该节点，将后一个节点指向该节点的前置节点 (A <- B <- C  =>  A <- C)
            String preNodeId = nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(memberId, nodeId);
            nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(preNodeId, nodeId, memberId);
            boolean flag = SqlHelper.retBool(nodeFavoriteMapper.deleteByMemberIdAndNodeId(memberId, nodeId));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        } else {
            // 校验节点是否存在
            iNodeService.checkNodeIfExist(spaceId, nodeId);
            // 校验节点是否有指定操作权限
            controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
            // 收藏该节点并置于首位，将原首位节点的前置节点指向该节点 (B  =>  A <- B)
            nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(nodeId, null, memberId);
            NodeFavoriteEntity entity = NodeFavoriteEntity.builder()
                .spaceId(spaceId)
                .memberId(memberId)
                .nodeId(nodeId)
                .build();
            boolean flag = SqlHelper.retBool(nodeFavoriteMapper.insert(entity));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }
}
