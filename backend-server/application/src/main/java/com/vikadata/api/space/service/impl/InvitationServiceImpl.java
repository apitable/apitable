package com.vikadata.api.space.service.impl;

import java.util.Collections;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.infrastructure.role.RoleConstants.Node;
import com.vikadata.api.control.service.IControlRoleService;
import com.vikadata.api.interfaces.user.facade.UserServiceFacade;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.mapper.TeamMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.space.dto.InvitationUserDTO;
import com.vikadata.api.space.enums.InviteType;
import com.vikadata.api.space.mapper.InvitationMapper;
import com.vikadata.api.space.mapper.SpaceApplyMapper;
import com.vikadata.api.space.service.IInvitationService;
import com.vikadata.api.space.service.ISpaceInviteLinkService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.space.vo.SpaceGlobalFeature;
import com.vikadata.api.space.vo.SpaceLinkInfoVo;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.api.workspace.service.INodeRoleService;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.entity.InvitationEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.organization.enums.OrganizationException.INVITE_EXPIRE;
import static com.vikadata.api.space.enums.SpaceException.NO_ALLOW_OPERATE;

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
        SpaceLinkInfoVo infoVo = SpaceLinkInfoVo.builder()
                .spaceId(spaceId)
                .memberName(memberMapper.selectMemberNameById(creator))
                .spaceName(iSpaceService.getNameBySpaceId(spaceId)).build();
        // determine if the user is logged in
        HttpSession session = HttpContextUtil.getSession(false);
        if (ObjectUtil.isNotNull(session)) {
            // logged in, to determine whether the user already exists in the space
            Long userId = SessionContext.getUserId();
            Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
            infoVo.setIsExist(BooleanUtil.isTrue(null != memberId));
            infoVo.setIsLogin(true);
        }
        Long creatorUserId = memberMapper.selectUserIdByMemberId(creator);
        // get the link creator's personal invitation code
        String inviteCode = userServiceFacade.getUserInvitationCode(creatorUserId).getCode();
        infoVo.setInviteCode(inviteCode);
        return infoVo;
    }

    @Override
    public void asyncActionsForSuccessJoinSpace(InvitationUserDTO dto) {
        // Determine whether a new user has joined the space station, and issue rewards, asynchronous operation
        TaskManager.me().execute(() -> {
            String userName = userMapper.selectNickNameById(dto.getUserId());
            iSpaceInviteLinkService.checkIsNewUserRewardCapacity(dto.getUserId(), userName, dto.getSpaceId());
        });
        // Send invitation notification, asynchronous operation
        TaskManager.me().execute(() -> {
            Long creatorUserId = memberMapper.selectUserIdByMemberId(dto.getCreator());
            iMemberService.sendInviteNotification(creatorUserId, ListUtil.toList(dto.getMemberId()), dto.getSpaceId(), true);
        });
        // To invalidate the application to actively join the space
        TaskManager.me().execute(() -> spaceApplyMapper.invalidateTheApply(ListUtil.toList(dto.getUserId()), dto.getSpaceId(), InviteType.LINK_INVITE.getType()));
        if (!StrUtil.isEmpty(dto.getNodeId())) {
            Long controlOwnerUnitId = iControlRoleService.getUnitIdByControlIdAndRoleCode(dto.getNodeId(), Node.OWNER);
            // set owner role
            if (null == controlOwnerUnitId) {
                Long nodeCreator = iNodeService.getCreatedMemberId(dto.getNodeId());
                if (null == nodeCreator) {
                    nodeCreator = dto.getCreator();
                }
                Long ownerUserId = memberMapper.selectUserIdByMemberId(nodeCreator);
                iNodeRoleService.enableNodeRole(ownerUserId, dto.getSpaceId(), dto.getNodeId(), true);
            }
            // add update role
            Long roleAddUserId = memberMapper.selectUserIdByMemberId(dto.getCreator());
            Long invitedUnitId = iUnitService.getUnitIdByRefId(dto.getMemberId());
            iNodeRoleService.addNodeRole(roleAddUserId, dto.getNodeId(), Node.UPDATER, Collections.singletonList(invitedUnitId));
        }
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
        return InvitationUserDTO.builder()
                .userId(userId)
                .memberId(newMemberId)
                .creator(entity.getCreator())
                .nodeId(entity.getNodeId())
                .spaceId(spaceId).build();
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
