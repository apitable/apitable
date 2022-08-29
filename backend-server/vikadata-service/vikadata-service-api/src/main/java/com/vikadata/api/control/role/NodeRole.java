package com.vikadata.api.control.role;

/**
 * <p>
 * 节点角色类
 * </p>
 *
 * @author Chambers
 * @date 2021/9/10
 */
public class NodeRole extends AbstractControlRole {

    private boolean ghostNode;

    public NodeRole() {
        this(false);
    }

    public NodeRole(boolean inherit) {
        super(inherit);
    }

    public boolean isGhostNode() {
        return ghostNode;
    }

    public void setGhostNode(boolean ghostNode) {
        this.ghostNode = ghostNode;
    }

    @Override
    public String getRoleTag() {
        return null;
    }
}
