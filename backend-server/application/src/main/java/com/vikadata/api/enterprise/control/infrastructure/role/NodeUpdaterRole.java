package com.vikadata.api.enterprise.control.infrastructure.role;

import com.vikadata.api.enterprise.control.infrastructure.permission.NodePermission;

/**
 * <p>
 * Updater role of node
 * <p>
 *
 * @author liuzijing
 */
public class NodeUpdaterRole extends NodeReaderRole{

    public NodeUpdaterRole() {
        this(false);
    }

    public NodeUpdaterRole(boolean inherit){
        super(inherit);

        permissions.add(NodePermission.EDIT_CELL);
        permissions.add(NodePermission.CREATE_ROW);
    }

    @Override
    public String getRoleTag(){
        return RoleConstants.Node.UPDATER;
    }
}
