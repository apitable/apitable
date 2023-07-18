package com.apitable.workspace.model;

import com.apitable.workspace.enums.NodeType;

/**
 * this object present node all info.
 *
 * @author Shawn Deng
 */
public class NodeObject implements NodeInterface {

    private transient String id;

    private transient NodeType type;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public NodeType getType() {
        return type;
    }

    public void setType(NodeType type) {
        this.type = type;
    }
}
