package com.vikadata.api.space.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.interfaces.billing.facade.EntitlementServiceFacade;
import com.vikadata.api.interfaces.billing.model.EntitlementRemark;
import com.vikadata.api.interfaces.social.facade.SocialServiceFacade;
import com.vikadata.api.interfaces.user.facade.UserServiceFacade;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.mapper.TeamMapper;
import com.vikadata.api.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.ITeamMemberRelService;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.space.dto.InvitationUserDTO;
import com.vikadata.api.space.dto.SpaceLinkDTO;
import com.vikadata.api.space.dto.SpaceMemberResourceDto;
import com.vikadata.api.space.enums.InviteType;
import com.vikadata.api.space.mapper.SpaceInviteLinkMapper;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.mapper.SpaceResourceMapper;
import com.vikadata.api.space.service.IAuditInviteRecordService;
import com.vikadata.api.space.service.IInvitationService;
import com.vikadata.api.space.service.ISpaceInviteLinkService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.space.vo.SpaceLinkInfoVo;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.entity.SpaceInviteLinkEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.organization.enums.OrganizationException.GET_TEAM_ERROR;
import static com.vikadata.api.organization.enums.OrganizationException.INVITE_EXPIRE;
import static com.vikadata.api.organization.enums.OrganizationException.INVITE_TOO_OFTEN;
import static com.vikadata.api.space.enums.SpaceException.NOT_IN_SPACE;
import static com.vikadata.api.space.enums.SpaceException.NO_ALLOW_OPERATE;
import static com.vikadata.api.space.enums.SpaceException.SPACE_NOT_EXIST;

@Slf4j
@Service
public class SpaceInviteLinkServiceImpl extends ServiceImpl<SpaceInviteLinkMapper, SpaceInviteLinkEntity> implements ISpaceInviteLinkService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private IAuditInviteRecordService iAuditInviteRecordService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private MemberMapper memberMapper;

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
    private EntitlementServiceFacade entitlementServiceFacade;

    @Resource
    private IInvitationService invitationService;

    @Override
    public String saveOrUpdate(String spaceId, Long teamId, Long memberId) {
        // whether a space can create an invitation link
        boolean isBindSocial = socialServiceFacade.checkSocialBind(spaceId);
        ExceptionUtil.isFalse(isBindSocial, NO_ALLOW_OPERATE);
        String teamSpaceId = teamMapper.selectSpaceIdById(teamId);
        // Verify that the department exists and is in the same space
        ExceptionUtil.isNotNull(teamSpaceId, GET_TEAM_ERROR);
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
        }
        else {
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
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(dto) && ObjectUtil.isNotNull(dto.getTeamId()) && ObjectUtil.isNotNull(dto.getMemberId()), INVITE_EXPIRE);
        // determine whether the invited space exists
        ExceptionUtil.isNotNull(dto.getSpaceId(), SPACE_NOT_EXIST);
        // Determine if the creator also has permission to invite members
        boolean contain = false;
        if (dto.isMainAdmin()) {
            contain = true;
        }
        else if (dto.isAdmin()) {
            List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByMemberId(dto.getMemberId());
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
        SpaceLinkInfoVo infoVo = SpaceLinkInfoVo.builder().memberName(dto.getMemberName()).spaceId(dto.getSpaceId()).spaceName(dto.getSpaceName()).build();
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
                }
                else {
                    dto = invitedUserJoinSpaceByToken(userId, token);
                }
                if (dto != null) {
                    iAuditInviteRecordService.save(dto.getSpaceId(), dto.getCreator(), dto.getMemberId(),
                            InviteType.LINK_INVITE.getType());
                    invitationService.asyncActionsForSuccessJoinSpace(dto);
                }
            }
            else {
                log.warn("user「{}」use invite uri「{}」Join the space station operation is too frequent", userId, token);
                throw new BusinessException(INVITE_TOO_OFTEN);
            }
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    @Override
    public InvitationUserDTO invitedUserJoinSpaceByToken(Long userId, String token) {
        // Get link information, including space information, creating member information, link source department information
        SpaceLinkDTO dto = baseMapper.selectDtoByToken(token);
        // If one of the information corresponding to the link does not exist, it is judged to be invalid.
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(dto) && ObjectUtil.isNotNull(dto.getSpaceId())
                && ObjectUtil.isNotNull(dto.getTeamId()) && ObjectUtil.isNotNull(dto.getMemberId()), INVITE_EXPIRE);
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
        return InvitationUserDTO.builder().userId(userId).memberId(memberId).spaceId(dto.getSpaceId()).creator(dto.getMemberId()).build();
    }

    /**
     * If the user is in the space but not in the specified department, join the department
     *
     * @return true | false
     */
    private boolean joinTeamIfInSpace(Long userId, String spaceId, Long teamId) {
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        if (ObjectUtil.isNull(memberId)) {
            return false;
        }
        else {
            Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
            if (rootTeamId.equals(teamId)) {
                return true;
            }
            // Determine whether the user is already in the invited department, and automatically join the department if it does not exist
            List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
            if (teamIds.contains(teamId)) {
                return true;
            }
            // When joining other departments, unbind from the root department
            if (teamIds.contains(rootTeamId)) {
                teamMemberRelMapper.deleteByTeamIdsAndMemberId(memberId, Collections.singletonList(rootTeamId));
            }
            iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId), Collections.singletonList(teamId));
            return true;
        }
    }

    @Override
    public void delNoPermitMemberLink(String spaceId) {
        List<Long> memberIds = baseMapper.selectCreatorBySpaceId(spaceId);
        if (CollUtil.isNotEmpty(memberIds)) {
            // remove space master
            Long adminMemberId = spaceMapper.selectSpaceMainAdmin(spaceId);
            if (memberIds.contains(adminMemberId)) {
                if (memberIds.size() == 1) {
                    return;
                }
                else {
                    CollUtil.removeAny(memberIds, adminMemberId);
                }
            }
            List<SpaceMemberResourceDto> dtoList = spaceResourceMapper.selectMemberResource(memberIds);
            Map<Long, List<String>> map = dtoList.stream()
                    .collect(Collectors.toMap(SpaceMemberResourceDto::getMemberId, SpaceMemberResourceDto::getResources));
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
    public void deleteByTeamId(Long teamId) {
        Long id = baseMapper.selectIdByTeamId(teamId);
        if (id != null) {
            removeById(id);
        }
    }

    @Override
    public void deleteByTeamIds(Collection<Long> teamIds) {
        List<Long> ids = baseMapper.selectIdByTeamIds(teamIds);
        if (!ids.isEmpty()) {
            removeByIds(ids);
        }
    }

    @Override
    public void checkIsNewUserRewardCapacity(Long userId, String userName, String spaceId) {
        String key = RedisConstants.getUserInvitedJoinSpaceKey(userId, spaceId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            // Order a 300 MB add-on subscription plan to invite users to increase the capacity of the add-on
            entitlementServiceFacade.addGiftCapacity(spaceId, new EntitlementRemark(userId, userName));
            redisTemplate.delete(key);
        }
    }
}
