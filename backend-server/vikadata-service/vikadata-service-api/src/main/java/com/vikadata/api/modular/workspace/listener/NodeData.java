package com.vikadata.api.modular.workspace.listener;

import lombok.AllArgsConstructor;
import lombok.Data;

import com.vikadata.define.enums.NodeType;

@Data
@AllArgsConstructor
public class NodeData {

    private NodeType type;

    private String nodeId;

    private String nodeName;

    private String preNodeId;

    private String parentId;
}
