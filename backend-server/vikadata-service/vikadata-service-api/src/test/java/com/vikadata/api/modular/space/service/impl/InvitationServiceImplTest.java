package com.vikadata.api.modular.space.service.impl;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.mock.bean.MockInvitation;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.modular.space.mapper.InvitationMapper;
import com.vikadata.api.modular.space.model.InvitationUserDTO;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.InvitationEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * <p>
 *   space--invitation service test
 * </p>
 * @author zoe zheng
 * @date 2022/9/13 17:25
 */
public class InvitationServiceImplTest extends AbstractIntegrationTest {
    @Autowired
    private InvitationMapper invitationMapper;

    @Test
    public void createMemberInvitationTokenByNodeId() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        String nodeId = iNodeService.createChildNode(userSpace.getUserId(), CreateNodeDto.builder()
                .spaceId(spaceId)
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType())
                .build());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        String token = invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        String realToken = invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        assertThat(realToken).isEqualTo(token);
    }

    @Test
    public void testCloseMemberInvitationBySpaceId() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String spaceId = userSpace.getSpaceId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), spaceId);
        String nodeId = iNodeService.createChildNode(userSpace.getUserId(), CreateNodeDto.builder()
                .spaceId(spaceId)
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType())
                .build());
        invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        invitationService.closeMemberInvitationBySpaceId(userSpace.getSpaceId());
        InvitationEntity entity = invitationMapper.selectByMemberIdAndSpaceIdAndNodeId(memberId, spaceId, nodeId);
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
                .type(NodeType.ROOT.getNodeType())
                .build());
        iSpaceService.switchSpacePros(userId, spaceId, SpaceGlobalFeature.builder().invitable(false).build());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId));
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
                        () -> invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId));
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
                .type(NodeType.ROOT.getNodeType())
                .build());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId));
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
                .type(NodeType.ROOT.getNodeType())
                .build());
        String token = invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        invitationService.closeMemberInvitationBySpaceId(userSpace.getSpaceId());
        String newToken = invitationService.getMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        assertThat(newToken).isNotEqualTo(token);
    }

    @Test
    public void testInvitedUserJoinSpaceByToken() {
        MockInvitation dto = prepareInvitationToken();
        UserEntity user = iUserService.createUserByCli(IdWorker.getIdStr() + "@vikadata.com", "123456",
                StrUtil.subWithLength(IdWorker.get32UUID(), 0, 11));
        InvitationUserDTO result = invitationService.invitedUserJoinSpaceByToken(user.getId(), dto.getToken());
        assertThat(result).isNotNull();
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithTokenNotExists() {
        UserEntity user = iUserService.createUserByCli(IdWorker.getIdStr() + "@vikadata.com", "123456",
                StrUtil.subWithLength(IdWorker.get32UUID(), 0, 11));
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.invitedUserJoinSpaceByToken(user.getId(), "testtoken"));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithTokenNotActive() {
        MockInvitation dto = prepareInvitationToken();
        invitationService.closeMemberInvitationBySpaceId(dto.getSpaceId());
        UserEntity user = iUserService.createUserByCli(IdWorker.getIdStr() + "@vikadata.com", "123456",
                StrUtil.subWithLength(IdWorker.get32UUID(), 0, 11));
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.invitedUserJoinSpaceByToken(user.getId(), dto.getToken()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithNotAllowMemberInvitation() {
        MockInvitation dto = prepareInvitationToken();
        iSpaceService.switchSpacePros(dto.getUserId(), dto.getSpaceId(), SpaceGlobalFeature.builder().invitable(false).build());
        UserEntity user = iUserService.createUserByCli(IdWorker.getIdStr() + "@vikadata.com", "123456",
                StrUtil.subWithLength(IdWorker.get32UUID(), 0, 11));
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.invitedUserJoinSpaceByToken(user.getId(), dto.getToken()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testInvitedUserJoinSpaceByTokenWithMemberExists() {
        MockInvitation dto = prepareInvitationToken();
        InvitationUserDTO result = invitationService.invitedUserJoinSpaceByToken(dto.getUserId(), dto.getToken());
        assertThat(result).isNull();
    }

    @Test
    public void testValidInvitationTokenWithWrongNodeId() {
        MockInvitation dto = prepareInvitationToken();
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.validInvitationToken(dto.getToken(), IdUtil.createNodeId()));
        assertEquals(517, exception.getCode());
    }

    @Test
    public void testValidInvitationTokenWithWrongToken() {
        MockInvitation dto = prepareInvitationToken();
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.validInvitationToken(cn.hutool.core.util.IdUtil.fastSimpleUUID(), dto.getNodeId()));
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
        iSpaceService.switchSpacePros(dto.getUserId(), dto.getSpaceId(), SpaceGlobalFeature.builder().invitable(false).build());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> invitationService.validInvitationToken(dto.getToken(), dto.getNodeId()));
        assertEquals(517, exception.getCode());
    }
}
