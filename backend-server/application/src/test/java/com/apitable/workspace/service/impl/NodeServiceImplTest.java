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

import static com.apitable.workspace.enums.PermissionException.ROOT_NODE_OP_DENIED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.util.Lists.list;

import cn.hutool.json.JSONUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.DefaultSubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.mock.bean.MockSubscriptionFeature;
import com.apitable.mock.bean.MockSubscriptionInfo;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.dto.NodeTreeDTO;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.ro.NodeEmbedPageRo;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.ro.NodeRelRo;
import com.apitable.workspace.ro.NodeUpdateOpRo;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.workspace.vo.NodePathVo;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;

public class NodeServiceImplTest extends AbstractIntegrationTest {

    @MockBean
    private EntitlementServiceFacade entitlementServiceFacade;

    @Test
    void testGetSubNodeList() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        initNodeTreeMockData(userSpace.getSpaceId(), rootNodeId);
        List<NodeEntity> subNodeList = iNodeService.getSubNodeList("L1");
        assertThat(subNodeList).isNotEmpty();
    }

    @Test
    void testFindSameNameInSameLevelWhenExist() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        initNodeTreeMockData(userSpace.getSpaceId(), rootNodeId);
        Optional<NodeEntity> nodeOptional = iNodeService.findSameNameInSameLevel("L1", "L2-1");
        assertThat(nodeOptional).isPresent();
    }

    @Test
    void testFindSameNameInSameLevelWhenNotExist() {
        Optional<NodeEntity> nodeOptional = iNodeService.findSameNameInSameLevel("L1", "L1-1");
        assertThat(nodeOptional).isNotPresent();
    }

    @Test
    void testCreateDatasheetNode() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo nodeOpRo = NodeOpRo.builder()
            .parentId(rootNodeId)
            .type(NodeType.DATASHEET.getNodeType())
            .build();
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), nodeOpRo);
        assertThat(nodeId).isNotBlank();
    }

    @Test
    void testCreateFolderNodeWithoutOverLimit() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        initNodeTreeMockData(userSpace.getSpaceId(), rootNodeId);
        NodeOpRo nodeOpRo = NodeOpRo.builder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .build();
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        assertThatNoException()
            .isThrownBy(() -> iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(),
                nodeOpRo));
    }

    @Test
    void testCreateNotFolderNodeWithOverLimit() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        initNodeTreeMockData(userSpace.getSpaceId(), rootNodeId);
        NodeOpRo nodeOpRo = NodeOpRo.builder()
            .parentId(rootNodeId)
            .type(NodeType.DATASHEET.getNodeType())
            .build();
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        assertThatThrownBy(
            () -> iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), nodeOpRo))
            .isInstanceOf(BusinessException.class);
    }

    @Test
    void testCreateAiChatBotNode() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo nodeOpRo = NodeOpRo.builder()
            .parentId(rootNodeId)
            .type(NodeType.AI_CHAT_BOT.getNodeType())
            .checkDuplicateName(false)
            .build();
        MockSubscriptionFeature feature = new MockSubscriptionFeature();
        feature.setAiAgentNums(-1L);
        feature.setFileNodeNums(5L);
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), nodeOpRo);
        assertThat(nodeId).isNotBlank().startsWith("ai");
    }

    @Test
    void testUpdateAiNodeName() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo nodeOpRo = NodeOpRo.builder()
            .parentId(rootNodeId)
            .type(NodeType.AI_CHAT_BOT.getNodeType())
            .checkDuplicateName(false)
            .build();
        MockSubscriptionFeature feature = new MockSubscriptionFeature();
        feature.setAiAgentNums(-1L);
        feature.setFileNodeNums(-1L);
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), nodeOpRo);
        assertThat(nodeId).isNotBlank().startsWith("ai");
        String changedAiNodeName = "Changed AI Node";
        NodeUpdateOpRo updateOpRo = new NodeUpdateOpRo();
        updateOpRo.setNodeName(changedAiNodeName);
        iNodeService.edit(userSpace.getUserId(), nodeId, updateOpRo);

        NodeEntity nodeEntity = iNodeService.getByNodeId(nodeId);
        assertThat(nodeEntity).isNotNull();
        assertThat(nodeEntity.getNodeName()).isEqualTo(changedAiNodeName);
    }

    @Test
    void testCopyNodeToSpace() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long userId = userSpace.getUserId();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String firstLevelFolderId = iNodeService.createNode(userId, spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        iNodeService.createNode(userId, spaceId, op);

        String toSaveNodeId = iNodeService.copyNodeToSpace(userId,
            spaceId, rootNodeId, firstLevelFolderId,
            NodeCopyOptions.builder().copyData(true).verifyNodeCount(true).build());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        List<NodeInfoVo> nodes =
            iNodeService.getChildNodesByNodeId(spaceId, memberId, toSaveNodeId, null);
        assertThat(nodes).isNotEmpty();
        assertThat(nodes.size()).isEqualTo(1);
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
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), folder);
        // when
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), nodeId);
    }

    @Test
    void givenRootNodeAndTrueRootManageWhenCheckOpThenPass() {
        // To the root node, but the spatial attribute allows member root directory management
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(true);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // when
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(),
            rootNodeId);
    }

    @Test
    void givenRootNodeAndFalseRootManageButUserAdminWhenCheckOpThenPass() {
        // Root node, space attribute does not allow member root directory management, but the person is the administrator
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(false);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // when
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(),
            rootNodeId);
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
        Long newMemberId =
            iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
        // when
        assertThatThrownBy(() ->
            iNodeService.checkEnableOperateNodeBySpaceFeature(newMemberId, userSpace.getSpaceId(),
                rootNodeId)
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String parentNodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), firstOp);
        // add node under node
        NodeOpRo secondOp = new NodeOpRo().toBuilder()
            .parentId(parentNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), secondOp);
        boolean nodeNoInRootFolder =
            iNodeService.isNodeBelongRootFolder(userSpace.getSpaceId(), nodeId);
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        boolean nodeInRootFolder =
            iNodeService.isNodeBelongRootFolder(userSpace.getSpaceId(), nodeId);
        assertThat(nodeInRootFolder).isTrue();
    }

    @Test
    void testSortNodeAtSameLevel() {
        // 1
        NodeTreeDTO node1 = new NodeTreeDTO();
        node1.setNodeId("1");
        node1.setPreNodeId(null);
        // 2
        NodeTreeDTO node2 = new NodeTreeDTO();
        node2.setNodeId("2");
        node2.setPreNodeId("1");
        // 3
        NodeTreeDTO node3 = new NodeTreeDTO();
        node3.setNodeId("3");
        node3.setPreNodeId("2");
        // 4
        NodeTreeDTO node4 = new NodeTreeDTO();
        node4.setNodeId("4");
        node4.setPreNodeId("3");
        // 5
        NodeTreeDTO node5 = new NodeTreeDTO();
        node5.setNodeId("5");
        node5.setPreNodeId("4");

        List<NodeTreeDTO> nodes = list(node3, node5, node1, node4, node2);
        List<String> nodeIds = iNodeService.sortNodeAtSameLevel(nodes);
        assertThat(nodeIds).isNotEmpty();
        assertThat(nodeIds).containsExactly("1", "2", "3", "4", "5");
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<NodePathVo> parentPathNodes =
            iNodeService.getParentPathByNodeId(spaceId, secondLevelFolderId);
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
            iNodeService.getParentPathNodes(Collections.singletonList(rootNodeId), false);
        assertThat(parentPathNodes.size()).isEqualTo(0);
        // first level folder id
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("node")
            .build();
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String firstLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        String firstLevelFolderId2 = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<NodeBaseInfoDTO> secondLevelParentPathNodes =
            iNodeService.getParentPathNodes(Collections.singletonList(secondLevelFolderId), false);
        assertThat(secondLevelParentPathNodes.size()).isEqualTo(2);
        // third level folder id
        op.setParentId(secondLevelFolderId);
        String thirdLevelFolderId = iNodeService.createNode(userSpace.getUserId(), spaceId, op);
        List<String> nodeIds = new ArrayList<>();
        nodeIds.add(firstLevelFolderId2);
        nodeIds.add(thirdLevelFolderId);
        List<NodeBaseInfoDTO> parentPathNodes1 = iNodeService.getParentPathNodes(nodeIds, true);
        assertThat(parentPathNodes1.size()).isEqualTo(5);
        // The upper and lower level nodes exist at the same time
        nodeIds.add(firstLevelFolderId);
        List<NodeBaseInfoDTO> parentPathNodes2 = iNodeService.getParentPathNodes(nodeIds, true);
        assertThat(parentPathNodes2.size()).isEqualTo(5);
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
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
        MockSubscriptionFeature feature = new MockSubscriptionFeature();
        feature.setFileNodeNums(-1L);
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        List<NodeInfoVo> nodes =
            iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, null);
        List<String> childNodeIds =
            nodes.stream().map(NodeInfoVo::getNodeId).toList();
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
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        List<NodeInfoVo> nodes =
            iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId,
                NodeType.FOLDER);
        List<String> childNodeIds =
            nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
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
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        List<NodeInfoVo> nodes =
            iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId,
                NodeType.FOLDER);
        List<String> childNodeIds =
            nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isTrue();
    }

    @Test
    void testCreateEmbedPageNode() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeRelRo nodeRelRo = new NodeRelRo();
        NodeEmbedPageRo nodeEmbedPageRo = new NodeEmbedPageRo();
        nodeEmbedPageRo.setType("figma");
        nodeEmbedPageRo.setUrl("test");
        nodeRelRo.setEmbedPage(nodeEmbedPageRo);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.CUSTOM_PAGE.getNodeType())
            .nodeName("embed_page")
            .extra(nodeRelRo)
            .build();
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        String nodeId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        List<NodeInfoVo> nodes =
            iNodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId,
                NodeType.CUSTOM_PAGE);
        List<String> childNodeIds =
            nodes.stream().map(NodeInfoVo::getNodeId).toList();
        assertThat(childNodeIds.contains(nodeId)).isTrue();
    }

    @Test
    void testUpdateNodeEmbedPageWithNullExtra() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        MockSubscriptionFeature feature = new MockSubscriptionFeature();
        feature.setAiAgentNums(-1L);
        feature.setFileNodeNums(-1L);
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        NodeOpRo createRo = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.CUSTOM_PAGE.getNodeType())
            .nodeName("embed_page")
            .build();
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), createRo);
        NodeUpdateOpRo updateOpRo = new NodeUpdateOpRo();
        NodeEmbedPageRo nodeEmbedPageRo = new NodeEmbedPageRo();
        nodeEmbedPageRo.setType("figma");
        nodeEmbedPageRo.setUrl("test");
        updateOpRo.setEmbedPage(nodeEmbedPageRo);
        iNodeService.edit(userSpace.getUserId(), nodeId, updateOpRo);

        NodeEntity nodeEntity = iNodeService.getByNodeId(nodeId);
        assertThat(JSONUtil.toBean(nodeEntity.getExtra(), NodeUpdateOpRo.class))
            .isEqualTo(updateOpRo);
    }

    @Test
    void testUpdateNodeEmbedPageWithNotNullExtra() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        MockSubscriptionFeature feature = new MockSubscriptionFeature();
        feature.setAiAgentNums(-1L);
        feature.setFileNodeNums(-1L);
        SubscriptionInfo subscriptionInfo = new MockSubscriptionInfo(feature);
        Mockito.doReturn(subscriptionInfo).when(entitlementServiceFacade)
            .getSpaceSubscription(userSpace.getSpaceId());
        NodeOpRo createRo = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.CUSTOM_PAGE.getNodeType())
            .nodeName("embed_page")
            .build();
        String nodeId =
            iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), createRo);
        NodeUpdateOpRo updateOpRo = new NodeUpdateOpRo();
        NodeEmbedPageRo nodeEmbedPageRo = new NodeEmbedPageRo();
        nodeEmbedPageRo.setType("figma");
        nodeEmbedPageRo.setUrl("test");
        updateOpRo.setEmbedPage(nodeEmbedPageRo);
        iNodeService.edit(userSpace.getUserId(), nodeId, updateOpRo);
        NodeEmbedPageRo nodeEmbedPageRo2 = new NodeEmbedPageRo();
        nodeEmbedPageRo2.setType("document");
        nodeEmbedPageRo2.setUrl("test");
        updateOpRo.setEmbedPage(nodeEmbedPageRo2);
        iNodeService.edit(userSpace.getUserId(), nodeId, updateOpRo);
        NodeEntity nodeEntity = iNodeService.getByNodeId(nodeId);
        assertThat(JSONUtil.toBean(nodeEntity.getExtra(), NodeUpdateOpRo.class)).isEqualTo(
            updateOpRo);
    }

}
