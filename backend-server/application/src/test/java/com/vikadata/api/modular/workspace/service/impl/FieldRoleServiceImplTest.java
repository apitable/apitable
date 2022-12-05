package com.vikadata.api.modular.workspace.service.impl;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants;
import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Node;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.workspace.ro.NodeOpRo;
import com.vikadata.api.workspace.vo.FieldCollaboratorVO;
import com.vikadata.api.enterprise.control.service.IControlRoleService;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.workspace.dto.DatasheetSnapshot;
import com.vikadata.api.workspace.dto.DatasheetSnapshot.Field;
import com.vikadata.api.workspace.dto.DatasheetSnapshot.View;
import com.vikadata.api.workspace.service.IDatasheetMetaService;
import com.vikadata.api.workspace.service.IFieldRoleService;
import com.vikadata.api.workspace.service.INodeRoleService;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author tao
 */
public class FieldRoleServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private IFieldRoleService iFieldRoleService;

    @Autowired
    private INodeRoleService iNodeRoleService;

    @Autowired
    private INodeService iNodeService;

    @Autowired
    private ITeamService iTeamService;

    @Autowired
    private IUnitService iUnitService;

    @Autowired
    private IMemberService iMemberService;

    @Autowired
    private IDatasheetMetaService iDatasheetMetaService;

    @Autowired
    private IControlRoleService iControlRoleService;

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
        assertThat(fieldCollaboratorVO.getMembers().size()).isEqualTo(1);
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
        assertThat(fieldCollaboratorVO.getMembers().size()).isEqualTo(2);
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
        assertThat(fieldCollaboratorVO.getMembers().size()).isEqualTo(2);
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
        assertThat(fieldCollaboratorVO.getMembers().size()).isEqualTo(1);

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
        assertThat(fieldCollaboratorVO.getMembers().size()).isEqualTo(2);

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
        assertThat(fieldCollaboratorVO.getMembers().size()).isEqualTo(2);
    }

    @Test
    void givenNodeControlRolesWhenDeleteFieldRolesThenSuccess() {
        iControlRoleService.addControlRole(1L, "fld", CollUtil.newArrayList(1L, 2L), RoleConstants.Field.READER);
        iControlRoleService.addControlRole(1L, "fld", CollUtil.newArrayList(3L, 4L), RoleConstants.Field.EDITOR);
        Map<String, List<Long>> roleToUnitIds = iFieldRoleService.deleteFieldRoles("fld", CollUtil.newArrayList(1L, 3L));
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
            String parentNodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), parentOp);
            controlNodeId = parentNodeId;
            ro.setParentId(parentNodeId);
        }
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), ro);
        if (controlNodeId == null) {
            controlNodeId = nodeId;
        }
        if(isAddControl) {
            iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(), controlNodeId, false);
            // add users to the space root department
            UserEntity user = iUserService.createUserByCli("test2@vikadata.com", "123456789", "12345678910");
            Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
            iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
            // node adds new entry members to manageable roles
            Long newMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
            Long newUnitId = iUnitService.getUnitIdByRefId(newMemberId);
            iNodeRoleService.addNodeRole(userSpace.getUserId(), controlNodeId, Node.MANAGER, CollUtil.newArrayList(newUnitId));
            // add a readable role to the root department
            Long rootTeamUnitId = iTeamService.getRootTeamUnitId(userSpace.getSpaceId());
            iNodeRoleService.addNodeRole(userSpace.getUserId(), controlNodeId, Node.READER, CollUtil.newArrayList(rootTeamUnitId));
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
        iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(), nodeId, false);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        iNodeRoleService.addNodeRole(userSpace.getUserId(), nodeId, Node.READER, CollUtil.newArrayList(unitId));
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(1);
    }
}
