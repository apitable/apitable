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

import com.apitable.control.infrastructure.permission.FieldPermission;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.RoleConstants.Node;

/**
 * Editor role of node.
 *
 * @author Shawn Deng
 */
public class NodeEditorRole extends NodeReaderRole {

    public NodeEditorRole() {
        this(false);
    }

    /**
     * constructor.
     *
     * @param inherit inherit from parent
     */
    public NodeEditorRole(boolean inherit) {
        super(inherit);
        permissions.add(NodePermission.EDIT_NODE);
        permissions.add(NodePermission.SHARE_NODE);

        permissions.add(NodePermission.CREATE_VIEW);
        permissions.add(NodePermission.RENAME_VIEW);
        permissions.add(NodePermission.REMOVE_VIEW);
        permissions.add(NodePermission.MOVE_VIEW);
        permissions.add(NodePermission.SORT_COLUMN);
        permissions.add(NodePermission.HIDE_COLUMN);
        permissions.add(NodePermission.FILTER_VIEW);
        permissions.add(NodePermission.SORT_FIELD);
        permissions.add(NodePermission.GROUP_FIELD);
        permissions.add(NodePermission.EDIT_ROW_HIGH);
        permissions.add(NodePermission.EDIT_COLUMN_WIDTH);
        permissions.add(NodePermission.EDIT_COLUMN_COUNT);
        permissions.add(NodePermission.SORT_ROW);
        permissions.add(NodePermission.CREATE_ROW);
        permissions.add(NodePermission.REMOVE_ROW);
        permissions.add(NodePermission.EDIT_CELL);
        permissions.add(NodePermission.EDIT_VIEW_LAYOUT);
        permissions.add(NodePermission.EDIT_VIEW_STYLE);
        permissions.add(NodePermission.EDIT_VIEW_KEY_FIELD);
        permissions.add(NodePermission.EDIT_VIEW_COLOR_OPTION);

        permissions.add(FieldPermission.EDIT_FIELD_DATA);

        // views are manually saved and manageable
        permissions.add(NodePermission.MANAGE_VIEW_MANUAL_SAVE);
        // view options save editable
        permissions.add(NodePermission.EDIT_VIEW_OPTION_SAVE);
    }

    @Override
    public String getRoleTag() {
        return Node.EDITOR;
    }
}
