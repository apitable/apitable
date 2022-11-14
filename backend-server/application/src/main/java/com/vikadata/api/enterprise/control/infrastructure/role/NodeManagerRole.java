package com.vikadata.api.enterprise.control.infrastructure.role;

import com.vikadata.api.enterprise.control.infrastructure.permission.NodePermission;
import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Node;

/**
 * Manager role of node
 * @author Shawn Deng
 */
public class NodeManagerRole extends NodeEditorRole {

    private final boolean isAdmin;

    public NodeManagerRole() {
        this(false);
    }

    public NodeManagerRole(boolean inherit) {
        this(inherit, false);
    }

    public NodeManagerRole(boolean inherit, boolean isAdmin) {
        super(inherit);
        this.isAdmin = isAdmin;
        permissions.add(NodePermission.MANAGE_NODE);

        permissions.add(NodePermission.CREATE_NODE);
        permissions.add(NodePermission.RENAME_NODE);
        permissions.add(NodePermission.EDIT_NODE_ICON);
        permissions.add(NodePermission.EDIT_NODE_DESC);
        permissions.add(NodePermission.MOVE_NODE);
        permissions.add(NodePermission.COPY_NODE);
        permissions.add(NodePermission.IMPORT_NODE);
        permissions.add(NodePermission.EXPORT_NODE);
        permissions.add(NodePermission.REMOVE_NODE);

        permissions.add(NodePermission.CREATE_TEMPLATE);

        permissions.add(NodePermission.SET_NODE_SHARE_ALLOW_SAVE);
        permissions.add(NodePermission.SET_NODE_SHARE_ALLOW_EDIT);

        permissions.add(NodePermission.ASSIGN_NODE_ROLE);

        permissions.add(NodePermission.EXPORT_VIEW);
        permissions.add(NodePermission.CREATE_FIELD);
        permissions.add(NodePermission.RENAME_FIELD);
        permissions.add(NodePermission.EDIT_FIELD_PROPERTY);
        permissions.add(NodePermission.REMOVE_FIELD);

        // field permission
        permissions.add(NodePermission.MANAGE_FIELD_PERMISSION);

        // view locking is manageable
        permissions.add(NodePermission.MANAGE_VIEW_LOCK);
    }

    @Override
    public boolean isAdmin() {
        return this.isAdmin;
    }

    @Override
    public String getRoleTag() {
        return Node.MANAGER;
    }
}
