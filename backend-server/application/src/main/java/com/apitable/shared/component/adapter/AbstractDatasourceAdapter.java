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

import java.util.List;
import java.util.stream.Collectors;

/**
 * abstract datasource adapter.
 */
public abstract class AbstractDatasourceAdapter implements DatasourceAdapter {

    private static final int RECENTLY_NODE_ID_LENGTH = 10;

    protected List<String> getTheLatestVisitedNodeIds(List<String> originNodeIds, String nodeId) {
        // filter current node id
        List<String> nodeIds =
            originNodeIds.stream().filter(i -> !nodeId.equals(i)).collect(Collectors.toList());
        if (nodeIds.size() >= RECENTLY_NODE_ID_LENGTH) {
            nodeIds.remove(0);
        }
        nodeIds.add(nodeId);
        return nodeIds;
    }
}
