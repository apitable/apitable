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

import com.apitable.workspace.entity.NodeDescEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;
import java.util.Map;

/**
 * node description service interface.
 */
public interface INodeDescService extends IService<NodeDescEntity> {

    /**
     * edit node description.
     *
     * @param nodeId node id
     * @param desc   node description
     */
    void edit(String nodeId, String desc);

    /**
     * copy node description.
     *
     * @param newNodeMap original node id - new created node id map
     */
    void copyBatch(Map<String, String> newNodeMap);

    /**
     * get node description map.
     *
     * @param nodeIds node id
     * @return map
     */
    Map<String, String> getNodeIdToDescMap(List<String> nodeIds);

    /**
     * insert batch node description.
     *
     * @param nodeDescList node description
     */
    void insertBatch(List<NodeDescEntity> nodeDescList);
}
