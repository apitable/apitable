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

package com.apitable.workspace.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.control.infrastructure.role.RoleConstants;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.dto.DatasheetSnapshot;
import com.apitable.workspace.dto.DatasheetSnapshot.Field;
import com.apitable.workspace.dto.DatasheetSnapshot.View;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.vo.FieldCollaboratorVO;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

public class FieldRoleServiceImplTest extends AbstractIntegrationTest {

    @Test
    void givenRootTeamWhenGetFieldRolesThenReturnRootTeamWithEditRole() {
        // When obtaining field permissions, if the field does not have permission to enable,
        // and the number table where it is located does not have permission to enable,
        // and the parent nodes of the number table do not have permission control enabled.
        // default administrator and root department
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, false, false);
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(2);
        assertThat(fieldCollaboratorVO.getRoles().get(0).getUnitRefId()).isNotNull();
        assertThat(fieldCollaboratorVO.getRoles().get(0).getTeamData()).isNotNull();
    }

    @Test
    void givenDatasheetWhenGetFieldRoles() {
        // When you obtain field permissions, if the field does not have the permission to enable,
        // and the table where it is located has the permission to enable.
        // default administrator and table permission roles
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, true, false);
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(3);
        assertThat(fieldCollaboratorVO.getRoles().get(0).getUnitRefId()).isNotNull();
        assertThat(fieldCollaboratorVO.getRoles().get(0).getTeamData()).isNotNull();
    }

    @Test
    void givenDatasheetWithParentNodeWhenGetFieldRoles() {
        // When obtaining field permissions, if the field does not have the enable permission,
        // and the number table where it is located does not have the enable permission, the parent node has the control role permission.
        // Default administrator and number table parent node permission roles.
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, true, true);
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(3);
    }

    @Test
    void givenWhenAddExtendFieldRoleThenAddRootTeamControl() {
        // When field permissions are automatically turned on,
        // If the field does not have permission to enable, and the number table where it is located does not have permission to enable,
        // and the parent nodes of the number table do not have permission control enabled.
        // the root department can be edited by default
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, false, false);
        String fieldId = getNoFirstFieldId(nodeId);
        assertThat(fieldId).isNotNull();
        iFieldRoleService.enableFieldRole(userSpace.getUserId(), nodeId, fieldId, true);
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isTrue();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(2);

    }

    @Test
    void givenWhenAddExtendFieldRoleThenAddDatasheetControl() {
        // When field permissions are automatically turned on,
        // If the field does not have the permission to enable,
        // and the number table to which it is located has the permission to enable.
        // the number table permission role is added by default.
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, true, false);
        String fieldId = getNoFirstFieldId(nodeId);
        assertThat(fieldId).isNotNull();
        iFieldRoleService.enableFieldRole(userSpace.getUserId(), nodeId, fieldId, true);
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isTrue();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(3);

    }

    @Test
    void givenWhenAutoDisableRoleExtendThenAddParentControl() {
        // When field permissions are automatically turned on,
        // If the field does not have permission to enable, and the table where it is located does not have permission to enable,
        // the parent node has permission to enable the control role.
        // Add parent node control role permissions by default.
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, true, true);
        String fieldId = getNoFirstFieldId(nodeId);
        assertThat(fieldId).isNotNull();
        iFieldRoleService.enableFieldRole(userSpace.getUserId(), nodeId, fieldId, true);
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isTrue();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(3);
    }

    @Test
    void givenNodeControlRolesWhenDeleteFieldRolesThenSuccess() {
        iControlRoleService.addControlRole(1L, "fld", CollUtil.newArrayList(1L, 2L),
            RoleConstants.Field.READER);
        iControlRoleService.addControlRole(1L, "fld", CollUtil.newArrayList(3L, 4L),
            RoleConstants.Field.EDITOR);
        Map<String, List<Long>> roleToUnitIds =
            iFieldRoleService.deleteFieldRoles("fld", CollUtil.newArrayList(1L, 3L));
        assertThat(roleToUnitIds.keySet().size()).isEqualTo(2);
        assertThat(roleToUnitIds.get(RoleConstants.Field.READER).get(0)).isEqualTo(1L);
        assertThat(roleToUnitIds.get(RoleConstants.Field.EDITOR).get(0)).isEqualTo(3L);
    }

    private String initNode(MockUserSpace userSpace, boolean isAddControl, boolean isExtend) {
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        String controlNodeId = null;
        NodeOpRo ro = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.DATASHEET.getNodeType())
            .nodeName("datasheet")
            .build();
        if (isExtend) {
            NodeOpRo parentOp = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
            String parentNodeId =
                iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), parentOp);
            controlNodeId = parentNodeId;
            ro.setParentId(parentNodeId);
        }
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), ro);
        if (controlNodeId == null) {
            controlNodeId = nodeId;
        }
        if (isAddControl) {
            iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(),
                controlNodeId, false);
            // add users to the space root department
            UserEntity user = iUserService.createUserByEmail("test2@apitable.com");
            Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
            iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
            // node adds new entry members to manageable roles
            Long newMemberId =
                iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
            Long newUnitId = iUnitService.getUnitIdByRefId(newMemberId);
            iNodeRoleService.addNodeRole(userSpace.getUserId(), controlNodeId, Node.MANAGER,
                CollUtil.newArrayList(newUnitId));
            // add a readable role to the root department
            Long rootTeamUnitId = iTeamService.getRootTeamUnitId(userSpace.getSpaceId());
            iNodeRoleService.addNodeRole(userSpace.getUserId(), controlNodeId, Node.READER,
                CollUtil.newArrayList(rootTeamUnitId));
        }
        return nodeId;
    }

    private String getNoFirstFieldId(String datasheetId) {
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(datasheetId);
        View view = datasheetSnapshot.getMeta().getViews().get(0);
        String firstFieldId = view.getColumns().get(0).getFieldId();
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        for (String next : fieldMap.keySet()) {
            if (!firstFieldId.equals(next)) {
                return next;
            }
        }
        return null;
    }

    @Test
    void bugAboutGivenDatasheetWhenGetFieldRoles() {
        // When you obtain field permissions, if the field does not have the permission to enable, and the table where it is located has the permission to enable.
        // default administrator and table permission roles
        // If the control permission editing role is only owner, an in error will occur and has been fixed now.
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo ro = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.DATASHEET.getNodeType())
            .nodeName("datasheet")
            .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), ro);
        iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(), nodeId,
            false);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        iNodeRoleService.addNodeRole(userSpace.getUserId(), nodeId, Node.READER,
            CollUtil.newArrayList(unitId));
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(1);
    }
}
