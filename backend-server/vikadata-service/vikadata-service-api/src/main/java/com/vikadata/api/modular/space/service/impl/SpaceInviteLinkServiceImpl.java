package com.vikadata.api.modular.space.service.impl;

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

import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.audit.InviteType;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.vcode.VCodeType;
import com.vikadata.api.model.dto.space.SpaceLinkDto;
import com.vikadata.api.model.vo.space.SpaceLinkInfoVo;
import com.vikadata.api.modular.audit.service.IAuditInviteRecordService;
import com.vikadata.api.modular.finance.service.IBillingOfflineService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.space.mapper.SpaceApplyMapper;
import com.vikadata.api.modular.space.mapper.SpaceInviteLinkMapper;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.api.modular.space.model.InvitationUserDTO;
import com.vikadata.api.modular.space.model.SpaceMemberResourceDto;
import com.vikadata.api.modular.space.service.IInvitationService;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.vcode.mapper.VCodeMapper;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.SpaceInviteLinkEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.GET_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EXPIRE;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_TOO_OFTEN;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.SpaceException.NO_ALLOW_OPERATE;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;

/**
 * <p>
 * 工作空间-公开邀请链接 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
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
    private SpaceApplyMapper spaceApplyMapper;

    @Resource
    private VCodeMapper vCodeMapper;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IBillingOfflineService iBillingOfflineService;

    @Resource
    private IInvitationService invitationService;

    @Override
    public String saveOrUpdate(String spaceId, Long teamId, Long memberId) {
        // 空间是否可以创建邀请链接
        boolean isBindSocial = iSocialTenantBindService.getSpaceBindStatus(spaceId);
        ExceptionUtil.isFalse(isBindSocial, NO_ALLOW_OPERATE);
        String teamSpaceId = teamMapper.selectSpaceIdById(teamId);
        // 校验部门是否存在以及在同一个空间中
        ExceptionUtil.isNotNull(teamSpaceId, GET_TEAM_ERROR);
        ExceptionUtil.isTrue(spaceId.equals(teamSpaceId), NOT_IN_SPACE);
        Long id = baseMapper.selectIdByTeamIdAndMemberId(teamId, memberId);
        String token = IdUtil.fastSimpleUUID();
        boolean flag;
        if (ObjectUtil.isNull(id)) {
            // 生成或刷新链接
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
        log.info("邀请链接令牌校验");
        SpaceLinkDto dto = baseMapper.selectDtoByToken(token);
        // 链接所对应的记录、邀请部门和创建者有一者不存在，皆判定为失效
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(dto) && ObjectUtil.isNotNull(dto.getTeamId()) && ObjectUtil.isNotNull(dto.getMemberId()), INVITE_EXPIRE);
        // 判断邀请的空间是否存在
        ExceptionUtil.isNotNull(dto.getSpaceId(), SPACE_NOT_EXIST);
        // 判断创建者是否还拥有邀请成员的权限
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
            // 未拥有权限，判断空间是否开启了全员可邀请成员，两者皆无视为失效
            Boolean invite = iSpaceService.getSpaceGlobalFeature(dto.getSpaceId()).getInvitable();
            ExceptionUtil.isTrue(Boolean.TRUE.equals(invite), INVITE_EXPIRE);
        }
        SpaceLinkInfoVo infoVo = SpaceLinkInfoVo.builder().memberName(dto.getMemberName()).spaceId(dto.getSpaceId()).spaceName(dto.getSpaceName()).build();
        // 判断用户是否登陆
        HttpSession session = HttpContextUtil.getSession(false);
        if (ObjectUtil.isNotNull(session)) {
            // 已登陆状态，判断用户是否已存在该空间中，在空间中但不在指定部门时，加入该部门
            Long userId = SessionContext.getUserId();
            boolean isExist = this.joinTeamIfInSpace(userId, dto.getSpaceId(), dto.getTeamId());
            infoVo.setIsExist(isExist);
            infoVo.setIsLogin(true);
        }
        // 获取链接创建者的个人邀请码
        String inviteCode = vCodeMapper.selectCodeByTypeAndRefId(VCodeType.PERSONAL_INVITATION_CODE.getType(), dto.getUserId());
        infoVo.setInviteCode(inviteCode);
        return infoVo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void join(Long userId, String token, String nodeId) {
        log.info("公开链接加入空间站");
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
                log.warn("用户「{}」使用邀请链接「{}」加入空间站操作过于频繁", userId, token);
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
        // 获取链接的信息，包含空间信息、创建成员信息、链接来源部门信息
        SpaceLinkDto dto = baseMapper.selectDtoByToken(token);
        // 链接所对应的信息有一者不存在，皆判定为失效
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(dto) && ObjectUtil.isNotNull(dto.getSpaceId())
                && ObjectUtil.isNotNull(dto.getTeamId()) && ObjectUtil.isNotNull(dto.getMemberId()), INVITE_EXPIRE);
        // 判断空间是否开启了第三方
        boolean isBoundSocial = iSocialTenantBindService.getSpaceBindStatus(dto.getSpaceId());
        ExceptionUtil.isFalse(isBoundSocial, INVITE_EXPIRE);
        // 用户在空间内有存在历史成员，直接复用以前的成员ID；在空间中但不在指定部门时，加入该部门
        boolean isExist = this.joinTeamIfInSpace(userId, dto.getSpaceId(), dto.getTeamId());
        if (isExist) {
            return null;
        }
        // 创建成员
        Long memberId = iMemberService.createMember(userId, dto.getSpaceId(), dto.getTeamId());
        // 链接累加成功受邀人数，创建审计邀请记录
        boolean flag = SqlHelper.retBool(baseMapper.updateInviteNumByInviteToken(token));
        ExceptionUtil.isTrue(flag, INSERT_ERROR);
        return InvitationUserDTO.builder().userId(userId).memberId(memberId).spaceId(dto.getSpaceId()).creator(dto.getMemberId()).build();
    }

    /**
     * 若用户在空间中但不在指定部门时，加入该部门
     *
     * @return 是否已存在该空间
     */
    private boolean joinTeamIfInSpace(Long userId, String spaceId, Long teamId) {
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        if (ObjectUtil.isNull(memberId)) {
            // 不存在该空间中，判断邀请空间的人数是否达到上限，白名单空间跳过
            // iSubscriptionService.checkSeat(spaceId);
            return false;
        }
        else {
            Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
            if (rootTeamId.equals(teamId)) {
                return true;
            }
            // 判断用户是否已在邀请的部门中，不存在时自动加入该部门
            List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
            if (teamIds.contains(teamId)) {
                return true;
            }
            // 加入其它部门时，解除与根部门的绑定
            if (teamIds.contains(rootTeamId)) {
                teamMemberRelMapper.deleteByTeamIdsAndMemberId(memberId, Collections.singletonList(rootTeamId));
            }
            iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId), Collections.singletonList(teamId));
            return true;
        }
    }

    @Override
    public void delNoPermitMemberLink(String spaceId) {
        log.info("删除没有成员管理权限的成员生成的链接");
        List<Long> memberIds = baseMapper.selectCreatorBySpaceId(spaceId);
        if (CollUtil.isNotEmpty(memberIds)) {
            // 移除空间主管理员
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
            // 记录没有权限的成员
            List<Long> list = new ArrayList<>();
            String tag = "INVITE_MEMBER";
            memberIds.forEach(id -> {
                List<String> resources = map.get(id);
                if (CollUtil.isEmpty(resources) || !resources.contains(tag)) {
                    list.add(id);
                }
            });
            // 删除这些成员生成的链接
            if (CollUtil.isNotEmpty(list)) {
                baseMapper.delByTeamIdAndMemberId(null, list);
            }
        }
    }

    @Override
    public void delByMemberIdIfNotInvite(String spaceId, Long memberId) {
        log.info("如果该空间全员可邀请成员的开关处于关闭，删除成员生成的链接");
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
        log.info("判断是否是新用户加入空加入空间站，并发放附件容量奖励");
        String key = RedisConstants.getUserInvitedJoinSpaceKey(userId, spaceId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            // 下单300MB附加订阅计划，用于邀请用户增容附件容量
            iBillingOfflineService.createGiftCapacityOrder(userId, userName, spaceId);
            // 删除缓存
            redisTemplate.delete(key);
        }
    }
}
