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

package com.apitable.control.infrastructure;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.apitable.control.infrastructure.permission.FieldPermission;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.FieldReaderRole;
import com.apitable.control.infrastructure.role.NodeEditorRole;
import com.apitable.control.infrastructure.role.NodeManagerRole;
import com.apitable.control.infrastructure.role.NodeOwnerRole;
import com.apitable.control.infrastructure.role.NodeReaderRole;
import com.apitable.control.infrastructure.role.NodeUpdaterRole;
import com.apitable.control.infrastructure.role.RoleConstants.Field;
import com.apitable.control.infrastructure.role.RoleConstants.Node;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;

/**
 * Control Role Unit Test
 */
public class ControlRoleTest {

    @Test
    public void testRoleAssignable() {
        ControlRole reader = new NodeReaderRole();
        assertThat(reader.canAssignable()).isTrue();

        ControlRole owner = new NodeOwnerRole();
        assertThat(owner.canAssignable()).isFalse();

        ControlRole updater = new NodeUpdaterRole();
        assertThat(updater.canAssignable()).isTrue();
    }

    @Test
    public void testNodeReaderRole() {
        ControlRole role = new NodeReaderRole();
        assertThat(role.getRoleTag()).isEqualTo(Node.READER);
        assertThat(role.hasPermission(NodePermission.READ_NODE)).isTrue();
        assertThat(role.getPermissions()).contains(NodePermission.READ_NODE);
    }

    @Test
    public void testNodeEditorRole() {
        ControlRole role = new NodeEditorRole();
        assertThat(role.getRoleTag()).isEqualTo(Node.EDITOR);
        assertThat(role.hasPermission(NodePermission.EDIT_NODE)).isTrue();
        assertThat(role.getPermissions()).contains(NodePermission.EDIT_NODE);
    }

    @Test
    public void testNodeMangerRole() {
        ControlRole role = new NodeManagerRole();
        assertThat(role.getRoleTag()).isEqualTo(Node.MANAGER);
        assertThat(role.hasPermission(NodePermission.MANAGE_NODE)).isTrue();
        assertThat(role.getPermissions()).contains(NodePermission.MANAGE_NODE);
    }

    @Test
    public void testFieldReaderRole() {
        ControlRole role = new FieldReaderRole();
        assertThat(role.getRoleTag()).isEqualTo(Field.READER);
        assertThat(role.hasPermission(FieldPermission.READ_FIELD_DATA)).isTrue();
        assertThat(role.getPermissions()).contains(FieldPermission.READ_FIELD_DATA);
    }

    @Test
    public void testCompareRole() {
        List<ControlRole> roles = new ArrayList<>();
        roles.add(new NodeManagerRole());
        roles.add(new NodeReaderRole());
        roles.add(new NodeEditorRole());
        roles.add(new NodeUpdaterRole());

        // natural ordering
        Collections.sort(roles);

        assertThat(roles).size().isEqualTo(4);
        assertThat(roles).first().isInstanceOf(NodeReaderRole.class);
        assertThat(roles).last().isInstanceOf(NodeManagerRole.class);
    }

    @Test
    public void testParseRole() {
        ControlRole reader = ControlRoleManager.parseNodeRole("reader");
        assertThat(reader.getRoleTag()).isEqualTo(Node.READER);

        ControlRole editor = ControlRoleManager.parseNodeRole("editor");
        assertThat(editor.getRoleTag()).isEqualTo(Node.EDITOR);

        ControlRole manager = ControlRoleManager.parseNodeRole("manager");
        assertThat(manager.getRoleTag()).isEqualTo(Node.MANAGER);

        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        assertThat(updater.getRoleTag()).isEqualTo(Node.UPDATER);
    }

    @Test
    public void testSortByRoles() {
        List<ControlRole> roles = ControlRoleManager.parseAndSortNodeRole(Arrays.asList("editor", "reader", "manager", "updater"));
        assertThat(roles).first().isInstanceOf(NodeReaderRole.class);
        assertThat(roles).last().isInstanceOf(NodeManagerRole.class);

        List<ControlRole> unsortedRoles = list(new NodeEditorRole(), new NodeReaderRole(), new NodeManagerRole(), new NodeUpdaterRole());
        Collections.sort(unsortedRoles);
        List<String> expectSortResult = list("reader", "updater", "editor", "manager");
        assertThat(unsortedRoles.stream().map(ControlRole::getRoleTag).collect(Collectors.toList()))
                .containsSequence(expectSortResult);
    }

    @Test
    public void testRoleGreaterThan() {
        ControlRole editor = ControlRoleManager.parseNodeRole("editor");
        ControlRole manager = ControlRoleManager.parseNodeRole("manager");
        assertThat(editor.isEqualTo(manager)).isFalse();
        assertThat(editor.isGreaterThan(manager)).isFalse();
        assertThat(manager.isGreaterThan(editor)).isTrue();
    }

    @Test
    public void testRoleGreaterThanOrEqualTo() {
        ControlRole editor1 = ControlRoleManager.parseNodeRole("editor");
        ControlRole editor2 = ControlRoleManager.parseNodeRole("editor");
        assertThat(editor1.isEqualTo(editor2)).isTrue();
        assertThat(editor1.isGreaterThanOrEqualTo(editor2)).isTrue();
        assertThat(editor1.isGreaterThan(editor2)).isFalse();
    }

