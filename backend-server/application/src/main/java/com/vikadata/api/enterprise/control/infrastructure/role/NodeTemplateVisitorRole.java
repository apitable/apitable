package com.vikadata.api.enterprise.control.infrastructure.role;

import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Node;

/**
 * <p>
 * template visitor role of node
 * </p>
 *
 * @author Chambers
 */
public class NodeTemplateVisitorRole extends NodeReaderRole {

    public NodeTemplateVisitorRole() {
        super();
    }

    @Override
    public boolean canAssignable() {
        return false;
    }

    @Override
    public String getRoleTag() {
        return Node.TEMPLATE_VISITOR;
    }
}
