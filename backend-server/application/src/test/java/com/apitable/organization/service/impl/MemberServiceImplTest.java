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

package com.apitable.organization.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.space.entity.SpaceInviteRecordEntity;
import com.apitable.space.mapper.SpaceInviteRecordMapper;
import com.apitable.starter.mail.autoconfigure.EmailMessage;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.ro.NodeOpRo;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * member service test
 *
 * @author Shawn Deng
 */
public class MemberServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private SpaceInviteRecordMapper spaceInviteRecordMapper;

    @Test
    public void testInvitationWithoutExistUser() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        doNothing().when(mailTemplate).send(any(EmailMessage.class));
        List<String> emails = list("test@apitable.com");
        iMemberService.emailInvitation(mockUserSpace.getUserId(), mockUserSpace.getSpaceId(),
            emails);
    }

    @Test
    void testGetTotalActiveMemberCountBySpaceId() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        long memberCount =
            iMemberService.getTotalActiveMemberCountBySpaceId(mockUserSpace.getSpaceId());
        assertThat(memberCount).isEqualTo(1L);
    }


    @Test
    void testGetMemberIdIsNull() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        Long memberId =
            iMemberService.getMemberIdByUserIdAndSpaceId(mockUserSpace.getUserId(), "");
        assertThat(memberId).isEqualTo(null);
    }

    @Test
    void testShouldPreventInvitationForFreeSpace() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        for (int i = 0; i < 10; i++) {
            SpaceInviteRecordEntity entity = new SpaceInviteRecordEntity();
            entity.setInviteSpaceId(mockUserSpace.getSpaceId());
            spaceInviteRecordMapper.insert(entity);
        }
        boolean prevent = iMemberService.shouldPreventInvitation(mockUserSpace.getSpaceId());
        assertThat(prevent).isTrue();
    }

    @Test
    void testShouldNotPreventInvitationForFreeSpace() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        for (int i = 0; i < 9; i++) {
            SpaceInviteRecordEntity entity = new SpaceInviteRecordEntity();
            entity.setInviteSpaceId(mockUserSpace.getSpaceId());
            spaceInviteRecordMapper.insert(entity);
        }
        boolean prevent = iMemberService.shouldPreventInvitation(mockUserSpace.getSpaceId());
        assertThat(prevent).isFalse();
    }

    @Test
    void testRemoveMemberFromSpaceAndDeletePrivateNode() {
        MockUserSpace mockUserAdmin = createSingleUserAndSpace();
        MockUserSpace mockUser = createSingleUserAndSpace();
        String email = iUserService.getEmailByUserId(mockUser.getUserId());
        iMemberService.createInvitationMember(mockUserAdmin.getUserId(), mockUserAdmin.getSpaceId(),
            Collections.singletonList(email));
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(mockUser.getUserId(),
            mockUserAdmin.getSpaceId());
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        // create private node
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(mockUserAdmin.getSpaceId());
        NodeOpRo ro = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .unitId(unitId.toString())
            .type(NodeType.DATASHEET.getNodeType())
            .build();
        String nodeId =
            iNodeService.createNode(mockUser.getUserId(), mockUserAdmin.getSpaceId(), ro);
        iMemberService.batchDeleteMemberFromSpace(mockUserAdmin.getSpaceId(),
            Collections.singletonList(memberId), false);
        List<String> nodeIds = iNodeService.getNodeIdsInNodeTree(rootNodeId, 1, false,
            Collections.singletonList(unitId));
        assertThat(nodeIds).doesNotContain(nodeId);
    }

    @Test
    void testRemoveMemberFromSpace() {
        MockUserSpace mockUserAdmin = createSingleUserAndSpace();
        MockUserSpace mockUser = createSingleUserAndSpace();
        String email = iUserService.getEmailByUserId(mockUser.getUserId());
        iMemberService.createInvitationMember(mockUserAdmin.getUserId(), mockUserAdmin.getSpaceId(),
            Collections.singletonList(email));
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(mockUser.getUserId(),
            mockUserAdmin.getSpaceId());
        // create node
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(mockUserAdmin.getSpaceId());
        NodeOpRo ro = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.DATASHEET.getNodeType())
            .build();
        String nodeId =
            iNodeService.createNode(mockUser.getUserId(), mockUserAdmin.getSpaceId(), ro);
        iMemberService.batchDeleteMemberFromSpace(mockUserAdmin.getSpaceId(),
            Collections.singletonList(memberId), false);
        List<String> nodeIds = iNodeService.getNodeIdsInNodeTree(rootNodeId, 1);
        assertThat(nodeIds).contains(nodeId);
    }


    @Test
    void testInviteRemovedMemberToSpaceAgainShouldRestorePrivateNodes() {
        MockUserSpace mockUserAdmin = createSingleUserAndSpace();
        MockUserSpace mockUser = createSingleUserAndSpace();
        String email = iUserService.getEmailByUserId(mockUser.getUserId());
        iMemberService.createInvitationMember(mockUserAdmin.getUserId(), mockUserAdmin.getSpaceId(),
            Collections.singletonList(email));
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(mockUser.getUserId(),
            mockUserAdmin.getSpaceId());
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        // create node
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(mockUserAdmin.getSpaceId());
        NodeOpRo ro = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .unitId(unitId.toString())
            .type(NodeType.DATASHEET.getNodeType())
            .build();
        String nodeId =
            iNodeService.createNode(mockUser.getUserId(), mockUserAdmin.getSpaceId(), ro);
        // remove from space
        iMemberService.batchDeleteMemberFromSpace(mockUserAdmin.getSpaceId(),
            Collections.singletonList(memberId), false);
        // invite again
        iMemberService.createInvitationMember(mockUserAdmin.getUserId(), mockUserAdmin.getSpaceId(),
            Collections.singletonList(email));
        List<String> nodeIds = iNodeService.getNodeIdsInNodeTree(rootNodeId, 1, false,
            Collections.singletonList(unitId));
        assertThat(nodeIds).contains(nodeId);
    }
}
