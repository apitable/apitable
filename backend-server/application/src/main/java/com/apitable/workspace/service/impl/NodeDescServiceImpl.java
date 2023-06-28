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
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.workspace.dto.NodeDescDTO;
import com.apitable.workspace.entity.NodeDescEntity;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.mapper.NodeDescMapper;
import com.apitable.workspace.service.INodeDescService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * node description service implement.
 */
@Slf4j
@Service
public class NodeDescServiceImpl extends ServiceImpl<NodeDescMapper, NodeDescEntity>
    implements INodeDescService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(String nodeId, String desc) {
        log.info("edit node description");
        if (StrUtil.isEmpty(desc)) {
            baseMapper.updateDescByNodeId(nodeId, desc);
            return;
        }
        int byteLength = desc.getBytes().length;
        ExceptionUtil.isTrue(byteLength <= 65535, NodeException.DESCRIPTION_TOO_LONG);
        Long id = baseMapper.selectIdByNodeId(nodeId);
        NodeDescEntity nodeDescEntity =
            NodeDescEntity.builder().id(id).nodeId(nodeId).description(desc).build();
        boolean flag = this.saveOrUpdate(nodeDescEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void copyBatch(Map<String, String> newNodeMap) {
        log.info("copy node description");
        if (MapUtil.isEmpty(newNodeMap)) {
            return;
        }
        List<NodeDescDTO> dtoList = baseMapper.selectByNodeIds(newNodeMap.keySet());
        if (CollUtil.isEmpty(dtoList)) {
            return;
        }
        List<NodeDescEntity> entities = new ArrayList<>(dtoList.size());
        for (NodeDescDTO dto : dtoList) {
            NodeDescEntity entity = NodeDescEntity.builder()
                .id(IdWorker.getId())
                .nodeId(newNodeMap.get(dto.getNodeId()))
                .description(dto.getDescription())
                .build();
            entities.add(entity);
        }
        boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public Map<String, String> getNodeIdToDescMap(List<String> nodeIds) {
        log.info("obtain node and corresponding description");
        if (CollUtil.isNotEmpty(nodeIds)) {
            List<NodeDescDTO> dtoList = baseMapper.selectByNodeIds(nodeIds);
            return dtoList.stream()
                .collect(Collectors.toMap(NodeDescDTO::getNodeId, NodeDescDTO::getDescription));
        }
        return null;
    }

    @Override
    public void insertBatch(List<NodeDescEntity> nodeDescList) {
        log.info("batch add node description");
        if (CollUtil.isNotEmpty(nodeDescList)) {
            boolean flag = SqlHelper.retBool(baseMapper.insertBatch(nodeDescList));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }
}
