package com.vikadata.api.control.infrastructure.role;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.lang.Assert;

import com.vikadata.api.control.infrastructure.role.RoleConstants.Field;
import com.vikadata.api.control.infrastructure.role.RoleConstants.Node;

/**
 * role manager tool
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
