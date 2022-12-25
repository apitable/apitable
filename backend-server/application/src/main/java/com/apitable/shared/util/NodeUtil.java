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

package com.apitable.shared.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.apitable.workspace.vo.SimpleSortableNodeInfo;

public class NodeUtil {

    public static List<SimpleSortableNodeInfo> sortNode(List<SimpleSortableNodeInfo> list) {
        SimpleSortableNodeInfo topNode = getTopNode(list);
        if (topNode == null) {
            return Collections.emptyList();
        }
        List<SimpleSortableNodeInfo> result = new ArrayList<>();
        result.add(topNode);
        recurse(list, topNode.getNodeId(), result);
        return result;
    }

    private static void recurse(List<SimpleSortableNodeInfo> source, String nodeId, List<SimpleSortableNodeInfo> result) {
        for (SimpleSortableNodeInfo nodeInfo : source) {
            if (nodeInfo.getPreNodeId() != null && nodeInfo.getPreNodeId().equals(nodeId)) {
                result.add(nodeInfo);
                recurse(source, nodeInfo.getNodeId(), result);
                break;
            }
        }
    }

    private static SimpleSortableNodeInfo getTopNode(List<SimpleSortableNodeInfo> list) {
        for (SimpleSortableNodeInfo nodeInfo : list) {
            if (nodeInfo.getPreNodeId() == null) {
                return nodeInfo;
            }
        }
        return null;
    }
}
