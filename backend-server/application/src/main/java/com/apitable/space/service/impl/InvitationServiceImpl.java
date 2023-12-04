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

import static com.apitable.organization.enums.OrganizationException.INVITE_EXPIRE;
import static com.apitable.space.enums.SpaceException.NO_ALLOW_OPERATE;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlRoleService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.interfaces.user.model.InvitationCode;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.dto.InvitationUserDTO;
import com.apitable.space.entity.InvitationEntity;
import com.apitable.space.enums.InviteType;
import com.apitable.space.mapper.InvitationMapper;
import com.apitable.space.mapper.SpaceApplyMapper;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.space.vo.SpaceLinkInfoVo;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import java.util.Collections;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Invitation service implement.
 */
@Slf4j
@Service
public class InvitationServiceImpl extends ServiceImpl<InvitationMapper, InvitationEntity>
    implements IInvitationService {
    @Resource
    private InvitationMapper invitationMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private SpaceApplyMapper spaceApplyMapper;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Resource
    private IControlRoleService iControlRoleService;

    @Override
    public SpaceLinkInfoVo getInvitationInfo(String spaceId, Long creator) {
        MemberEntity member = iMemberService.getById(creator);
        SpaceLinkInfoVo infoVo = SpaceLinkInfoVo.builder()
            .spaceId(spaceId)
            .memberName(member.getMemberName())
            .spaceName(iSpaceService.getNameBySpaceId(spaceId))
            .build();
        // determine if the user is logged in
        HttpSession session = HttpContextUtil.getSession(false);
        if (ObjectUtil.isNotNull(session)) {
            // logged in, to determine whether the user already exists in the space
            Long userId = SessionContext.getUserId();
            Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
            infoVo.setIsExist(BooleanUtil.isTrue(null != memberId));
            infoVo.setIsLogin(true);
        }
        // get the link creator's personal invitation code
        InvitationCode invitationCode =
            userServiceFacade.getUserInvitationCode(member.getUserId());
        infoVo.setInviteCode(invitationCode.getCode());
        infoVo.setSeatAvailable(iSpaceService.getSpaceSeatAvailableStatus(spaceId));
        return infoVo;
    }

    @Override
    public void asyncActionsForSuccessJoinSpace(InvitationUserDTO dto) {
        Long userId = iMemberService.getUserIdByMemberId(dto.getCreator());
        // Send invitation notification, asynchronous operation
        TaskManager.me().execute(
            () -> iMemberService.sendInviteNotification(userId, ListUtil.toList(dto.getMemberId()),
                dto.getSpaceId(), true));
        // To invalidate the application to actively join the space
        TaskManager.me().execute(
            () -> spaceApplyMapper.invalidateTheApply(ListUtil.toList(dto.getUserId()),
                dto.getSpaceId(), InviteType.LINK_INVITE.getType()));
        if (StrUtil.isEmpty(dto.getNodeId())) {
            return;
        }
        Long controlOwnerUnitId =
            iControlRoleService.getUnitIdByControlIdAndRoleCode(dto.getNodeId(), Node.OWNER);
        // set owner role
        if (null == controlOwnerUnitId) {
            Long nodeCreator = iNodeService.getCreatedMemberId(dto.getNodeId());
            if (null == nodeCreator) {
                nodeCreator = dto.getCreator();
            }
            Long ownerUserId = iMemberService.getUserIdByMemberId(nodeCreator);
            iNodeRoleService.enableNodeRole(ownerUserId, dto.getSpaceId(), dto.getNodeId(), true);
        }
        // add update role
        Long invitedUnitId = iUnitService.getUnitIdByRefId(dto.getMemberId());
        iNodeRoleService.addNodeRole(userId, dto.getNodeId(), Node.UPDATER,
            Collections.singletonList(invitedUnitId));
    }

    @Override
    public void closeMemberInvitationBySpaceId(String spaceId) {
        invitationMapper.updateStatusBySpaceIdAndNodeIdNotEmpty(spaceId, false);
    }

    @Override
    public InvitationEntity getByMemberIdAndSpaceIdAndNodeId(Long memberId, String spaceId,
                                                             String nodeId) {
        return invitationMapper.selectByMemberIdAndSpaceIdAndNodeId(memberId, spaceId, nodeId);
    }

    @Override
    public String getMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId) {
        // whether members can invite other users
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        ExceptionUtil.isTrue(feature.getInvitable(), NO_ALLOW_OPERATE);
        // check if node exists and doesn't span spaces
        iNodeService.checkNodeIfExist(spaceId, nodeId);
        // teamId must be root teamId, so there is no need to query by teamId
        InvitationEntity entity = getByMemberIdAndSpaceIdAndNodeId(memberId, spaceId, nodeId);
        if (entity == null) {
            return this.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        }
        if (!entity.getStatus()) {
            entity.setInviteToken(IdUtil.fastSimpleUUID());
            entity.setStatus(true);
            invitationMapper.updateById(entity);
        }
        return entity.getInviteToken();
    }

    @Override
    public String createMemberInvitationTokenByNodeId(Long memberId, String spaceId,
                                                      String nodeId) {
        String token = IdUtil.fastSimpleUUID();
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        InvitationEntity entity = InvitationEntity.builder()
            .spaceId(spaceId)
            .teamId(rootTeamId)
            .creator(memberId)
            .inviteToken(token)
            .nodeId(nodeId)
            .build();
        invitationMapper.insert(entity);
        return token;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token) {
        InvitationEntity entity = invitationMapper.selectByInviteToken(token);
        // 1. if the information of the link does not exist or the status is 0, it is determined to be
        // invalid.
        ExceptionUtil.isFalse(entity == null || !entity.getStatus(), INVITE_EXPIRE);
        String spaceId = entity.getSpaceId();
        iSpaceService.checkSeatOverLimit(spaceId);
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        // 2. member invitation expired
        ExceptionUtil.isTrue(Boolean.TRUE.equals(feature.getInvitable()), INVITE_EXPIRE);
        // The user has existing members in the space, and the previous member ID is directly reused
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        if (null != memberId) {
            return null;
        }
        // Create member
        Long newMemberId = iMemberService.createMember(userId, spaceId, entity.getTeamId());
        // The link accumulates the number of successful invitees and creates an audit invitation record
        invitationMapper.updateInviteNumByInviteToken(token);
        return InvitationUserDTO.builder()
            .userId(userId)
            .memberId(newMemberId)
            .creator(entity.getCreator())
            .nodeId(entity.getNodeId())
            .spaceId(spaceId)
            .build();
    }

    @Override
    public InvitationEntity validInvitationToken(String token, String nodeId) {
        InvitationEntity entity = invitationMapper.selectByInviteTokenAndNodeId(token, nodeId);
        ExceptionUtil.isTrue(null != entity, INVITE_EXPIRE);
        String spaceId = entity.getSpaceId();
        // throw SPACE_NOT_EXIST
        iSpaceService.isSpaceAvailable(spaceId);
        // throw NODE_NOT_EXIST or NOT_IN_SPACE
        iNodeService.checkNodeIfExist(spaceId, nodeId);
        // member allowed to invite other user
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        ExceptionUtil.isTrue(Boolean.TRUE.equals(feature.getInvitable()), INVITE_EXPIRE);
        return entity;
    }
}
