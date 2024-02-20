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

package com.apitable.space.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import cn.hutool.core.collection.ListUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.mock.bean.MockInvitation;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.shared.util.IdUtil;
import com.apitable.space.dto.InvitationUserDTO;
import com.apitable.space.entity.InvitationEntity;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.enums.NodeType;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

public class InvitationServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void createMemberInvitationTokenByNodeId() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String nodeId = iNodeService.createChildNode(userSpace.getUserId(), CreateNodeDto.builder()
            .spaceId(spaceId)
            .newNodeId(IdUtil.createNodeId())
            .type(NodeType.DATASHEET.getNodeType())
            .build());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(),
            userSpace.getSpaceId());
        String token =
            invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        String realToken =
            invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        assertThat(realToken).isEqualTo(token);
    }

    @Test
    public void testCloseMemberInvitationBySpaceId() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        Long memberId =
            iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), spaceId);
        String nodeId = iNodeService.createChildNode(userSpace.getUserId(), CreateNodeDto.builder()
            .spaceId(spaceId)
            .newNodeId(IdUtil.createNodeId())
            .type(NodeType.DATASHEET.getNodeType())
            .build());
        invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        invitationService.closeMemberInvitationBySpaceId(userSpace.getSpaceId());
        InvitationEntity entity =
            invitationService.getByMemberIdAndSpaceIdAndNodeId(memberId, spaceId, nodeId);
        assertThat(entity.getStatus()).isEqualTo(false);
    }

    @Test
    public void testGetMemberIdByUserIdAndSpaceIdWithNotAllowMemberInvitation() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        Long userId = userSpace.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        String nodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
            .spaceId(spaceId)
            .newNodeId(IdUtil.createNodeId())
            .type(NodeType.DATASHEET.getNodeType())
            .build());
        iSpaceService.switchSpacePros(userId, spaceId,
            SpaceGlobalFeature.builder().invitable(false).build());
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId,
                    nodeId));
        assertEquals(411, exception.getCode());

    }

    @Test
    public void testGetMemberIdByUserIdAndSpaceIdWithNodeNotExists() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        Long userId = userSpace.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        String nodeId = IdUtil.createNodeId();
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId,
                    nodeId));
        assertEquals(600, exception.getCode());
    }

    @Test
    public void testGetMemberIdByUserIdAndSpaceIdWithNodeNotInSpace() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        Long userId = userSpace.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        String nodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
            .spaceId(IdUtil.createSpaceId())
            .newNodeId(IdUtil.createNodeId())
            .type(NodeType.DATASHEET.getNodeType())
            .build());
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId,
                    nodeId));
        assertEquals(403, exception.getCode());
    }

    @Test
    public void testGetMemberIdByUserIdAndSpaceIdWithRefreshToken() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        Long userId = userSpace.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        String nodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
            .spaceId(spaceId)
            .newNodeId(IdUtil.createNodeId())
            .type(NodeType.DATASHEET.getNodeType())
            .build());
        String token =
            invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        invitationService.closeMemberInvitationBySpaceId(userSpace.getSpaceId());
        String newToken =
            invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        assertThat(newToken).isNotEqualTo(token);
    }

    @Test
    public void testInvitedUserJoinSpaceByToken() {
        MockInvitation dto = prepareInvitationToken();
        UserEntity user = iUserService.createUserByEmail(IdWorker.getIdStr() + "@apitable.com");
        InvitationUserDTO result =
            invitationService.invitedUserJoinSpaceByToken(user.getId(), dto.getToken());
        assertThat(result).isNotNull();
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithTokenNotExists() {
        UserEntity user = iUserService.createUserByEmail(IdWorker.getIdStr() + "@apitable.com");
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.invitedUserJoinSpaceByToken(user.getId(), "testtoken"));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithTokenNotActive() {
        MockInvitation dto = prepareInvitationToken();
        invitationService.closeMemberInvitationBySpaceId(dto.getSpaceId());
        UserEntity user = iUserService.createUserByEmail(IdWorker.getIdStr() + "@apitable.com");
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.invitedUserJoinSpaceByToken(user.getId(), dto.getToken()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithNotAllowMemberInvitation() {
        MockInvitation dto = prepareInvitationToken();
        iSpaceService.switchSpacePros(dto.getUserId(), dto.getSpaceId(),
            SpaceGlobalFeature.builder().invitable(false).build());
        UserEntity user = iUserService.createUserByEmail(IdWorker.getIdStr() + "@apitable.com");
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.invitedUserJoinSpaceByToken(user.getId(), dto.getToken()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithMemberExists() {
        MockInvitation dto = prepareInvitationToken();
        InvitationUserDTO result =
            invitationService.invitedUserJoinSpaceByToken(dto.getUserId(), dto.getToken());
        assertThat(result).isNull();
    }

    @Test
    public void testValidInvitationTokenWithWrongNodeId() {
        MockInvitation dto = prepareInvitationToken();
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.validInvitationToken(dto.getToken(),
                    IdUtil.createNodeId()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testValidInvitationTokenWithWrongToken() {
        MockInvitation dto = prepareInvitationToken();
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.validInvitationToken(
                    cn.hutool.core.util.IdUtil.fastSimpleUUID(), dto.getNodeId()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testValidInvitationTokenWithSpaceNotExists() {
        MockInvitation dto = prepareInvitationToken();
        iSpaceService.deleteSpace(dto.getUserId(), ListUtil.toList(dto.getSpaceId()));
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.validInvitationToken(dto.getToken(), dto.getNodeId()));
        assertEquals(404, exception.getCode());
    }

    @Test
    public void testValidInvitationTokenWithSpacePreDeleted() {
        MockInvitation dto = prepareInvitationToken();
        iSpaceService.preDeleteById(dto.getUserId(), dto.getSpaceId());
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.validInvitationToken(dto.getToken(), dto.getNodeId()));
        assertEquals(404, exception.getCode());
    }

    @Test
    public void testValidInvitationTokenWithNodeDeleted() {
        MockInvitation dto = prepareInvitationToken();
        iNodeService.deleteById(dto.getSpaceId(), dto.getMemberId(), dto.getNodeId());
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.validInvitationToken(dto.getToken(), dto.getNodeId()));
        assertEquals(600, exception.getCode());
    }

    @Test
    public void testValidInvitationTokenWithSpaceNotAllowInvitation() {
        MockInvitation dto = prepareInvitationToken();
        iSpaceService.switchSpacePros(dto.getUserId(), dto.getSpaceId(),
            SpaceGlobalFeature.builder().invitable(false).build());
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> invitationService.validInvitationToken(dto.getToken(), dto.getNodeId()));
        assertEquals(517, exception.getCode());
    }
}
