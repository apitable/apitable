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

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.workspace.dto.NodeTreeDTO;
import com.apitable.workspace.entity.NodeFavoriteEntity;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeFavoriteMapper;
import com.apitable.workspace.service.INodeFavoriteService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.FavoriteNodeInfo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * node favorite service implementation.
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
        log.info("get favorite node list");
        List<NodeTreeDTO> treeList = nodeFavoriteMapper.selectNodeTreeDTOByMemberId(memberId);
        if (CollUtil.isEmpty(treeList)) {
            return new ArrayList<>();
        }
        List<String> nodeIds = iNodeService.sortNodeAtSameLevel(treeList);
        // query node view information
        List<NodeInfoVo> nodeInfoVos =
            iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
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
        ExceptionUtil.isTrue(nodeIds.contains(nodeId), NodeException.FAVORITE_NODE_NOT_EXIST);
        ExceptionUtil.isFalse(nodeId.equals(preNodeId), ParameterException.INCORRECT_ARG);
        // empty string is processed as null
        preNodeId = StrUtil.isBlank(preNodeId) ? null : preNodeId;
        ExceptionUtil.isTrue(preNodeId == null || nodeIds.contains(preNodeId),
            NodeException.FAVORITE_NODE_NOT_EXIST);
        String originPreNodeId =
            nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(memberId, nodeId);
        boolean same = (originPreNodeId == null && preNodeId == null)
            || (originPreNodeId != null && originPreNodeId.equals(preNodeId));
        if (same) {
            return;
        }
        // The next node in the original position points to the front node of the node
        // (A <- B <- C => A <- C)
        nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(originPreNodeId, nodeId, memberId);
        // The next node of the new location points to the node,
        // and the node points to the new front node (D <- E => D <- B <- E)
        nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(nodeId, preNodeId, memberId);
        boolean flag = SqlHelper.retBool(
            nodeFavoriteMapper.updatePreNodeIdByMemberIdAndNodeId(preNodeId, memberId, nodeId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateFavoriteStatus(String spaceId, Long memberId, String nodeId) {
        log.info("update favorite status");
        // query whether the node is collected
        boolean exist =
            SqlTool.retCount(nodeFavoriteMapper.countByMemberIdAndNodeId(memberId, nodeId)) > 0;
        if (exist) {
            // Collected, uncollected the node, point the latter node to the front node of the node
            // (A <- B <- C => A <- C)
            String preNodeId =
                nodeFavoriteMapper.selectPreNodeIdByMemberIdAndNodeId(memberId, nodeId);
            nodeFavoriteMapper.updatePreNodeIdByMemberIdAndPreNodeId(preNodeId, nodeId, memberId);
            boolean flag =
                SqlHelper.retBool(nodeFavoriteMapper.deleteByMemberIdAndNodeId(memberId, nodeId));
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
            return;
        }

        // check whether the node exists
        iNodeService.checkNodeIfExist(spaceId, nodeId,
            StrUtil.toString(iNodeService.getUnitIdByNodeId(nodeId)));
        // Check whether the node has the specified operation permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // Collect the node and place it in the first place, and point the front node of the
        // original first node to the node (B => A <- B)
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
