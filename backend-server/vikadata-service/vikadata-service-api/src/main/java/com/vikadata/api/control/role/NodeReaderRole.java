package com.vikadata.api.control.role;

import com.vikadata.api.control.permission.FieldPermission;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.control.role.RoleConstants.Node;

/**
 * 只读角色
 * @author Shawn Deng
 * @date 2021-03-18 16:42:50
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
