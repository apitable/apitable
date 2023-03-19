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
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlRoleService;
import com.apitable.control.service.IControlService;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.SimpleNodeInfo;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

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

    @Resource
    private IControlService iControlService;

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
        UserEntity user = iUserService.createUserByEmail("test2@apitable.com");
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

    @Test
    void testGetNodeExtendNodeId() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        String rootExtendNodeId = iNodeRoleService.getNodeExtendNodeId(rootNodeId);
        assertThat(rootExtendNodeId).isNull();

        // first level folder id
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // create permission control unit
        iControlService.create(userSpace.getUserId(), spaceId, firstLevelFolderId, ControlType.NODE);
        String firstExtendNodeId = iNodeRoleService.getNodeExtendNodeId(firstLevelFolderId);
        assertThat(firstExtendNodeId).isEqualTo(firstLevelFolderId);

        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        String secondExtendNodeId = iNodeRoleService.getNodeExtendNodeId(secondLevelFolderId);
        assertThat(secondExtendNodeId).isEqualTo(firstLevelFolderId);
    }

    @Test
    void testGetNodeInfoWithPermissionStatus() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        // first level folder id
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // create permission control unit
        iControlService.create(userSpace.getUserId(), spaceId, firstLevelFolderId, ControlType.NODE);
        List<String> nodeIds = new ArrayList<>();
        nodeIds.add(firstLevelFolderId);
        List<SimpleNodeInfo> nodes = iNodeRoleService.getNodeInfoWithPermissionStatus(nodeIds);
        assertThat(nodes.size()).isEqualTo(2);
        Optional<SimpleNodeInfo> first =
            nodes.stream().filter(i -> firstLevelFolderId.equals(i.getNodeId())).findFirst();
        assertThat(first.isPresent()).isTrue();
        assertThat(first.get().getExtend()).isFalse();

        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        nodeIds.add(secondLevelFolderId);
        List<SimpleNodeInfo> nodes2 = iNodeRoleService.getNodeInfoWithPermissionStatus(nodeIds);
        assertThat(nodes2.size()).isEqualTo(3);
    }
}
