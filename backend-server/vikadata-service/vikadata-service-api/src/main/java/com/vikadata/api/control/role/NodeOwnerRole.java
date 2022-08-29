package com.vikadata.api.control.role;

import com.vikadata.api.control.role.RoleConstants.Node;

/**
 * 拥有者角色
 * @author Shawn Deng
 * @date 2021-03-18 16:42:50
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
