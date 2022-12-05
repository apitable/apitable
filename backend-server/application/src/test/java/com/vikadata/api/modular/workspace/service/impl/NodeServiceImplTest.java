package com.vikadata.api.modular.workspace.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.space.vo.SpaceGlobalFeature;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.workspace.ro.NodeOpRo;
import com.vikadata.api.workspace.vo.NodeInfoVo;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static com.vikadata.api.workspace.enums.PermissionException.ROOT_NODE_OP_DENIED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * @author tao
 */
public class NodeServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private INodeService nodeService;

    @Autowired
    private ITeamService iTeamService;

    @Test
    void givenNotRootNodeWhenCheckNodeOpThenPass() {
        // the given node is not the root directory
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo folder = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        String nodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), folder);
        // when
        nodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), nodeId);
    }

    @Test
    void givenRootNodeAndTrueRootManageWhenCheckOpThenPass() {
        // To the root node, but the spatial attribute allows member root directory management
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(true);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // when
        nodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), rootNodeId);
    }

    @Test
    void givenRootNodeAndFalseRootManageButUserAdminWhenCheckOpThenPass() {
       // Root node, space attribute does not allow member root directory management, but the person is the administrator
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(false);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // when
        nodeService.checkEnableOperateNodeBySpaceFeature(memberId, userSpace.getSpaceId(), rootNodeId);
    }

    @Test
    void givenRootNodeAndFalseRootManageAndNoAdminWhenCheckOpThenNoPass() {
        // root node, the space attribute does not allow member root directory management, and the personnel is not the administrator
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        feature.setRootManageable(false);
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(), feature);
        // add users to the space root department
        UserEntity user = iUserService.createUserByCli("test2@vikadata.com", "123456789", "12345678910");
        Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
        iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        Long newMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), userSpace.getSpaceId());
        // when
        assertThatThrownBy(() ->
            nodeService.checkEnableOperateNodeBySpaceFeature(newMemberId, userSpace.getSpaceId(), rootNodeId)
        ).isInstanceOf(BusinessException.class).hasMessage(ROOT_NODE_OP_DENIED.getMessage());
    }

    @Test
    void givenNodeNoInRootWhenGetIsNodeBelongRootFolderThenFalse() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo firstOp = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String parentNodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), firstOp);
        // add node under node
        NodeOpRo secondOp = new NodeOpRo().toBuilder()
                .parentId(parentNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), secondOp);
        boolean nodeNoInRootFolder = nodeService.isNodeBelongRootFolder(userSpace.getSpaceId(), nodeId);
        assertThat(nodeNoInRootFolder).isFalse();
    }

    @Test
    void givenNodeInRootWhenGetIsNodeBelongRootFolderThenTrue() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        boolean nodeInRootFolder = nodeService.isNodeBelongRootFolder(userSpace.getSpaceId(), nodeId);
        assertThat(nodeInRootFolder).isTrue();
    }

    @Test
    void testGetChildNodesByNodeIdWithNullType() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<NodeInfoVo> nodes = nodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, null);
        List<String> childNodeIds = nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isTrue();
    }

    @Test
    void testGetChildNodesByNodeIdWithFolderType() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.DATASHEET.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<NodeInfoVo> nodes = nodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, NodeType.FOLDER);
        List<String> childNodeIds = nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isFalse();
    }

    @Test
    void testGetChildNodesByNodeIdWithFolderTypeMatch() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        NodeOpRo op = new NodeOpRo().toBuilder()
                .parentId(rootNodeId)
                .type(NodeType.FOLDER.getNodeType())
                .nodeName("folder")
                .build();
        String nodeId = nodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(), op);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<NodeInfoVo> nodes = nodeService.getChildNodesByNodeId(userSpace.getSpaceId(), memberId, rootNodeId, NodeType.FOLDER);
        List<String> childNodeIds = nodes.stream().map(NodeInfoVo::getNodeId).collect(Collectors.toList());
        assertThat(childNodeIds.contains(nodeId)).isTrue();
    }

}
