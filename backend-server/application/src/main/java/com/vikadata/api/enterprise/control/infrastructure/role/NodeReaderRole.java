package com.vikadata.api.enterprise.control.infrastructure.role;

import com.vikadata.api.enterprise.control.infrastructure.permission.FieldPermission;
import com.vikadata.api.enterprise.control.infrastructure.permission.NodePermission;
import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Node;

/**
 * reader role of node
 * @author Shawn Deng
 */
public class NodeReaderRole extends NodeRole {

    public NodeReaderRole() {
        this(false);
    }

    public NodeReaderRole(boolean inherit) {
        super(inherit);
        permissions.add(NodePermission.READ_NODE);
        permissions.add(NodePermission.EXPORT_NODE);
        permissions.add(FieldPermission.READ_FIELD_DATA);
    }

    @Override
    public String getRoleTag() {
        return Node.READER;
    }
}
