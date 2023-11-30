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
 * reader role of node.
 *
 * @author Shawn Deng
 */
public class NodeReaderRole extends NodeRole {

    public NodeReaderRole() {
        this(false);
    }

    /**
     * constructor.
     *
     * @param inherit inherit from parent
     */
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
