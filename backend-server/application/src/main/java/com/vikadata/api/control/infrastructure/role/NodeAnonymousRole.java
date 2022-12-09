package com.vikadata.api.control.infrastructure.role;

import com.vikadata.api.control.infrastructure.role.RoleConstants.Node;

/**
 * Anonymous Role of Node
 * @author Shawn Deng
 */
public class NodeAnonymousRole extends NodeReaderRole {

    public NodeAnonymousRole() {
        super();
    }

    @Override
    public boolean canAssignable() {
        return false;
    }

    @Override
    public String getRoleTag() {
        return Node.ANONYMOUS;
    }
}
