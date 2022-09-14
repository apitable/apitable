package com.vikadata.api.modular.space.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.audit.InviteType;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.space.mapper.InvitationMapper;
import com.vikadata.api.modular.space.mapper.SpaceApplyMapper;
import com.vikadata.api.modular.space.model.InvitationUserDTO;
import com.vikadata.api.modular.space.service.IInvitationService;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.InvitationEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EXPIRE;
import static com.vikadata.api.enums.exception.SpaceException.NO_ALLOW_OPERATE;

/**
 * <p>
 * space--invitation service implementation
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
@Slf4j
@Service
public class InvitationServiceImpl extends ServiceImpl<InvitationMapper, InvitationEntity> implements IInvitationService {
    @Resource
    private InvitationMapper invitationMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceApplyMapper spaceApplyMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserMapper userMapper;

    @Override
    public void asyncActionsForSuccessJoinSpace(InvitationUserDTO dto) {
        // Determine whether a new user has joined the space station, and issue rewards, asynchronous operation
        TaskManager.me().execute(() -> {
            String userName = userMapper.selectUserNameById(dto.getUserId());
            iSpaceInviteLinkService.checkIsNewUserRewardCapacity(dto.getUserId(), userName, dto.getSpaceId());
        });
        // Send invitation notification, asynchronous operation
        TaskManager.me().execute(() -> {
            Long creatorUserId = memberMapper.selectUserIdByMemberId(dto.getCreator());
            iMemberService.sendInviteNotification(creatorUserId, ListUtil.toList(dto.getMemberId()), dto.getSpaceId(), true);
        });
        // To invalidate the application to actively join the space
        TaskManager.me().execute(() -> spaceApplyMapper.invalidateTheApply(ListUtil.toList(dto.getUserId()), dto.getSpaceId(), InviteType.LINK_INVITE.getType()));
    }

    @Override
    public void closeMemberInvitationBySpaceId(String spaceId) {
        invitationMapper.updateStatusBySpaceIdAndNodeIdNotEmpty(spaceId, false);
    }

    @Override
    public String getMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId) {
        // whether members can invite other users
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        ExceptionUtil.isTrue(feature.getInvitable(), NO_ALLOW_OPERATE);
        // check if node exists and doesn't span spaces
        iNodeService.checkNodeIfExist(spaceId, nodeId);
        // teamId must be root teamId, so there is no need to query by teamId
        InvitationEntity entity = invitationMapper.selectByMemberIdAndSpaceIdAndNodeId(memberId, spaceId, nodeId);
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
    public String createMemberInvitationTokenByNodeId(Long memberId, String spaceId, String nodeId) {
        String token = IdUtil.fastSimpleUUID();
        InvitationEntity entity = InvitationEntity.builder()
                .spaceId(spaceId)
                .teamId(teamMapper.selectRootIdBySpaceId(spaceId))
                .creator(memberId)
                .inviteToken(token)
                .nodeId(nodeId)
                .build();
        invitationMapper.insert(entity);
        return token;
    }

    @Override
    public InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token) {
        InvitationEntity entity = invitationMapper.selectByInviteToken(token);
        // 1. if the information of the link does not exist or the status is 0, it is determined to be
        // invalid.
        ExceptionUtil.isFalse(entity == null || !entity.getStatus(), INVITE_EXPIRE);
        String spaceId = entity.getSpaceId();
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
        return InvitationUserDTO.builder().userId(userId).memberId(newMemberId).creator(entity.getCreator()).spaceId(spaceId).build();
    }
}
