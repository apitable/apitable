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
        log.info("get favorite node list");
        List<String> nodeIds = nodeFavoriteMapper.selectOrderNodeIdByMemberId(memberId);
        if (CollUtil.isEmpty(nodeIds)) {
            return new ArrayList<>();
        }
        // query node view information
        List<NodeInfoVo> nodeInfoVos = iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        if (CollUtil.isEmpty(nodeInfoVos)) {
            return new ArrayList<>();
        }
        // the order in which the collection nodes are output
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
        log.info("move favorite node position");
        List<String> nodeIds = nodeFavoriteMapper.selectNodeIdByMemberId(memberId);
        ExceptionUtil.isTrue(nodeIds.contains(nodeId), FAVORITE_NODE_NOT_EXIST);
        ExceptionUtil.isFalse(nodeId.equals(preNodeId), INCORRECT_ARG);
        // empty string is processed as null
        preNodeId = StrUtil.isBlank(preNodeId) ? null : preNodeId;
        ExceptionUtil.isTrue(preNodeId == null || nodeIds.contains(preNodeId), FAVORITE_NODE_NOT_EXIST);
        String originPreNodeId = nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(memberId, nodeId);
        boolean same = (originPreNodeId == null && preNodeId == null) || (originPreNodeId != null && originPreNodeId.equals(preNodeId));
        if (same) {
            return;
        }
        // The next node in the original position points to the front node of the node (A <- B <- C => A <- C)
        nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(originPreNodeId, nodeId, memberId);
        // The next node of the new location points to the node, and the node points to the new front node (D <- E => D <- B <- E)
        nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(nodeId, preNodeId, memberId);
        boolean flag = SqlHelper.retBool(nodeFavoriteMapper.updatePreNodeIdByMemberIdAndNodeId(preNodeId, memberId, nodeId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateFavoriteStatus(String spaceId, Long memberId, String nodeId) {
        log.info("update favorite status");
        // query whether the node is collected
        boolean exist = SqlTool.retCount(nodeFavoriteMapper.countByMemberIdAndNodeId(memberId, nodeId)) > 0;
        if (exist) {
            // Collected, uncollect the node, point the latter node to the front node of the node (A <- B <- C => A <- C)
            String preNodeId = nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(memberId, nodeId);
            nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(preNodeId, nodeId, memberId);
            boolean flag = SqlHelper.retBool(nodeFavoriteMapper.deleteByMemberIdAndNodeId(memberId, nodeId));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        } else {
            // check whether the node exists
            iNodeService.checkNodeIfExist(spaceId, nodeId);
            // Check whether the node has the specified operation permission
            controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
            // Collect the node and place it in the first place, and point the front node of the original first node to the node (B => A <- B)
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
