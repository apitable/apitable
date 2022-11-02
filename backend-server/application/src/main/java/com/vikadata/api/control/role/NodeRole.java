package com.vikadata.api.control.role;

/**
 * <p>
 * base node role
 * </p>
 *
 * @author Chambers
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
