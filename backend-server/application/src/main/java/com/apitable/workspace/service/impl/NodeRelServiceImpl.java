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

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.workspace.dto.NodeRelDTO;
import com.apitable.workspace.entity.NodeRelEntity;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeRelMapper;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.vo.NodeInfo;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * node relationship service.
 */
@Slf4j
@Service
public class NodeRelServiceImpl implements INodeRelService {

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private NodeRelMapper nodeRelMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(Long userId, String mainNodeId, String relNodeId, String extra) {
        log.info("create node association，userId:{},mainNodeId:{},relNodeId:{},extra:{}", userId,
            mainNodeId, relNodeId, extra);
        NodeRelEntity nodeRelEntity = NodeRelEntity.builder()
            .id(IdWorker.getId())
            .mainNodeId(mainNodeId)
            .relNodeId(relNodeId)
            .extra(extra)
            .createdBy(userId)
            .build();
        boolean flag =
            SqlHelper.retBool(nodeRelMapper.insertBatch(Collections.singletonList(nodeRelEntity)));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copy(Long userId, String sourceRelNodeId, String destRelNodeId) {
        log.info("copy node association，userId:{},sourceRelNodeId:{},destRelNodeId:{}", userId,
            sourceRelNodeId, destRelNodeId);
        NodeRelEntity entity = nodeRelMapper.selectByRelNodeId(sourceRelNodeId);
        ExceptionUtil.isNotNull(entity, DatabaseException.QUERY_EMPTY_BY_ID);
        this.create(userId, entity.getMainNodeId(), destRelNodeId, entity.getExtra());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyBatch(Long userId, Collection<String> relNodeIds,
                          Map<String, String> newNodeMap) {
        log.info(
            "batch replication node association relationship，userId:{},reNodeIds:{},newNodeMap:{}",
            userId, relNodeIds, newNodeMap);
        List<NodeRelEntity> entities = nodeRelMapper.selectByRelNodeIds(relNodeIds);
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        List<NodeRelEntity> insertEntities = new ArrayList<>(entities.size());
        for (NodeRelEntity entity : entities) {
            NodeRelEntity nodeRelEntity = NodeRelEntity.builder()
                .id(IdWorker.getId())
                .mainNodeId(newNodeMap.get(entity.getMainNodeId()))
                .relNodeId(newNodeMap.get(entity.getRelNodeId()))
                .extra(entity.getExtra())
                .createdBy(userId)
                .build();
            insertEntities.add(nodeRelEntity);
        }
        boolean flag = SqlHelper.retBool(nodeRelMapper.insertBatch(insertEntities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public Map<String, String> getRelNodeToMainNodeMap(Collection<String> relNodeIds) {
        log.info("Obtain the associated node and the corresponding master node.，relNodeIds:{}",
            relNodeIds);
        List<NodeRelEntity> entities = nodeRelMapper.selectByRelNodeIds(relNodeIds);
        return entities.stream()
            .collect(Collectors.toMap(NodeRelEntity::getRelNodeId, NodeRelEntity::getMainNodeId));
    }

    @Override
    public List<NodeInfo> getRelationNodeInfoByNodeId(String nodeId, String viewId, Long memberId,
                                                      Integer nodeType) {
        List<NodeRelDTO> nodeRelList = nodeRelMapper.selectNodeRelDTO(nodeId);
        List<String> relNodeIds = nodeRelList.stream()
            .filter(nodeRel -> {
                // optional specifies the type of associated node
                boolean typeRequire = nodeType == null || nodeType.equals(nodeRel.getType());
                // optional specify view
                if (!typeRequire || viewId == null) {
                    return typeRequire;
                }
                Object value = JSONUtil.getByPath(JSONUtil.parseObj(nodeRel.getExtra()), "viewId");
                return Objects.nonNull(value) && value.toString().equals(viewId);
            }).map(NodeRelDTO::getRelNodeId).collect(Collectors.toList());
        if (CollUtil.isEmpty(relNodeIds)) {
            return new ArrayList<>();
        }
        // Optional requires members to have permissions on associated nodes
        if (memberId == null) {
            return nodeMapper.selectInfoByNodeIds(relNodeIds);
        }
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, relNodeIds);
        if (CollUtil.isEmpty(roleDict)) {
            return new ArrayList<>();
        }
        return nodeMapper.selectInfoByNodeIds(roleDict.keySet());
    }

    @Override
    public NodeRelEntity getByRelNodeId(String relNodeId) {
        log.info("Gets the node association relationship with the associated node [{}]", relNodeId);
        return nodeRelMapper.selectByRelNodeId(relNodeId);
    }
}
