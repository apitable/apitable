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
import static com.apitable.organization.enums.OrganizationException.INVITE_TOO_OFTEN;
import static com.apitable.space.enums.SpaceException.NOT_IN_SPACE;
import static com.apitable.space.enums.SpaceException.NO_ALLOW_OPERATE;
import static com.apitable.space.enums.SpaceException.SPACE_NOT_EXIST;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.dto.InvitationUserDTO;
import com.apitable.space.dto.SpaceLinkDTO;
import com.apitable.space.dto.SpaceMemberResourceDto;
import com.apitable.space.entity.SpaceInviteLinkEntity;
import com.apitable.space.enums.InviteType;
import com.apitable.space.mapper.SpaceInviteLinkMapper;
import com.apitable.space.mapper.SpaceResourceMapper;
import com.apitable.space.service.IAuditInviteRecordService;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceLinkInfoVo;
import com.apitable.space.vo.SpaceLinkVo;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Space - Invite Link Service Implement.
 */
@Slf4j
@Service
public class SpaceInviteLinkServiceImpl
    extends ServiceImpl<SpaceInviteLinkMapper, SpaceInviteLinkEntity>
    implements ISpaceInviteLinkService {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private IAuditInviteRecordService iAuditInviteRecordService;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private SpaceResourceMapper spaceResourceMapper;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private IInvitationService invitationService;

    @Override
    public List<SpaceLinkVo> getSpaceLinkVos(Long memberId) {
        return baseMapper.selectLinkVo(memberId);
    }

    @Override
    public String saveOrUpdate(String spaceId, Long teamId, Long memberId) {
        // whether a space can create an invitation link
        boolean isBindSocial = socialServiceFacade.checkSocialBind(spaceId);
        ExceptionUtil.isFalse(isBindSocial, NO_ALLOW_OPERATE);
        String teamSpaceId = iTeamService.getSpaceIdByTeamId(teamId);
        // Verify that the department exists and is in the same space
        ExceptionUtil.isTrue(spaceId.equals(teamSpaceId), NOT_IN_SPACE);
        Long id = baseMapper.selectIdByTeamIdAndMemberId(teamId, memberId);
        String token = IdUtil.fastSimpleUUID();
        boolean flag;
        if (ObjectUtil.isNull(id)) {
            // generate or refresh links
            SpaceInviteLinkEntity entity = SpaceInviteLinkEntity.builder()
                .spaceId(spaceId)
                .teamId(teamId)
                .creator(memberId)
                .inviteToken(token)
                .build();
            flag = this.save(entity);
        } else {
            flag = SqlHelper.retBool(baseMapper.updateInviteTokenById(token, id));
        }
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        return token;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SpaceLinkInfoVo valid(String token) {
        SpaceLinkDTO dto = baseMapper.selectDtoByToken(token);
        // If one of the records, inviting departments and creators corresponding to the link does not exist, all of them are determined to be invalid.
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(dto) && ObjectUtil.isNotNull(dto.getTeamId())
            && ObjectUtil.isNotNull(dto.getMemberId()), INVITE_EXPIRE);
        // determine whether the invited space exists
        ExceptionUtil.isNotNull(dto.getSpaceId(), SPACE_NOT_EXIST);
        // Determine if the creator also has permission to invite members
        boolean contain = false;
        if (dto.isMainAdmin()) {
            contain = true;
        } else if (dto.isAdmin()) {
            List<String> resourceCodes =
                spaceResourceMapper.selectResourceCodesByMemberId(dto.getMemberId());
            String tag = "INVITE_MEMBER";
            if (CollUtil.isNotEmpty(resourceCodes) && resourceCodes.contains(tag)) {
                contain = true;
            }
        }
        if (!contain) {
            // If you don't have permission, you can judge whether the space is enabled for all members to invite members. Neither of them will be considered invalid.
            Boolean invite = iSpaceService.getSpaceGlobalFeature(dto.getSpaceId()).getInvitable();
            ExceptionUtil.isTrue(Boolean.TRUE.equals(invite), INVITE_EXPIRE);
        }
        SpaceLinkInfoVo infoVo =
            SpaceLinkInfoVo.builder().memberName(dto.getMemberName()).spaceId(dto.getSpaceId())
                .spaceName(dto.getSpaceName()).build();
        // determine if the user is logged in
        HttpSession session = HttpContextUtil.getSession(false);
        if (ObjectUtil.isNotNull(session)) {
            // In the logged-in state, determine whether the user already exists in the space. If the user is in the space but not in the designated department, join the department
            Long userId = SessionContext.getUserId();
            boolean isExist = this.joinTeamIfInSpace(userId, dto.getSpaceId(), dto.getTeamId());
            infoVo.setIsExist(isExist);
            infoVo.setIsLogin(true);
        }
        // get the link creator s personal invitation code
        String inviteCode = userServiceFacade.getUserInvitationCode(dto.getUserId()).getCode();
        infoVo.setInviteCode(inviteCode);
        infoVo.setSeatAvailable(iSpaceService.getSpaceSeatAvailableStatus(dto.getSpaceId()));
        return infoVo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void join(Long userId, String token, String nodeId) {
        Lock lock = redisLockRegistry.obtain(StrUtil.format("space:link:{}", userId));
        boolean locked = false;
        try {
            locked = lock.tryLock();
            if (locked) {
                InvitationUserDTO dto;
                if (StrUtil.isNotBlank(nodeId)) {
                    dto = invitationService.invitedUserJoinSpaceByToken(userId, token);
                } else {
                    dto = invitedUserJoinSpaceByToken(userId, token);
                }
                if (dto != null) {
                    iAuditInviteRecordService.save(dto.getSpaceId(), dto.getCreator(),
                        dto.getMemberId(),
                        InviteType.LINK_INVITE.getType());
                    invitationService.asyncActionsForSuccessJoinSpace(dto);
                }
            } else {
                log.warn(
                    "user「{}」use invite uri「{}」Join the space station operation is too frequent",
                    userId, token);
                throw new BusinessException(INVITE_TOO_OFTEN);
            }
        } finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token) {
        // Get link information, including space information, creating member information, link source department information
        SpaceLinkDTO dto = baseMapper.selectDtoByToken(token);
        // If one of the information corresponding to the link does not exist, it is judged to be invalid.
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(dto) && ObjectUtil.isNotNull(dto.getSpaceId())
                && ObjectUtil.isNotNull(dto.getTeamId()) && ObjectUtil.isNotNull(dto.getMemberId()),
            INVITE_EXPIRE);
        iSpaceService.checkSeatOverLimit(dto.getSpaceId());
        // Determine whether the space has a third party enabled
        boolean isBoundSocial = socialServiceFacade.checkSocialBind(dto.getSpaceId());
        ExceptionUtil.isFalse(isBoundSocial, INVITE_EXPIRE);
        // If the user has historical members in the space, the previous member ID can be reused directly; when the user is in the space but not in the designated department, he/she joins the department
        boolean isExist = this.joinTeamIfInSpace(userId, dto.getSpaceId(), dto.getTeamId());
        if (isExist) {
            return null;
        }
        // create member
        Long memberId = iMemberService.createMember(userId, dto.getSpaceId(), dto.getTeamId());
        // The link accumulates the number of successful invitees and creates an audit invitation record
        boolean flag = SqlHelper.retBool(baseMapper.updateInviteNumByInviteToken(token));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return InvitationUserDTO.builder().userId(userId).memberId(memberId)
            .spaceId(dto.getSpaceId()).creator(dto.getMemberId()).build();
    }

    /**
     * If the user is in the space but not in the specified department, join the department.
     *
     * @return true | false
     */
    private boolean joinTeamIfInSpace(Long userId, String spaceId, Long teamId) {
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        if (ObjectUtil.isNull(memberId)) {
            return false;
        }
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        if (rootTeamId.equals(teamId)) {
            return true;
        }
        // Determine whether the user is already in the invited department,
        // and automatically join the department if it does not exist.
        List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
        if (teamIds.contains(teamId)) {
            return true;
        }
        // When joining other departments, unbind from the root department
        if (teamIds.contains(rootTeamId)) {
            teamMemberRelMapper.deleteByTeamIdsAndMemberId(memberId,
                Collections.singletonList(rootTeamId));
        }
        iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId),
            Collections.singletonList(teamId));
        return true;
    }

    @Override
    public void delNoPermitMemberLink(String spaceId) {
        List<Long> memberIds = baseMapper.selectCreatorBySpaceId(spaceId);
        if (CollUtil.isEmpty(memberIds)) {
            return;
        }
        // remove space master
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        if (memberIds.contains(mainAdminMemberId)) {
            if (memberIds.size() == 1) {
                return;
            } else {
                CollUtil.removeAny(memberIds, mainAdminMemberId);
            }
        }
        List<SpaceMemberResourceDto> dtoList =
            spaceResourceMapper.selectMemberResource(memberIds);
        Map<Long, List<String>> map = dtoList.stream()
            .collect(Collectors.toMap(SpaceMemberResourceDto::getMemberId,
                SpaceMemberResourceDto::getResources));
        // records members without permission
        List<Long> list = new ArrayList<>();
        String tag = "INVITE_MEMBER";
        memberIds.forEach(id -> {
            List<String> resources = map.get(id);
            if (CollUtil.isEmpty(resources) || !resources.contains(tag)) {
                list.add(id);
            }
        });
        // remove links generated by these members
        if (CollUtil.isNotEmpty(list)) {
            baseMapper.delByTeamIdAndMemberId(null, list);
        }
    }

    @Override
    public void delByMemberIdIfNotInvite(String spaceId, Long memberId) {
        Boolean invite = iSpaceService.getSpaceGlobalFeature(spaceId).getInvitable();
        if (!Boolean.TRUE.equals(invite)) {
            baseMapper.delByTeamIdAndMemberId(null, Collections.singletonList(memberId));
        }
    }

    @Override
    public void deleteByMemberIds(List<Long> memberIds) {
        baseMapper.delByTeamIdAndMemberId(null, memberIds);
    }

    @Override
    public void deleteByTeamIdAndMemberId(Long teamId, Long memberId) {
        Long id = baseMapper.selectIdByTeamIdAndMemberId(teamId, memberId);
        if (id != null) {
            removeById(id);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTeamIds(Collection<Long> teamIds) {
        List<Long> ids = baseMapper.selectIdByTeamIds(teamIds);
        if (!ids.isEmpty()) {
            removeByIds(ids);
        }
    }
}
