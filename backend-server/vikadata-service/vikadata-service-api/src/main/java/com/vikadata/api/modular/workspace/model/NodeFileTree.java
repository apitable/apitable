package com.vikadata.api.modular.workspace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vikadata.core.support.tree.Tree;
import lombok.Data;

import java.util.List;

@Data
public class NodeFileTree implements Tree {

    private String nodeId;

    private String parentId;

    private String nodeName;

    private String icon;

    private Integer type;

    private String cover;

    /**
     * data file name，map files in `/data`
     */
    private String data;

    /**
     * child node
     */
    private List<NodeFileTree> child;

    public NodeFileTree() {
    }

    public NodeFileTree(String parentId, String nodeId, String name, String icon, Integer type, String cover, String data) {
        this.parentId = parentId;
        this.nodeId = nodeId;
        this.nodeName = name;
        this.icon = icon;
        this.type = type;
        this.cover = cover;
        this.data = data;
    }

    @Override
    public String getNodeId() {
        return this.nodeId;
    }

    @JsonIgnore
    @Override
    public String getNodeParentId() {
        return this.parentId;
    }

    @JsonIgnore
    @Override
    public List getChildrenNodes() {
        return this.child;
    }

    @Override
    public void setChildrenNodes(List childrenNodes) {
        this.child = childrenNodes;
    }
}
