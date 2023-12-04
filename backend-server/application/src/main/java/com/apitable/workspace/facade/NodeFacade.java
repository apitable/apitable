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

import com.apitable.workspace.dto.NodeBaseInfoDTO;
import java.util.List;

/**
 * Node Facade.
 *
 * @author Chambers
 */
public interface NodeFacade {

    /**
     * Check if the parent node contains node.
     *
     * @param parentNodeId  parent node id
     * @param nodeId        node id
     * @return contains status
     * @author Chambers
     */
    boolean contains(String parentNodeId, String nodeId);

    /**
     * Get parent path nodes.
     *
     * @param nodeIds           node ids
     * @param includeRootNode   whether include root node
     * @return NodeBaseInfoDTO List
     * @author Chambers
     */
    List<NodeBaseInfoDTO> getParentPathNodes(List<String> nodeIds, boolean includeRootNode);
}
