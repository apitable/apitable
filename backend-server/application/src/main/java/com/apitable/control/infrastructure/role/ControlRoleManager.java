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

import cn.hutool.core.lang.Assert;
import com.apitable.control.infrastructure.role.RoleConstants.Field;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * role manager tool.
 *
 * @author Shawn Deng
 */
public class ControlRoleManager {

    private static final Map<String, ControlRole> NODE_CONTROL_ROLE_MAP;

    private static final Map<String, ControlRole> FIELD_CONTROL_ROLE_MAP;

    static {
        // node role container
        NODE_CONTROL_ROLE_MAP = new HashMap<>(16);
        registerNodeRole(Node.TEMPLATE_VISITOR, new NodeTemplateVisitorRole());
        registerNodeRole(Node.ANONYMOUS, new NodeAnonymousRole());
        registerNodeRole(Node.READER, new NodeReaderRole());
        registerNodeRole(Node.EDITOR, new NodeEditorRole());
        registerNodeRole(Node.MANAGER, new NodeManagerRole());
        registerNodeRole(Node.OWNER, new NodeOwnerRole());
        registerNodeRole(Node.UPDATER, new NodeUpdaterRole());

        // field role container
        FIELD_CONTROL_ROLE_MAP = new HashMap<>(16);
        registerFieldRole(Field.READER, new FieldReaderRole());
        registerFieldRole(Field.EDITOR, new FieldEditorRole());
    }

    private static void registerNodeRole(String name, ControlRole role) {
        if (name != null) {
            NODE_CONTROL_ROLE_MAP.put(name, role);
        }
    }

    private static void registerFieldRole(String name, ControlRole role) {
        if (name != null) {
            FIELD_CONTROL_ROLE_MAP.put(name, role);
        }
    }

    public static ControlRole parseNodeRole(String roleCode) {
        Assert.isTrue(NODE_CONTROL_ROLE_MAP.containsKey(roleCode), "node role is not exist");
        return NODE_CONTROL_ROLE_MAP.get(roleCode);
    }

    public static ControlRole parseFieldRole(String roleCode) {
        Assert.isTrue(FIELD_CONTROL_ROLE_MAP.containsKey(roleCode), "field role is not exist");
        return FIELD_CONTROL_ROLE_MAP.get(roleCode);
    }

    /**
     * parse and sort node role.
     *
     * @param roleCodes role codes
     * @return sorted list
     */
    public static List<ControlRole> parseAndSortNodeRole(Collection<String> roleCodes) {
        List<ControlRole> sortedList = roleCodes.stream().reduce(new ArrayList<>(),
            (controlRoles, item) -> {
                controlRoles.add(parseNodeRole(item));
                return controlRoles;
            },
            (controlRoles, childRoles) -> {
                controlRoles.addAll(childRoles);
                return controlRoles;
            });
        Collections.sort(sortedList);
        return sortedList;
    }

    public static ControlRole getTopNodeRole(Collection<String> roleCodes) {
        List<ControlRole> roles = parseAndSortNodeRole(roleCodes);
        return roles.get(roles.size() - 1);
    }

    /**
     * parse and sort field role.
     *
     * @param roleCodes role codes
     * @return sorted list
     */
    public static List<ControlRole> parseAndSortFieldRole(Collection<String> roleCodes) {
        List<ControlRole> sortedList = roleCodes.stream().reduce(new ArrayList<>(),
            (controlRoles, item) -> {
                controlRoles.add(parseFieldRole(item));
                return controlRoles;
            },
            (controlRoles, childRoles) -> {
                controlRoles.addAll(childRoles);
                return controlRoles;
            });
        Collections.sort(sortedList);
        return sortedList;
    }

    public static ControlRole getTopFieldRole(Collection<String> roleCodes) {
        List<ControlRole> roles = parseAndSortFieldRole(roleCodes);
        return roles.get(roles.size() - 1);
    }
}
