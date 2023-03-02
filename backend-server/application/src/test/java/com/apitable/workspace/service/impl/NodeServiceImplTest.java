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

import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodePathVo;
import java.util.ArrayList;
import java.util.Collections;
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
    void testGetPathParentNode() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        List<String> rootPathParentNode = iNodeService.getPathParentNode(rootNodeId);
        assertThat(rootPathParentNode).isEmpty();

        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<String> pathParentNodes = iNodeService.getPathParentNode(secondLevelFolderId);
        assertThat(pathParentNodes.size()).isEqualTo(2);
    }

    @Test
    void testGetParentPathByNodeId() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<NodePathVo> parentPathNodes = iNodeService.getParentPathByNodeId(spaceId, secondLevelFolderId);
        assertThat(parentPathNodes.size()).isEqualTo(3);

        NodePathVo nodePathVo = parentPathNodes.get(0);
        assertThat(nodePathVo.getNodeId()).isEqualTo(rootNodeId);
        String spaceName = iSpaceService.getNameBySpaceId(spaceId);
        assertThat(nodePathVo.getNodeName()).isEqualTo(spaceName);
    }

    @Test
    void testGetParentPathNodes() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        List<NodeBaseInfoDTO> parentPathNodes =
            iNodeService.getParentPathNodes(Collections.singletonList(rootNodeId));
        assertThat(parentPathNodes.size()).isEqualTo(0);
        // first level folder id
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("node")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        String firstLevelFolderId2 = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<NodeBaseInfoDTO> secondLevelParentPathNodes =
            iNodeService.getParentPathNodes(Collections.singletonList(secondLevelFolderId));
        assertThat(secondLevelParentPathNodes.size()).isEqualTo(2);
        // third level folder id
        op.setParentId(secondLevelFolderId);
        String thirdLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<String> nodeIds = new ArrayList<>();
        nodeIds.add(firstLevelFolderId2);
        nodeIds.add(thirdLevelFolderId);
        List<NodeBaseInfoDTO> parentPathNodes1 = iNodeService.getParentPathNodes(nodeIds);
        assertThat(parentPathNodes1.size()).isEqualTo(4);
        // The upper and lower level nodes exist at the same time
        nodeIds.add(firstLevelFolderId);
        List<NodeBaseInfoDTO> parentPathNodes2 = iNodeService.getParentPathNodes(nodeIds);
        assertThat(parentPathNodes2.size()).isEqualTo(4);
    }

    @Test
    void testGetNodeIdsInNodeTreeWithAssignDepth() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("node")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level datasheet id
        op.setType(NodeType.DATASHEET.getNodeType());
        iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<String> nodeIds = iNodeService.getNodeIdsInNodeTree(rootNodeId, 2);
        assertThat(nodeIds.size()).isEqualTo(4);
    }

    @Test
    void testGetNodeTreeWithAssignSortAtSameLevel() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long userId = userSpace.getUserId();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("node")
            .build();
        String thirdFolderId = iNodeService.createNode(userId, spaceId, op);
        String firstFolderId = iNodeService.createNode(userId, spaceId, op);
        op.setPreNodeId(firstFolderId);
        String secondFolderId = iNodeService.createNode(userId, spaceId, op);

        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        NodeInfoTreeVo nodeTree = iNodeService.getNodeTree(spaceId, rootNodeId, memberId, 2);
        assertThat(nodeTree.getChildrenNodes().size()).isEqualTo(3);
        assertThat(nodeTree.getChildrenNodes().get(0).getNodeId()).isEqualTo(firstFolderId);
        assertThat(nodeTree.getChildrenNodes().get(1).getNodeId()).isEqualTo(secondFolderId);
        assertThat(nodeTree.getChildrenNodes().get(2).getNodeId()).isEqualTo(thirdFolderId);
    }

    @Test
    void testGetChildNodesByNodeIdWithNullType() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("datasheet")
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
                .nodeName("datasheet")
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
