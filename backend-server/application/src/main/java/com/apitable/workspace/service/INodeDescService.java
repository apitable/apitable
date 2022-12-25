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

package com.apitable.workspace.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.apitable.workspace.dto.NodeDescParseDTO;
import com.apitable.workspace.entity.NodeDescEntity;

public interface INodeDescService extends IService<NodeDescEntity> {

    /**
     * @param nodeId node id
     * @param desc   node description
     */
    void edit(String nodeId, String desc);

    /**
     * copy node description
     *
     * @param newNodeMap original node id - new created node id map
     */
    void copyBatch(Map<String, String> newNodeMap);

    /**
     * @param nodeIds node id
     * @return map
     */
    Map<String, String> getNodeIdToDescMap(List<String> nodeIds);

    /**
     * @param nodeDescList node descption
     */
    void insertBatch(List<NodeDescEntity> nodeDescList);

    /**
     * desc of parsing node
     *
     * @param destDstId node id
     * @return NodeDescParseDTO
     */
    NodeDescParseDTO parseNodeDescByNodeId(String destDstId);
}
