package com.vikadata.api.modular.workspace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vikadata.core.support.tree.Tree;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Vika Bundle 节点文件树
 * </p>
 *
 * @author Chambers
 * @date 2020/4/29
 */
@Data
public class NodeFileTree implements Tree {

    private String nodeId;

    private String parentId;

    private String nodeName;

    private String icon;

    private Integer type;

    private String cover;

    /**
     * 数据文件名称，映射data/里的文件
     */
    private String data;

    /**
     * 子节点
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
