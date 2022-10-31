package com.vikadata.api.control.role;

import com.vikadata.api.control.role.RoleConstants.Node;

/**
 * Owner role of node
 * @author Shawn Deng
 */
public class NodeOwnerRole extends NodeManagerRole {

    public NodeOwnerRole() {
        super();
    }

    @Override
    public boolean canAssignable() {
        return false;
    }

    @Override
    public String getRoleTag() {
        return Node.OWNER;
    }
}
