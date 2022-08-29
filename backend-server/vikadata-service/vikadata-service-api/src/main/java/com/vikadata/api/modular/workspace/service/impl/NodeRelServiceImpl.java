package com.vikadata.api.modular.workspace.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.dto.node.NodeRelDTO;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.NodeRelMapper;
import com.vikadata.api.modular.workspace.service.INodeRelService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeRelEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 节点关联 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/11/11
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
        log.info("创建节点关联，userId:{},mainNodeId:{},relNodeId:{},extra:{}", userId, mainNodeId, relNodeId, extra);
        NodeRelEntity nodeRelEntity = NodeRelEntity.builder()
                .id(IdWorker.getId())
                .mainNodeId(mainNodeId)
                .relNodeId(relNodeId)
                .extra(extra)
                .createdBy(userId)
                .build();
        boolean flag = SqlHelper.retBool(nodeRelMapper.insertBatch(Collections.singletonList(nodeRelEntity)));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void copy(Long userId, String sourceRelNodeId, String destRelNodeId) {
        log.info("复制节点关联关系，userId:{},sourceRelNodeId:{},destRelNodeId:{}", userId, sourceRelNodeId, destRelNodeId);
        NodeRelEntity entity = nodeRelMapper.selectByRelNodeId(sourceRelNodeId);
        ExceptionUtil.isNotNull(entity, DatabaseException.QUERY_EMPTY_BY_ID);
        this.create(userId, entity.getMainNodeId(), destRelNodeId, entity.getExtra());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyBatch(Long userId, Collection<String> relNodeIds, Map<String, String> newNodeMap) {
        log.info("批量复制节点关联关系，userId:{},reNodeIds:{},newNodeMap:{}", userId, relNodeIds, newNodeMap);
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
        log.info("获取关联节点及对应的主节点，relNodeIds:{}", relNodeIds);
        List<NodeRelEntity> entities = nodeRelMapper.selectByRelNodeIds(relNodeIds);
        return entities.stream().collect(Collectors.toMap(NodeRelEntity::getRelNodeId, NodeRelEntity::getMainNodeId));
    }

    @Override
    public List<NodeInfo> getRelationNodeInfoByNodeId(String nodeId, String viewId, Long memberId, Integer nodeType) {
        List<NodeRelDTO> nodeRelList = nodeRelMapper.selectNodeRelDTO(nodeId);
        List<String> relNodeIds = nodeRelList.stream()
                .filter(nodeRel -> {
                    // 可选性指定关联节点类型
                    boolean typeRequire = nodeType == null || nodeType.equals(nodeRel.getType());
                    // 可选性指定视图
                    if (!typeRequire || viewId == null) {
                        return typeRequire;
                    }
                    Object value = JSONUtil.getByPath(JSONUtil.parseObj(nodeRel.getExtra()), "viewId");
                    return Objects.nonNull(value) && value.toString().equals(viewId);
                }).map(NodeRelDTO::getRelNodeId).collect(Collectors.toList());
        if (CollUtil.isEmpty(relNodeIds)) {
            return new ArrayList<>();
        }
        // 可选性要求成员对关联节点的权限
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
        log.info("获取关联节点为「{}」的节点关联关系", relNodeId);
        return nodeRelMapper.selectByRelNodeId(relNodeId);
    }
}
