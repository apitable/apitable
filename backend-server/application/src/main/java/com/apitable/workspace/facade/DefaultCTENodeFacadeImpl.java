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

package com.apitable.workspace.facade;

import com.apitable.shared.util.CollectionUtil;
import com.apitable.shared.util.DBUtil;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.mapper.NodeMapper;
import java.util.Collections;
import java.util.List;

/**
 * Default CTE node facade implement class.
 */
public class DefaultCTENodeFacadeImpl implements NodeFacade {

    private final NodeMapper nodeMapper;

    public DefaultCTENodeFacadeImpl(NodeMapper nodeMapper) {
        this.nodeMapper = nodeMapper;
    }

    @Override
    public boolean contains(String parentNodeId, String nodeId) {
        if (nodeId == null) {
            return false;
        }
        if (parentNodeId.equals(nodeId)) {
            return true;
        }
        List<NodeBaseInfoDTO> parentPathNodes =
            this.getParentPathNodes(Collections.singletonList(nodeId), true);
        return parentPathNodes.stream()
            .map(NodeBaseInfoDTO::getNodeId)
            .anyMatch(i -> i.equals(parentNodeId));
    }

    @Override
    public List<NodeBaseInfoDTO> getParentPathNodes(List<String> nodeIds, boolean includeRootNode) {
        List<NodeBaseInfoDTO> nodes = DBUtil.batchSelectByFieldIn(nodeIds,
                (ids) -> nodeMapper.selectAllParentNodeIds(ids, includeRootNode));
        return CollectionUtil.distinctByProperty(nodes, NodeBaseInfoDTO::getNodeId);
    }
}
