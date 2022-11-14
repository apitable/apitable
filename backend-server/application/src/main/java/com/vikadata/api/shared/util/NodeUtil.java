package com.vikadata.api.shared.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.vikadata.api.workspace.vo.SimpleSortableNodeInfo;

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
