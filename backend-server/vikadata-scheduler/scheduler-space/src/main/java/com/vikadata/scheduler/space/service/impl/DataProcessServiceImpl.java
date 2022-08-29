package com.vikadata.scheduler.space.service.impl;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;

import com.vikadata.define.utils.MimeTypeMapping;
import com.vikadata.entity.ControlEntity;
import com.vikadata.scheduler.space.mapper.asset.AssetMapper;
import com.vikadata.scheduler.space.mapper.organization.MemberMapper;
import com.vikadata.scheduler.space.mapper.vcode.VCodeMapper;
import com.vikadata.scheduler.space.mapper.workspace.NodePermissionMapper;
import com.vikadata.scheduler.space.model.NodeRoleDto;
import com.vikadata.scheduler.space.model.NodeRoleInfo;
import com.vikadata.scheduler.space.service.IDataProcessService;

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
@Service
public class DataProcessServiceImpl implements IDataProcessService {

    @Resource
    private VCodeMapper vCodeMapper;

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private NodePermissionMapper nodePermissionMapper;

    @Override
    public void changeRetainTimes() {
        List<String> vCodes = vCodeMapper.selectNotUsedCode();
        if (CollUtil.isNotEmpty(vCodes)) {
            vCodeMapper.updateRetainTimesByCode(vCodes);
        }
    }

    @Override
    public void updateAssetData() {
        String bucket = "QNY1";
        // 获取所有拓展名列表
        List<String> extensionNames = assetMapper.selectExtensionName();
        for (String extensionName : extensionNames) {
            String mimeType = MimeTypeMapping.extensionToMimeType(extensionName);
            if (mimeType == null) {
                continue;
            }
            // 拓展名找得到 MimeType 的，同时修改 Bucket 和 MimeType
            assetMapper.updateBucketAndMimeType(bucket, mimeType, extensionName);
        }
        // 剩下 bucket 字段仍为空的记录，批量修改
        assetMapper.updateBucket(bucket);
    }

    @Override
    public void updateMemberData() {
        // 查询成员名称与用户昵称不一致的成员ID
        List<Long> memberIds = memberMapper.selectMemberIds();
        // 批量修改
        List<List<Long>> split = CollUtil.split(memberIds, 100);
        for (List<Long> ids : split) {
            memberMapper.updateNameModifiedByIds(ids);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void controlDataInit() {
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
    @Transactional(rollbackFor = Exception.class)
    public void controlCompensate() {
        // 获取初始化已同步到 control_role 最后一条记录的ID
        Long initMaxId = nodePermissionMapper.selectControlRoleInitMaxId();

        // 获取初始化之后，删除了的节点角色信息ID
        List<Long> delIds = nodePermissionMapper.selectControlRoleDelIds(initMaxId);
        if (!delIds.isEmpty()) {
            nodePermissionMapper.deleteControlRoleByIds(delIds);
        }

        // 获取初始化之后，新增部分的节点角色ID
        List<Long> addIds = nodePermissionMapper.selectCreateList(initMaxId);
        if (!addIds.isEmpty()) {
            // 同步 node_permission 数据到 control_role
            nodePermissionMapper.insertIntoControlRoleSelectNodePermission(addIds);
        }

        // 获取初始化之后，发生角色变更的节点角色信息
        List<NodeRoleInfo> changeList = nodePermissionMapper.selectChangeList();
        if (!changeList.isEmpty()) {
            // 更新角色信息
            changeList.forEach(info -> nodePermissionMapper.updateControlRoleById(info.getId(), info.getRoleCode(), info.getUpdatedAt()));
        }

        // 获取已初始化的 controlId 集，比较最新的 control_role 对应的 controlId 集
        List<String> initControlIds = nodePermissionMapper.selectInitNodeControlIds();
        List<NodeRoleDto> roleDtoList = nodePermissionMapper.selectControlRoleDto();
        Map<String, NodeRoleDto> nodeRoleDtoMap = roleDtoList.stream().collect(Collectors.toMap(NodeRoleDto::getNodeId, dto -> dto));
        // 相互差集，得出需要新增和删除的部分
        Collection<String> delControlIds = CollUtil.subtract(initControlIds, nodeRoleDtoMap.keySet());
        if (!delControlIds.isEmpty()) {
            nodePermissionMapper.deleteControlByIds(delControlIds);
        }
        Collection<String> addControlIds = CollUtil.subtract(CollUtil.newArrayList(nodeRoleDtoMap.keySet()), initControlIds);
        if (addControlIds.isEmpty()) {
            return;
        }
        List<ControlEntity> entities = new ArrayList<>(addControlIds.size());
        addControlIds.forEach(controlId -> {
            NodeRoleDto dto = nodeRoleDtoMap.get(controlId);
            ControlEntity entity = new ControlEntity();
            entity.setId(IdWorker.getId());
            entity.setSpaceId(dto.getSpaceId());
            entity.setControlId(controlId);
            entity.setControlType(0);
            entity.setCreatedAt(dto.getCreatedAt());
            entity.setUpdatedAt(dto.getCreatedAt());
            entities.add(entity);
        });
        nodePermissionMapper.insertControl(entities);
    }
}
