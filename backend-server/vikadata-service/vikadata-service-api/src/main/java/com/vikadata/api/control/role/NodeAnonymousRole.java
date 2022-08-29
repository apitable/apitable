package com.vikadata.api.control.role;

import com.vikadata.api.control.role.RoleConstants.Node;

/**
 * 匿名角色
 * @author Shawn Deng
 * @date 2021-03-20 16:03:24
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
