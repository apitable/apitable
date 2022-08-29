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
 * 数据清洗 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/9/8
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
        // 初始化未删除空间的根节点控制单元
        List<NodeRoleDto> rootNodeRoleDtos = nodePermissionMapper.selectRootNodeRoleDto();
        // 根节点及对应创建人
        Map<String, Long> rootNodeCreatedByMap = rootNodeRoleDtos.stream()
                .filter(info -> info.getCreatedBy() != null)
                .collect(Collectors.toMap(NodeRoleDto::getNodeId, NodeRoleDto::getCreatedBy));

        // 获取各个节点文件管理员的角色信息
        List<NodeRoleDto> nodeOwnerRoleInfo = nodePermissionMapper.selectNodeOwnerRoleDto();
        // 节点及对应的文件管理员
        Map<String, Long> nodeCreatedByMap = nodeOwnerRoleInfo.stream()
                .collect(Collectors.toMap(NodeRoleDto::getNodeId, NodeRoleDto::getCreatedBy));

        // 获取各个开启权限节点的角色信息
        List<NodeRoleDto> nodeRoleDtos = nodePermissionMapper.selectNodePermissionRoleDto();
        List<ControlEntity> entities = new ArrayList<>(nodeRoleDtos.size());
        for (NodeRoleDto dto : nodeRoleDtos) {
            ControlEntity entity = new ControlEntity();
            entity.setId(IdWorker.getId());
            entity.setSpaceId(dto.getSpaceId());
            String nodeId = dto.getNodeId();
            entity.setControlId(nodeId);
            entity.setControlType(0);
            // 如果是根节点或拥有文件管理员的节点，补充创建人等信息
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
        // 分批插入
        List<List<ControlEntity>> split = CollUtil.split(entities, 1000);
        for (List<ControlEntity> list : split) {
            nodePermissionMapper.insertControl(list);
        }

        // 同步 node_permission 数据到 control_role
        nodePermissionMapper.insertIntoControlRoleSelectNodePermission(null);
    }

    @Override
    public void nodeCreated() {
        log.info("修复 211202 - 220124 期间，引用模板/导入多sheetExcel 后子文件的创建信息为空的数据问题");

        // 获取创建人为NULL的节点的信息
        List<NodeInfo> nodeInfos = nodeMapper.selectNullCreateByNodeInfo();

        if (nodeInfos.isEmpty()) {
            log.info("创建人为NULL的节点不存在");
            return;
        }

        // 根据相同空间站ID space_id、相同创建时间created_at对对象进行分批
        Map<String, Map<LocalDateTime, List<NodeInfo>>> groupNodeInfos = nodeInfos.stream()
                .collect(Collectors.groupingBy(NodeInfo::getSpaceId, Collectors.groupingBy(NodeInfo::getCreatedAt)));

        // 获取具有相同空间站ID space_id、创建时间 created_at、对象信息nodeInfo
        groupNodeInfos.forEach((spaceId, map) ->
                map.forEach((createdAt, infos) -> {
                    // 获取当前空间站ID

                    // 获取最大子节点ID
                    Long maxChildNodeId = Collections.max(infos.stream().map(NodeInfo::getId).collect(Collectors.toList()));

                    // 获取父节点
                    NodeInfo parentNode = nodeMapper.selectParentNodeInfo(spaceId, maxChildNodeId);

                    if (parentNode == null) {
                        log.info("spaceId:「{}」, childNodeId:「{}」, 候补父节点不存在，跳过", spaceId, infos.get(0).getNodeId());
                        return;
                    }

                    Long parentNodeCreatedBy = parentNode.getCreatedBy();
                    if (parentNodeCreatedBy == null) {
                        log.info("spaceId:「{}」, childNodeId:「{}」, 候补父节点也没有创建者，跳过", spaceId, infos.get(0).getNodeId());
                        return;
                    }

                    long betweenSecond = LocalDateTimeUtil.between(createdAt, parentNode.getCreatedAt(), ChronoUnit.SECONDS);
                    boolean condition = false;
                    int firstTime = 3;
                    int secondTime = 180;

                    // 三秒内可以认定是父节点
                    if (betweenSecond < firstTime) {
                        condition = true;
                    }
                    else if (betweenSecond < secondTime) {
                        // 三分钟内，判断未发生修改的子节点中，是否有父节点匹配候补父节点
                        condition = infos.stream().anyMatch(info ->
                                createdAt.equals(info.getUpdatedAt()) && info.getParentId().equals(parentNode.getNodeId()));

                        // 子节点可能发生修改，再次判断，是否有所有子节点都匹配上候补父节点的情况
                        if (!condition) {
                            // 子节点可能有多层，允许内嵌匹配
                            List<String> nodeIds = infos.stream().map(NodeInfo::getNodeId).collect(Collectors.toList());
                            nodeIds.add(parentNode.getNodeId());
                            condition = infos.stream().allMatch(info -> nodeIds.contains(info.getParentId()));
                        }
                    }

                    if (condition) {
                        // 获取父节点的创建人 created_by信息，将子节点的创建人和修改人信息更新为父节点的信息
                        nodeMapper.updateChildNodeInfo(parentNodeCreatedBy, infos.stream().map(NodeInfo::getId).collect(Collectors.toList()));
                        return;
                    }
                    log.info("spaceId:「{}」, childNodeId:「{}」, 候补父节点为「{}」, 创建时间相差「{}」秒，未处理跳过",
                            spaceId, infos.get(0).getNodeId(), parentNode.getNodeId(), betweenSecond);

                })
        );

        // 获取修改人updated_by为空的节点信息,把修改人为空的节点的created_by填入updated_by
        nodeMapper.updatedNullCreatedByNode();
        log.info("修复完毕");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void mirrorWidget() {
        log.info("镜像小程序支持，所需要的数据处理");

        log.info("1、数据库表 vika_datasheet_widget 补充新增字段 source_id 的数据");
        widgetMapper.addDatasheetWidgetSourceData();

        log.info("2、新增定义镜像资源类型，vika_resource_meta 表补充旧镜像的资源元数据的记录");
        log.info("2.1: 查询已存在资源元数据的镜像ID");
        List<String> mirrorIds = widgetMapper.selectMirrorIdHavingResourceMeta();
        log.info("2.2: 补充不存在资源元数据的镜像meta");
        widgetMapper.addMirrorResourceMeta(mirrorIds);

        log.info("处理完毕");
    }
}
