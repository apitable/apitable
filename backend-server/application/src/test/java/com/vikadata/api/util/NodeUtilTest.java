package com.vikadata.api.util;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.vikadata.api.workspace.vo.SimpleSortableNodeInfo;

import static com.vikadata.api.shared.util.NodeUtil.sortNode;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;

/**
 * @author Shawn Deng
 */
public class NodeUtilTest {

    @Test
    public void testSortSimpleNode() {
        // 3
        SimpleSortableNodeInfo node1 = new SimpleSortableNodeInfo();
        node1.setNodeId("3");
        node1.setPreNodeId("2");

        // 5
        SimpleSortableNodeInfo node2 = new SimpleSortableNodeInfo();
        node2.setNodeId("5");
        node2.setPreNodeId("4");

        // 1
        SimpleSortableNodeInfo node3 = new SimpleSortableNodeInfo();
        node3.setNodeId("1");
        node3.setPreNodeId(null);

        // 4
        SimpleSortableNodeInfo node4 = new SimpleSortableNodeInfo();
        node4.setNodeId("4");
        node4.setPreNodeId("3");

        // 2
        SimpleSortableNodeInfo node5 = new SimpleSortableNodeInfo();
        node5.setNodeId("2");
        node5.setPreNodeId("1");

        List<SimpleSortableNodeInfo> nodeInfoList = list(node1, node2, node3, node4, node5);

        List<SimpleSortableNodeInfo> sortedList = sortNode(nodeInfoList);
        assertThat(sortedList).isNotEmpty();
        List<String> nodeIds = sortedList.stream().map(SimpleSortableNodeInfo::getNodeId).collect(Collectors.toList());
        assertThat(nodeIds).containsExactly("1", "2", "3", "4", "5");
    }
}