    @Test
    public void testRoleLessThan() {
        ControlRole editor = ControlRoleManager.parseNodeRole("editor");
        ControlRole manager = ControlRoleManager.parseNodeRole("manager");
        assertThat(editor.isEqualTo(manager)).isFalse();
        assertThat(editor.isLessThan(manager)).isTrue();
        assertThat(manager.isLessThan(editor)).isFalse();
    }

    @Test
    public void testRoleLessThanOrEqualTo() {
        ControlRole editor1 = ControlRoleManager.parseNodeRole("editor");
        ControlRole editor2 = ControlRoleManager.parseNodeRole("editor");
        assertThat(editor1.isEqualTo(editor2)).isTrue();
        assertThat(editor1.isLessThan(editor2)).isFalse();
        assertThat(editor1.isLessThanOrEqualTo(editor2)).isTrue();
    }

    @Test
    public void testUpdaterAndManagerRoleGreaterThan() {
        ControlRole manager = ControlRoleManager.parseNodeRole("manager");
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        assertThat(manager.isEqualTo(updater)).isFalse();
        assertThat(manager.isGreaterThan(updater)).isTrue();
        assertThat(updater.isGreaterThan(manager)).isFalse();
    }

    @Test
    public void testUpdaterAndEditorRoleGreaterThan() {
        ControlRole editor = ControlRoleManager.parseNodeRole("editor");
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        assertThat(editor.isEqualTo(updater)).isFalse();
        assertThat(editor.isGreaterThan(updater)).isTrue();
        assertThat(updater.isGreaterThan(editor)).isFalse();
    }

    @Test
    public void testUpdaterAndReaderRoleGreaterThan() {
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        ControlRole reader = ControlRoleManager.parseNodeRole("reader");
        assertThat(updater.isEqualTo(reader)).isFalse();
        assertThat(updater.isGreaterThan(reader)).isTrue();
        assertThat(reader.isGreaterThan(updater)).isFalse();
    }

    @Test
    public void testUpdaterRoleGreaterThanOrEqualTo() {
        ControlRole updater1 = ControlRoleManager.parseNodeRole("updater");
        ControlRole updater2 = ControlRoleManager.parseNodeRole("updater");
        assertThat(updater1.isEqualTo(updater2)).isTrue();
        assertThat(updater1.isGreaterThanOrEqualTo(updater2)).isTrue();
        assertThat(updater1.isGreaterThan(updater2)).isFalse();
    }

    @Test
    public void testUpdaterAndManagerRoleLessThan() {
        ControlRole manager = ControlRoleManager.parseNodeRole("manager");
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        assertThat(manager.isEqualTo(updater)).isFalse();
        assertThat(manager.isLessThan(updater)).isFalse();
        assertThat(updater.isLessThan(manager)).isTrue();
    }

    @Test
    public void testUpdaterAndEditorRoleLessThan() {
        ControlRole editor = ControlRoleManager.parseNodeRole("editor");
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        assertThat(editor.isEqualTo(updater)).isFalse();
        assertThat(editor.isLessThan(updater)).isFalse();
        assertThat(updater.isLessThan(editor)).isTrue();
    }

    @Test
    public void testUpdaterAndReaderRoleLessThan() {
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        ControlRole reader = ControlRoleManager.parseNodeRole("reader");
        assertThat(updater.isEqualTo(reader)).isFalse();
        assertThat(updater.isLessThan(reader)).isFalse();
        assertThat(reader.isLessThan(updater)).isTrue();
    }

    @Test
    public void testUpdaterRoleLessThanOrEqualTo() {
        ControlRole updater1 = ControlRoleManager.parseNodeRole("updater");
        ControlRole updater2 = ControlRoleManager.parseNodeRole("updater");
        assertThat(updater1.isEqualTo(updater2)).isTrue();
        assertThat(updater1.isLessThanOrEqualTo(updater2)).isTrue();
        assertThat(updater1.isLessThan(updater2)).isFalse();
    }

    @Test
    public void testCompareFieldRoleAndNodeUpdaterRole() {
        ControlRole nodeUpdaterRole = new NodeUpdaterRole();
        assertThat(nodeUpdaterRole.getPermissions()).contains(FieldPermission.READ_FIELD_DATA);
        assertThat(nodeUpdaterRole.getPermissions()).doesNotContain(FieldPermission.EDIT_FIELD_DATA);
    }

    @Test
    public void testCompareFieldRoleAndNodeRole() {
        ControlRole nodeRole = new NodeReaderRole();
        assertThat(nodeRole.getPermissions()).contains(FieldPermission.READ_FIELD_DATA);
        assertThat(nodeRole.getPermissions()).doesNotContain(FieldPermission.EDIT_FIELD_DATA);
    }

    @Test
    public void testUpdaterRoleCanCreateRow() {
        ControlRole updater = ControlRoleManager.parseNodeRole("updater");
        assertThat(updater.getPermissions()).contains(NodePermission.EDIT_CELL);
        assertThat(updater.getPermissions()).contains(NodePermission.CREATE_ROW);
    }
}
