package com.vikadata.api.modular.workspace.service.impl;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.control.role.RoleConstants;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.model.ro.node.NodeOpRo;
import com.vikadata.api.model.vo.datasheet.FieldCollaboratorVO;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot.Field;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot.View;
import com.vikadata.api.modular.workspace.service.IDatasheetMetaService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.UserEntity;

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
        // 获取字段权限时，如果字段没有开启权限，且所在的数表没有开启权限且数表的父节点们没有开启权限控制。
        // 默认管理员和根部门。
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, false, false);
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(2);
    }

    @Test
    void givenDatasheetWhenGetFieldRoles() {
        // 获取字段权限时，如果字段没有开启权限，且所在的数表开启权限。
        // 默认管理员和数表权限角色。
        MockUserSpace userSpace = createSingleUserAndSpace();
        String nodeId = initNode(userSpace, true, false);
        DatasheetSnapshot datasheetSnapshot = iDatasheetMetaService.getMetaByDstId(nodeId);
        Map<String, Field> fieldMap = datasheetSnapshot.getMeta().getFieldMap();
        Iterator<String> iterator = fieldMap.keySet().iterator();
        String fieldId = iterator.next();
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(nodeId, fieldId);
        assertThat(fieldCollaboratorVO.getEnabled()).isFalse();
        assertThat(fieldCollaboratorVO.getRoles().size()).isEqualTo(3);
    }

    @Test
    void givenDatasheetWithParentNodeWhenGetFieldRoles() {
        // 获取字段权限时，如果字段没有开启权限，且所在的数表没开启权限而父节点开启控制角色权限。
        // 默认管理员和数表父节点权限角色。
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
        // 自动开启字段权限时，
        // 如果字段没有开启权限，且所在的数表没有开启权限且数表的父节点们没有开启权限控制。
        // 默认添加根部门可编辑权限。
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
        // 自动开启字段权限时，
        // 如果字段没有开启权限，且所在的数表开启权限。
        // 默认添加数表权限角色。
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
        // 自动开启字段权限时，
        // 如果字段没有开启权限，且所在的数表没开启权限而父节点开启控制角色权限。
        // 默认添加父节点控制角色权限。
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
            // 添加用户进入空间站根部门
            UserEntity user = iUserService.createUserByCli("test2@vikadata.com", "123456789", "12345678910");
            Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
            iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
            // 节点添加新进入成员为可管理角色
            Long newMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
            Long newUnitId = iUnitService.getUnitIdByRefId(newMemberId);
            iNodeRoleService.addNodeRole(userSpace.getUserId(), controlNodeId, Node.MANAGER, CollUtil.newArrayList(newUnitId));
            // 为根部门添加可阅读角色
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
        // 获取字段权限时，如果字段没有开启权限，且所在的数表开启权限。
        // 默认管理员和数表权限角色。
        // 如果控制权限编辑角色只有owner，那么会发生in报错，现在已修复。
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
