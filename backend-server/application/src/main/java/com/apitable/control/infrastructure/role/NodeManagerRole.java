/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.control.infrastructure.role;

import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.RoleConstants.Node;

/**
 * Manager role of node.
 *
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

    /**
     * constructor.
     *
     * @param inherit inherit
     * @param isAdmin is admin
     */
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

        permissions.add(NodePermission.ARCHIVE_ROW);
        permissions.add(NodePermission.UNARCHIVE_ROW);

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
