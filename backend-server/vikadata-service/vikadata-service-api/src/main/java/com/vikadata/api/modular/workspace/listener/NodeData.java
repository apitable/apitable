package com.vikadata.api.modular.workspace.listener;

import lombok.AllArgsConstructor;
import lombok.Data;

import com.vikadata.define.enums.NodeType;

/**
 *
 * @author Shawn Deng
 * @date 2021-12-01 00:51:59
 */
@Data
@AllArgsConstructor
public class NodeData {

    private NodeType type;

    private String nodeId;

    private String nodeName;

    private String preNodeId;

    private String parentId;
}
