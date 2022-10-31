package com.vikadata.api.modular.workspace.service.impl;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.model.ro.node.NodeOpRo;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class NodeRoleServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private INodeRoleService iNodeRoleService;

    @Autowired
    private IUnitService iUnitService;

    @Autowired
    private INodeService iNodeService;

    @Autowired
    private IMemberService iMemberService;

    @Autowired
    private ITeamService iTeamService;

    @Autowired
    private IControlRoleService iControlRoleService;

    @Test
    void givenNoExtendWhenAddExtendNodeRoleThenAddRootTeamRole() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo ro = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("datasheet")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), ro);
        iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(), nodeId, true);
    }

    @Test
    void givenMemberWithExtendControlWhenCheckControlStatusThenAddControl() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo firstOp = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String parentNodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), firstOp);
        // open the control permission of the node
        iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(), parentNodeId, false);
        // add users to the space station root department
        UserEntity user = iUserService.createUserByCli("test2@vikadata.com", "123456789", "12345678910");
        Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
        iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        // node adds new entry members as editable roles
        Long newMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
        Long newUnitId = iUnitService.getUnitIdByRefId(newMemberId);
        iNodeRoleService.addNodeRole(userSpace.getUserId(), parentNodeId, Node.EDITOR, CollUtil.newArrayList(newUnitId));
        // add a datasheet under the node
        NodeOpRo secondOp = new NodeOpRo().toBuilder()
                .parentId(parentNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("datasheet")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), secondOp);
        iNodeRoleService.enableNodeRole(userSpace.getUserId(), userSpace.getSpaceId(), nodeId, true);
    }

    @Test
    void givenNodeControlRolesWhenDeleteNodeRolesThenSuccess() {
        iControlRoleService.addControlRole(1L, "nod", CollUtil.newArrayList(1L, 2L), Node.READER);
        iControlRoleService.addControlRole(1L, "nod", CollUtil.newArrayList(1L), Node.OWNER);
        iControlRoleService.addControlRole(1L, "nod", CollUtil.newArrayList(3L, 4L), Node.EDITOR);
        List<ControlRoleInfo> controlRoleInfos = iNodeRoleService.deleteNodeRoles("nod", CollUtil.newArrayList(1L, 3L));
        assertThat(controlRoleInfos.size()).isEqualTo(2);
    }
}
