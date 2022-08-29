package com.vikadata.api.control.role;

import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.control.role.NodeReaderRole;

/**
 * <p>
 * 节点模板访问者角色
 * </p>
 *
 * @author Chambers
 * @date 2021/5/21
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
