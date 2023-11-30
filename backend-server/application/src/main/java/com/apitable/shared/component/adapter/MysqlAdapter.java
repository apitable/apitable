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

package com.apitable.shared.component.adapter;

import cn.hutool.core.collection.CollUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.workspace.entity.NodeVisitRecordEntity;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.mapper.NodeVisitRecordMapper;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.ArrayList;
import java.util.List;

/**
 * mysql adapter.
 */
public class MysqlAdapter extends AbstractDatasourceAdapter {

    private static final String COMMA = ",";

    @Override
    public List<String> getRecentlyVisitNodeIds(Long memberId, NodeType nodeType) {
        String nodeIdsStr = SpringContextHolder.getBean(NodeVisitRecordMapper.class)
            .selectNodeIdsByMemberIdAndNodeType(memberId, nodeType.getNodeType());
        if (nodeIdsStr == null) {
            return new ArrayList<>();
        }
        return CollUtil.reverse(CollUtil.toList(nodeIdsStr.split(COMMA)));
    }

    @Override
    public void saveOrUpdateNodeVisitRecord(String spaceId, Long memberId, String nodeId,
                                            NodeType nodeType) {
        NodeVisitRecordMapper nodeVisitRecordMapper =
            SpringContextHolder.getBean(NodeVisitRecordMapper.class);
        String nodeIdsStr = nodeVisitRecordMapper.selectNodeIdsByMemberIdAndNodeType(memberId,
            nodeType.getNodeType());
        if (nodeIdsStr == null) {
            NodeVisitRecordEntity entity = NodeVisitRecordEntity.builder()
                .id(IdWorker.getId())
                .spaceId(spaceId)
                .memberId(memberId)
                .nodeType(nodeType.getNodeType())
                .nodeIds(nodeId)
                .build();
            nodeVisitRecordMapper.insert(entity);
            return;
        }
        List<String> nodeIds =
            super.getTheLatestVisitedNodeIds(CollUtil.toList(nodeIdsStr.split(COMMA)), nodeId);
        nodeVisitRecordMapper.updateNodeIdsByMemberIdAndNodeType(String.join(COMMA, nodeIds),
            memberId, nodeType.getNodeType());
    }
}
