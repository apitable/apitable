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

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.core.exception.BusinessException;

import static com.apitable.workspace.enums.PermissionException.ROOT_NODE_OP_DENIED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * @author tao
 */
public class NodeServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testCreateDatasheetNode() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo nodeOpRo = NodeOpRo.builder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), nodeOpRo);
        assertThat(nodeId).isNotBlank();
    }

    @Test
    void givenNotRootNodeWhenCheckNodeOpThenPass() {
        // the given node is not the root directory
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo folder = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), folder);
        // when
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), nodeId);
    }

    @Test
    void givenRootNodeAndTrueRootManageWhenCheckOpThenPass() {
        // To the root node, but the spatial attribute allows member root directory management
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(true);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // when
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), rootNodeId);
    }

    @Test
    void givenRootNodeAndFalseRootManageButUserAdminWhenCheckOpThenPass() {
        // Root node, space attribute does not allow member root directory management, but the person is the administrator
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(false);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // when
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), rootNodeId);
    }

    @Test
    void givenRootNodeAndFalseRootManageAndNoAdminWhenCheckOpThenNoPass() {
        // root node, the space attribute does not allow member root directory management, and the personnel is not the administrator
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(false);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // add users to the space root department
        UserEntity user = iUserService.createUserByEmail("test2@apitable.com");
        Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
        iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        Long newMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
        // when
        assertThatThrownBy(() ->
                iNodeService.checkEnableOperateNodeBySpaceFeature(newMemberId, userSpace.getSpaceId(), rootNodeId)
        ).isInstanceOf(BusinessException.class).hasMessage(ROOT_NODE_OP_DENIED.getMessage());
    }

    @Test
    void givenNodeNoInRootWhenGetIsNodeBelongRootFolderThenFalse() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo firstOp = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String parentNodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), firstOp);
        // add node under node
        NodeOpRo secondOp = new NodeOpRo().toBuilder()
                .parentId(parentNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), secondOp);
        boolean nodeNoInRootFolder = iNodeService.isNodeBelongRootFolder(userSpace.getSpaceId(), nodeId);
        assertThat(nodeNoInRootFolder).isFalse();
    }

    @Test
    void givenNodeInRootWhenGetIsNodeBelongRootFolderThenTrue() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        boolean nodeInRootFolder = iNodeService.isNodeBelongRootFolder(userSpace.getSpaceId(), nodeId);
        assertThat(nodeInRootFolder).isTrue();
    }

    @Test
    void testGetChildNodesByNodeIdWithNullType() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<NodeInfoVo> nodes = iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, null);
        List<String> childNodeIds = nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isTrue();
    }

    @Test
    void testGetChildNodesByNodeIdWithFolderType() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<NodeInfoVo> nodes = iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, NodeType.FOLDER);
        List<String> childNodeIds = nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isFalse();
    }

    @Test
    void testGetChildNodesByNodeIdWithFolderTypeMatch() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<NodeInfoVo> nodes = iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, NodeType.FOLDER);
        List<String> childNodeIds = nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isTrue();
    }

}
