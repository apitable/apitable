package com.vikadata.aider.service.impl;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.aider.mapper.NodeMapper;
import com.vikadata.aider.mapper.NodePermissionMapper;
import com.vikadata.aider.mapper.WidgetMapper;
import com.vikadata.aider.model.NodeInfo;
import com.vikadata.aider.model.NodeRoleDto;
import com.vikadata.aider.service.IDataProcessService;
import com.vikadata.entity.ControlEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * service implementation: data processor
 * </p>
 */
@Slf4j
@Service
public class DataProcessServiceImpl implements IDataProcessService {

    @Resource
    private NodePermissionMapper nodePermissionMapper;

    @Resource
    private WidgetMapper widgetMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void controlProcess() {
        // init the root nodes control of space that aren't deleted
        List<NodeRoleDto> rootNodeRoleDtos = nodePermissionMapper.selectRootNodeRoleDto();
        // root node & it's creator
        Map<String, Long> rootNodeCreatedByMap = rootNodeRoleDtos.stream()
                .filter(info -> info.getCreatedBy() != null)
                .collect(Collectors.toMap(NodeRoleDto::getNodeId, NodeRoleDto::getCreatedBy));

        // get the role information about file manager on each node
        List<NodeRoleDto> nodeOwnerRoleInfo = nodePermissionMapper.selectNodeOwnerRoleDto();
        // nodes and their creator
        Map<String, Long> nodeCreatedByMap = nodeOwnerRoleInfo.stream()
                .collect(Collectors.toMap(NodeRoleDto::getNodeId, NodeRoleDto::getCreatedBy));

        // get the role info about each node whose control are enabled
        List<NodeRoleDto> nodeRoleDtos = nodePermissionMapper.selectNodePermissionRoleDto();
        List<ControlEntity> entities = new ArrayList<>(nodeRoleDtos.size());
        for (NodeRoleDto dto : nodeRoleDtos) {
            ControlEntity entity = new ControlEntity();
            entity.setId(IdWorker.getId());
            entity.setSpaceId(dto.getSpaceId());
            String nodeId = dto.getNodeId();
            entity.setControlId(nodeId);
            entity.setControlType(0);
            // if root node or node with file manager，add creator or other info
            if (rootNodeCreatedByMap.containsKey(nodeId)) {
                entity.setCreatedBy(rootNodeCreatedByMap.get(nodeId));
                entity.setUpdatedBy(rootNodeCreatedByMap.get(nodeId));
            }
            else if (nodeCreatedByMap.containsKey(nodeId)) {
                entity.setCreatedBy(nodeCreatedByMap.get(nodeId));
                entity.setUpdatedBy(nodeCreatedByMap.get(nodeId));
            }
            entity.setCreatedAt(dto.getCreatedAt());
            entity.setUpdatedAt(dto.getCreatedAt());
            entities.add(entity);
        }
        // insert
        List<List<ControlEntity>> split = CollUtil.split(entities, 1000);
        for (List<ControlEntity> list : split) {
            nodePermissionMapper.insertControl(list);
        }

        // sync node_permission data to control_role
        nodePermissionMapper.insertIntoControlRoleSelectNodePermission(null);
    }

    @Override
    public void nodeCreated() {
        log.info("fix: during 211202 - 220124 ，when referring templates or import multiple sheet excel, "
                + "the problem is data about child file's creator is null.");

        // the info of nodes without creator
        List<NodeInfo> nodeInfos = nodeMapper.selectNullCreateByNodeInfo();

        if (nodeInfos.isEmpty()) {
            log.info("no exist nodes with null creator");
            return;
        }

        // group by space_id & created_at
        Map<String, Map<LocalDateTime, List<NodeInfo>>> groupNodeInfos = nodeInfos.stream()
                .collect(Collectors.groupingBy(NodeInfo::getSpaceId, Collectors.groupingBy(NodeInfo::getCreatedAt)));

        // get the same space_id & created_at node info
        groupNodeInfos.forEach((spaceId, map) ->
                map.forEach((createdAt, infos) -> {
                    // get current space id

                    // get max chile node id
                    Long maxChildNodeId = Collections.max(infos.stream().map(NodeInfo::getId).collect(Collectors.toList()));

                    // get parent node
                    NodeInfo parentNode = nodeMapper.selectParentNodeInfo(spaceId, maxChildNodeId);

                    if (parentNode == null) {
                        log.info("spaceId:「{}」, childNodeId:「{}」, alternate parent node not exist，skip", spaceId, infos.get(0).getNodeId());
                        return;
                    }

                    Long parentNodeCreatedBy = parentNode.getCreatedBy();
                    if (parentNodeCreatedBy == null) {
                        log.info("spaceId:「{}」, childNodeId:「{}」, alternate parent node null creator，skip", spaceId, infos.get(0).getNodeId());
                        return;
                    }

                    long betweenSecond = LocalDateTimeUtil.between(createdAt, parentNode.getCreatedAt(), ChronoUnit.SECONDS);
                    boolean condition = false;
                    int firstTime = 3;
                    int secondTime = 180;

                    // the parent can be identified within three seconds
                    if (betweenSecond < firstTime) {
                        condition = true;
                    }
                    else if (betweenSecond < secondTime) {
                        // Within three minutes, check whether any parent of the unmodified child node matches the alternate parent
                        condition = infos.stream().anyMatch(info ->
                                createdAt.equals(info.getUpdatedAt()) && info.getParentId().equals(parentNode.getNodeId()));

                        // child nodes may be modified.
                        // again, determine if there is a case where all the child nodes match the alternate parent
                        if (!condition) {
                            // child nodes may have multiple levels, allowing inline matching
                            List<String> nodeIds = infos.stream().map(NodeInfo::getNodeId).collect(Collectors.toList());
                            nodeIds.add(parentNode.getNodeId());
                            condition = infos.stream().allMatch(info -> nodeIds.contains(info.getParentId()));
                        }
                    }

                    if (condition) {
                        // update child node's created_by & updated_by to parent node's created_by
                        nodeMapper.updateChildNodeInfo(parentNodeCreatedBy, infos.stream().map(NodeInfo::getId).collect(Collectors.toList()));
                        return;
                    }
                    log.info("spaceId:「{}」, childNodeId:「{}」, parentNodeId 「{}」,  creation time difference「{}」second，no handle skip",
                            spaceId, infos.get(0).getNodeId(), parentNode.getNodeId(), betweenSecond);

                })
        );

        // update node's null update_by to the created_by value
        nodeMapper.updatedNullCreatedByNode();
        log.info("finish fix");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void mirrorWidget() {
        log.info("mirror widget support: handle the needed data. ");

        log.info("1、database table: vika_datasheet_widget, add source_id's data");
        widgetMapper.addDatasheetWidgetSourceData();

        log.info("2、add mirror resource type, table vika_resource_meta's old mirror records replenish meta");
        log.info("2.1: query the mirrorId of existing resource metadata");
        List<String> mirrorIds = widgetMapper.selectMirrorIdHavingResourceMeta();
        log.info("2.2: replenish mirror meta that no resource meta");
        widgetMapper.addMirrorResourceMeta(mirrorIds);

        log.info("finish handle");
    }
}
