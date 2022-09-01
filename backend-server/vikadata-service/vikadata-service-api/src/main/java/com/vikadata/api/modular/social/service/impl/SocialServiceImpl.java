package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.organization.factory.OrganizationFactory;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.modular.social.model.FeishuTenantDetailVO;
import com.vikadata.api.modular.social.model.FeishuTenantDetailVO.Space;
import com.vikadata.api.modular.social.model.TenantBaseInfoDto;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.modular.social.model.TenantDetailVO;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.social.service.impl.SocialServiceImpl.OpenDeptToTeam.SyncOperation;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuTenantInfo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.PermissionException.SET_MAIN_ADMIN_FAIL;
import static com.vikadata.social.dingtalk.constants.DingTalkConst.ROOT_DEPARTMENT_ID;
import static com.vikadata.social.feishu.constants.FeishuErrorCode.GET_TENANT_DENIED;

/**
 * 第三方集成 服务接口 实现
 *
 * @author Shawn Deng
 * @date 2020-12-02 18:04:20
 */
@Service
@Slf4j
public class SocialServiceImpl implements ISocialService {

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantDepartmentService iSocialTenantDepartmentService;

    @Resource
    private ISocialTenantDepartmentBindService iSocialTenantDepartmentBindService;

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private IUnitService iUnitService;

    @Override
    public Long activeSpaceByMobile(Long userId, String spaceId, String openId, String mobile) {
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, openId);
        if (member != null && StrUtil.isNotBlank(member.getMobile()) && member.getMobile().equals(mobile)) {
            MemberEntity updateMember = new MemberEntity();
            updateMember.setId(member.getId());
            updateMember.setUserId(userId);
            iMemberService.updateById(updateMember);
            return member.getId();
        }
        return null;
    }

    @Override
    public void checkUserIfInTenant(Long userId, String appId, String tenantKey) {
        // 检查用户是否在租户内，并且是管理员
        String openId = iSocialUserBindService.getOpenIdByTenantIdAndUserId(appId, tenantKey, userId);
        if (StrUtil.isBlank(openId)) {
            throw new BusinessException(SocialException.USER_NOT_EXIST);
        }
        boolean isTenantAdmin = iFeishuService.checkUserIsAdmin(tenantKey, openId);
        if (!isTenantAdmin) {
            throw new BusinessException(SocialException.ONLY_TENANT_ADMIN_BOUND_ERROR);
        }
    }

    @Override
    public FeishuTenantDetailVO getFeishuTenantInfo(String appId, String tenantKey) {
        FeishuTenantDetailVO infoVO = new FeishuTenantDetailVO();
        infoVO.setTenantKey(tenantKey);
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(appId, tenantKey);
        if (StrUtil.isNotBlank(spaceId)) {
            SpaceEntity spaceEntity = iSpaceService.getBySpaceId(spaceId);
            if (spaceEntity != null) {
                Space space = new Space();
                space.setSpaceId(spaceEntity.getSpaceId());
                space.setSpaceName(spaceEntity.getName());
                space.setSpaceLogo(spaceEntity.getLogo());
                SubscribePlanInfo subscribePlanInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceEntity.getSpaceId());
                space.setProduct(subscribePlanInfo.getProduct());
                space.setDeadline(subscribePlanInfo.getDeadline());
                if (spaceEntity.getOwner() != null) {
                    MemberEntity member = memberMapper.selectById(spaceEntity.getOwner());
                    space.setMainAdminUserId(spaceEntity.getOwner());
                    space.setMainAdminUserName(member.getMemberName());
                    if (member.getUserId() != null) {
                        UserEntity user = iUserService.getById(member.getUserId());
                        space.setMainAdminUserAvatar(user.getAvatar());
                    }
                }
                infoVO.setSpaces(Collections.singletonList(space));
            }
        }
        try {
            FeishuTenantInfo tenantInfo = iFeishuService.getFeishuTenantInfo(tenantKey);
            if (tenantInfo != null) {
                infoVO.setTenantName(tenantInfo.getName());
                infoVO.setAvatar(tenantInfo.getAvatar().getAvatarOrigin());
            }
        }
        catch (FeishuApiException exception) {
            if (exception.getCode() != GET_TENANT_DENIED) {
                // 180天内企业未使用过此应用，不算错误，返回NULL即可
                throw exception;
            }
        }
        return infoVO;
    }

    @Override
    public TenantDetailVO getTenantInfo(String tenantKey, String appId) {
        TenantDetailVO infoVO = new TenantDetailVO();
        infoVO.setTenantKey(tenantKey);
        infoVO.setSpaces(getTenantBindSpaceInfo(tenantKey, appId));
        TenantBaseInfoDto tenantBaseInfo = iSocialTenantService.getTenantBaseInfo(tenantKey, appId);
        infoVO.setTenantName(tenantBaseInfo.getTenantName());
        infoVO.setAvatar(tenantBaseInfo.getAvatar());
        return infoVO;
    }

    @Override
    public List<TenantDetailVO.Space> getTenantBindSpaceInfo(String tenantKey, String appId) {
        List<String> bindSpaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(tenantKey, appId);
        List<TenantDetailVO.Space> spaces = new ArrayList<>();
        if (CollectionUtil.isNotEmpty(bindSpaceIds)) {
            List<SpaceEntity> spaceEntities = iSpaceService.getBySpaceIds(bindSpaceIds);
            spaceEntities.forEach(spaceEntity -> {
                TenantDetailVO.Space space = new TenantDetailVO.Space();
                space.setSpaceId(spaceEntity.getSpaceId());
                space.setSpaceName(spaceEntity.getName());
                space.setSpaceLogo(spaceEntity.getLogo());
                // 钉钉订阅
                SubscribePlanInfo subscribePlanInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceEntity.getSpaceId());
                space.setProduct(subscribePlanInfo.getProduct());
                space.setDeadline(subscribePlanInfo.getDeadline());
                if (spaceEntity.getOwner() != null) {
                    MemberEntity member = memberMapper.selectById(spaceEntity.getOwner());
                    if (member != null) {
                        space.setMainAdminUserId(spaceEntity.getOwner());
                        space.setMainAdminUserName(member.getMemberName());
                        if (member.getUserId() != null) {
                            UserEntity user = iUserService.getById(member.getUserId());
                            space.setMainAdminUserAvatar(user.getAvatar());
                        }
                    }
                }
                spaces.add(space);
            });
        }
        return spaces;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changeMainAdmin(String spaceId, Long memberId) {
        log.info("更换主管理员");
        //更新空间、成员信息
        Long beforeOwnerMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        if (beforeOwnerMemberId != null && beforeOwnerMemberId.equals(memberId)) {
            log.warn("主管理员一样，无需改变");
            return;
        }
        if (beforeOwnerMemberId != null) {
            iMemberService.cancelMemberMainAdmin(beforeOwnerMemberId);
            MemberEntity beforeMember = iMemberService.getById(beforeOwnerMemberId);
            if (beforeMember.getUserId() != null) {
                userSpaceService.delete(beforeMember.getUserId(), spaceId);
            }
        }
        boolean flag = SqlHelper.retBool(spaceMapper.updateSpaceOwnerId(spaceId, memberId, null));
        ExceptionUtil.isTrue(flag, SET_MAIN_ADMIN_FAIL);
        iMemberService.setMemberMainAdmin(memberId);
        MemberEntity newAdminMember = iMemberService.getById(memberId);
        if (newAdminMember.getUserId() != null) {
            userSpaceService.delete(newAdminMember.getUserId(), spaceId);
        }
        //若新管理员原本是子管理员，删除原权限
        int count = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId));
        if (count > 0) {
            iSpaceRoleService.deleteRole(spaceId, memberId);
        }

    }

    @Override
    public List<String> getSocialDisableRoleGroupCode(String spaceId) {
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        // 过滤钉钉第三方集成
        if (bindInfo != null && bindInfo.getAppId() != null) {
            SocialTenantEntity entity = iSocialTenantService.getByAppIdAndTenantId(bindInfo.getAppId(),
                    bindInfo.getTenantId());
            boolean isDingTalkIsv = SocialPlatformType.DINGTALK.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.equals(SocialAppType.of(entity.getAppType()));
            boolean isWeComIsv = SocialPlatformType.WECOM.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.getType() == entity.getAppType();
            boolean isLarkIsv = SocialPlatformType.FEISHU.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.getType() == entity.getAppType();
            if (isDingTalkIsv || isWeComIsv || isLarkIsv) {
                return Arrays.asList("MANAGE_NORMAL_MEMBER", "MANAGE_TEAM");
            }
        }
        return bindInfo != null ? Arrays.asList("MANAGE_NORMAL_MEMBER", "MANAGE_TEAM", "MANAGE_MEMBER") : new ArrayList<>();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Set<String> connectDingTalkAgentAppContact(String spaceId, String agentId, String operatorOpenId,
            LinkedHashMap<Long, DingTalkContactDTO> contactMap) {
        if (contactMap.isEmpty()) {
            return new HashSet<>();
        }
        // 自建授权应用，这里不需要获取钉钉的通讯录授权权限
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String tenantId = agentApp.getCorpId();
        // 空间的根组织ID
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // 空间的主管理员DingTalk用户信息
        DingTalkUserDetail operatorOpenUser = dingTalkService.getUserDetailByUserId(agentId, operatorOpenId);
        // 空间的主管理员成员ID
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        // 初始化主管理员信息
        OpenUserToMember mainAdminOpenUserToMember = OpenUserToMember.builder().memberId(mainAdminMemberId)
                .memberName(operatorOpenUser.getName())
                .openId(operatorOpenId)
                .oldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(mainAdminMemberId)))
                .isNew(false).isCurrentSync(true).build();
        DingTalkContactMeta contactMeta = new DingTalkContactMeta(spaceId, tenantId, agentId, rootTeamId);
        contactMeta.openUserToMemberMap.put(operatorOpenId, mainAdminOpenUserToMember);
        // 初始化根部门信息
        OpenDeptToTeam rootDeptToTeam = OpenDeptToTeam.builder().departmentId(ROOT_DEPARTMENT_ID).teamId(rootTeamId)
                .isNew(false).isCurrentSync(true).op(SyncOperation.KEEP)
                .build();
        contactMeta.openDeptToTeamMap.put(ROOT_DEPARTMENT_ID, rootDeptToTeam);
        // 当前已经同步过的成员openUser->vikaMember的map
        List<MemberEntity> memberList = iMemberService.getMembersBySpaceId(spaceId, true);
        // 相同的openId，只保留最近的一个成员
        Map<String, OpenUserToMember> memberListByOpenIdToMap = memberList.stream()
                // 由于主管理在上面手动初始化，这里需要过滤
                .filter(dto -> !dto.getId().equals(mainAdminMemberId))
                .collect(Collectors.toMap(MemberEntity::getOpenId, dto -> {
                    OpenUserToMember cahceData =
                            OpenUserToMember.builder().openId(dto.getOpenId()).memberId(dto.getId()).memberName(dto.getMemberName()).isDeleted(dto.getIsDeleted()).build();
                    // 查询关联组织Ids todo 这里应该批量查询
                    cahceData.setOldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(cahceData.getMemberId())));
                    return cahceData;
                }, (pre, cur) -> !cur.getIsDeleted() ? cur : pre));
        contactMeta.openUserToMemberMap.putAll(memberListByOpenIdToMap);

        // 钉钉部门ID和vika系统部门ID,初始值为根部门ID
        List<TenantDepartmentBindDTO> teamList = iSocialTenantDepartmentService.getTenantBindTeamListBySpaceId(spaceId);
        Map<Long, OpenDeptToTeam> teamListByDepartmentIdToMap = teamList.stream().collect(Collectors.toMap(keyDto -> Long.valueOf(keyDto.getDepartmentId()), dto -> OpenDeptToTeam.builder()
                .id(dto.getId()).departmentName(dto.getDepartmentName())
                .departmentId(Long.valueOf(dto.getDepartmentId())).openDepartmentId(Long.valueOf(dto.getOpenDepartmentId()))
                .parentDepartmentId(Long.valueOf(dto.getParentDepartmentId())).parentOpenDepartmentId(Long.valueOf(dto.getParentOpenDepartmentId()))
                .teamId(dto.getTeamId()).parentTeamId(dto.getParentTeamId())
                .internalSequence(dto.getInternalSequence())
                .build()));
        contactMeta.openDeptToTeamMap.putAll(teamListByDepartmentIdToMap);
        // 同步通讯录
        syncDingTalkContacts(contactMeta, contactMap);

        // 检查人数限制
        // long defaultMaxMemberCount = iSubscriptionService.getPlanSeats(spaceId);
        // ExceptionUtil.isTrue(contactMeta.openIds.size() <= defaultMaxMemberCount, SubscribeFunctionException.MEMBER_LIMIT);
        // 如果同步的成员没有主管理员，需要将主管理员挂靠在根部门里面
        if (!contactMeta.openIds.contains(operatorOpenId)) {
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(rootTeamId, mainAdminMemberId));
        }
        // 初始化通讯录结构
        contactMeta.doDeleteTeams();
        // 删除没有的member
        contactMeta.deleteMembers();
        // 删除成员关联关系
        contactMeta.doDeleteMemberRels();
        // 更新主管理员信息
        contactMeta.updateMainAdminMember(operatorOpenId);
        // 存储到DB
        contactMeta.doSaveOrUpdate();
        // 删除缓存
        userSpaceService.delete(spaceId);
        return contactMeta.openIds;
    }

    private void syncDingTalkContacts(DingTalkContactMeta contactMeta, LinkedHashMap<Long, DingTalkContactDTO> contactTree) {
        Set<Long> deptIds = contactTree.keySet();
        contactTree.forEach((deptId, contact) -> {
            DingTalkDepartmentDTO dingTalkDepartmentDTO = contact.getDepartment();
            // 当前可见范围没有父部门
            if (!deptIds.contains(dingTalkDepartmentDTO.getParentDeptId())) {
                dingTalkDepartmentDTO.setParentDeptId(ROOT_DEPARTMENT_ID);
            }
            handleDingTalkDept(contactMeta, dingTalkDepartmentDTO);
            if (contact.getUserMap() != null) {
                contact.getUserMap().values().forEach(user -> handleDingTalkMember(contactMeta, user,
                        contactMeta.getTeamId(deptId)));
            }
        });
    }

    private void handleDingTalkMember(DingTalkContactMeta contactMeta, DingTalkContactDTO.DingTalkUserDTO userDetail, Long parentTeamId) {
        // 过滤未激活的钉钉用户
        if (BooleanUtil.isFalse(userDetail.getActive())) {
            return;
        }
        String dingTalkUserid = userDetail.getOpenId();
        OpenUserToMember cahceMember = contactMeta.openUserToMemberMap.get(dingTalkUserid);
        // 没有同步过
        if (!contactMeta.openIds.contains(dingTalkUserid)) {
            // 数据库中的member 不存在,没有同步过，需要登录的时候才绑定用户
            if (null == cahceMember) {
                MemberEntity member = SocialFactory.createDingTalkMember(userDetail)
                        .setId(IdWorker.getId())
                        .setSpaceId(contactMeta.spaceId)
                        .setIsActive(false)
                        .setIsPoint(true)
                        .setStatus(UserSpaceStatus.INACTIVE.getStatus())
                        .setNameModified(false)
                        .setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue())
                        .setIsAdmin(false);
                contactMeta.memberEntities.add(member);
                cahceMember = OpenUserToMember.builder().memberId(member.getId()).memberName(member.getMemberName()).openId(dingTalkUserid).isNew(true).build();
            }
            else {
                // 存在查看是否需要修改关键信息
                if (!cahceMember.getMemberName().equals(userDetail.getName()) || cahceMember.getIsDeleted() || !userDetail.getOpenId().equals(cahceMember.getOpenId())) {
                    MemberEntity updateMember =
                            MemberEntity.builder().id(cahceMember.getMemberId()).memberName(userDetail.getName()).openId(userDetail.getOpenId()).isDeleted(false).spaceId(contactMeta.spaceId).build();
                    // 需要恢复的成员
                    if (cahceMember.getIsDeleted()) {
                        contactMeta.recoverMemberIds.add(cahceMember.getMemberId());
                    }
                    // 更新缓存
                    cahceMember.setMemberName(userDetail.getName());
                    cahceMember.setOpenId(userDetail.getOpenId());
                    cahceMember.setIsDeleted(false);
                    contactMeta.openUserToMemberMap.put(cahceMember.getOpenId(), cahceMember);
                    contactMeta.updateMemberEntities.add(updateMember);
                }
            }
            // 标记本次同步的用户
            cahceMember.setIsCurrentSync(true);
        }
        // 绑定部门，如果缓存中没有对应的部门关系，直接挂钩Root部门
        cahceMember.getNewUnitTeamIds().add(parentTeamId);
        if (CollUtil.isEmpty(cahceMember.getOldUnitTeamIds()) || (CollUtil.isNotEmpty(cahceMember.getOldUnitTeamIds()) && !cahceMember.getOldUnitTeamIds().contains(parentTeamId))) {
            // 成员历史不存在部门下，添加成员和部门关联记录
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(parentTeamId, cahceMember.getMemberId()));
        }
        contactMeta.openIds.add(dingTalkUserid);
        // 添加 钉钉用户-维格表用户
        contactMeta.openUserToMemberMap.put(dingTalkUserid, cahceMember);
    }

    private void handleDingTalkDept(DingTalkContactMeta contactMeta, DingTalkDepartmentDTO deptBaseInfo) {
        if (ROOT_DEPARTMENT_ID.equals(deptBaseInfo.getDeptId())) {
            // 不处理根部门
            return;
        }
        Long parentDeptId = deptBaseInfo.getParentDeptId();
        String tenantId = contactMeta.tenantId;
        String spaceId = contactMeta.spaceId;
        List<Long> subDepIds = contactMeta.openDeptIdMap.containsKey(parentDeptId) ? contactMeta.openDeptIdMap.get(parentDeptId) : CollUtil.newArrayList();
        subDepIds.add(deptBaseInfo.getDeptId());
        contactMeta.openDeptIdMap.put(parentDeptId, subDepIds);
        int sequence = subDepIds.size();

        OpenDeptToTeam openDeptToTeam = contactMeta.openDeptToTeamMap.get(deptBaseInfo.getDeptId());
        Long teamPid = contactMeta.getTeamId(parentDeptId);

        if (null == openDeptToTeam) {
            TeamEntity team = OrganizationFactory.createTeam(spaceId, IdWorker.getId(), teamPid, deptBaseInfo.getDeptName(),
                    sequence);

            contactMeta.teamEntities.add(team);
            SocialTenantDepartmentEntity dingTalkDepartment = SocialFactory.createDingTalkDepartment(spaceId, tenantId, deptBaseInfo);
            contactMeta.tenantDepartmentEntities.add(dingTalkDepartment);
            contactMeta.tenantDepartmentBindEntities.add(SocialFactory.createTenantDepartmentBind(spaceId, team.getId(), tenantId, deptBaseInfo.getDeptId().toString()));
            // 同步关系
            openDeptToTeam = OpenDeptToTeam.builder()
                    .departmentName(team.getTeamName())
                    .departmentId(Long.valueOf(dingTalkDepartment.getDepartmentId())).openDepartmentId(Long.valueOf(dingTalkDepartment.getOpenDepartmentId()))
                    .parentDepartmentId(Long.valueOf(dingTalkDepartment.getParentId())).parentOpenDepartmentId(Long.valueOf(dingTalkDepartment.getParentOpenDepartmentId()))
                    .teamId(team.getId()).parentTeamId(team.getParentId())
                    .internalSequence(team.getSequence())
                    .isNew(true)
                    .op(SyncOperation.ADD)
                    .build();
        }
        else {
            boolean isUpdate = BooleanUtil.or(
                    // 是否修改部门层级
                    BooleanUtil.negate(openDeptToTeam.getParentOpenDepartmentId().equals(parentDeptId)),
                    // 是否修改名称
                    BooleanUtil.negate(openDeptToTeam.getDepartmentName().equals(deptBaseInfo.getDeptName())),
                    // 是否修改顺序
                    openDeptToTeam.getInternalSequence() != sequence
            );
            if (isUpdate) {
                // 修改部门结构
                SocialTenantDepartmentEntity updateTenantDepartment = SocialTenantDepartmentEntity.builder()
                        .id(openDeptToTeam.getId())
                        .departmentName(deptBaseInfo.getDeptName())
                        .parentId(parentDeptId.toString())
                        .parentOpenDepartmentId(parentDeptId.toString())
                        .departmentOrder(sequence)
                        .build();
                contactMeta.updateTenantDepartmentEntities.add(updateTenantDepartment);

                TeamEntity updateTeam = TeamEntity.builder()
                        .id(openDeptToTeam.getTeamId())
                        .teamName(deptBaseInfo.getDeptName())
                        .parentId(teamPid)
                        .sequence(sequence)
                        .build();
                contactMeta.updateTeamEntities.add(updateTeam);

                openDeptToTeam.setDepartmentName(updateTenantDepartment.getDepartmentName())
                        .setParentDepartmentId(Long.valueOf(updateTenantDepartment.getParentId()))
                        .setParentOpenDepartmentId(Long.valueOf(updateTenantDepartment.getParentOpenDepartmentId()))
                        .setParentTeamId(updateTeam.getParentId())
                        .setInternalSequence(sequence);
                openDeptToTeam.setOp(SyncOperation.UPDATE);
            }
            else {
                // 没有修改
                openDeptToTeam.setOp(SyncOperation.KEEP);
            }
        }

        // 保存父部门ID->teamId
        openDeptToTeam.setIsCurrentSync(true); // 标记本次同步的部门
        contactMeta.openDeptToTeamMap.put(deptBaseInfo.getDeptId(), openDeptToTeam);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder(toBuilder = true)
    protected static class OpenUserToMember {

        private Long memberId;

        private String openId;

        private String memberName;

        private Set<Long> oldUnitTeamIds;

        @Builder.Default
        private Set<Long> newUnitTeamIds = new HashSet<>();

        @Builder.Default
        private Boolean isNew = false;

        @Builder.Default
        private Boolean isCurrentSync = false;

        @Builder.Default
        private Boolean isDeleted = false;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Accessors(chain = true)
    @Builder(toBuilder = true)
    protected static class OpenDeptToTeam {
        private Long id;

        private String departmentName;

        private Long departmentId;

        private Long parentDepartmentId;

        private Long openDepartmentId;

        private Long parentOpenDepartmentId;

        private Long teamId;

        private Long parentTeamId;

        private Integer internalSequence;

        @Builder.Default
        private Boolean isNew = false;

        @Builder.Default
        private Boolean isCurrentSync = false;

        private SyncOperation op;

        enum SyncOperation {
            ADD, UPDATE, KEEP
        }

    }

    class ContactMeta {
        String spaceId;

        List<SocialTenantDepartmentEntity> tenantDepartmentEntities = new ArrayList<>();

        List<SocialTenantDepartmentEntity> updateTenantDepartmentEntities = new ArrayList<>();

        List<SocialTenantDepartmentBindEntity> tenantDepartmentBindEntities = new ArrayList<>();

        List<SocialTenantUserEntity> tenantUserEntities = new ArrayList<>();

        List<TeamEntity> teamEntities = new ArrayList<>();

        List<TeamEntity> updateTeamEntities = new ArrayList<>();

        List<MemberEntity> memberEntities = new ArrayList<>();

        List<MemberEntity> updateMemberEntities = new ArrayList<>();

        List<TeamMemberRelEntity> teamMemberRelEntities = new ArrayList<>();

        List<Long> recoverMemberIds = new ArrayList<>();

        void doSaveOrUpdate() {
            iSocialTenantUserService.createBatch(tenantUserEntities);

            iSocialTenantDepartmentService.createBatch(tenantDepartmentEntities);
            iSocialTenantDepartmentService.updateBatchById(updateTenantDepartmentEntities);

            iSocialTenantDepartmentBindService.createBatch(tenantDepartmentBindEntities);

            iMemberService.batchCreate(spaceId, memberEntities);
            // 恢复之前的组织单元，防止表格里面的成员是灰色的
            if (!recoverMemberIds.isEmpty()) {
                iUnitService.batchUpdateIsDeletedBySpaceIdAndRefId(spaceId, recoverMemberIds, UnitType.MEMBER, false);
            }
            iMemberService.batchUpdateNameAndOpenIdAndIsDeletedByIds(updateMemberEntities);

            iTeamService.batchCreateTeam(spaceId, teamEntities);
            iTeamService.updateBatchById(updateTeamEntities);
            iTeamMemberRelService.createBatch(teamMemberRelEntities);
        }
    }

    class DingTalkContactMeta extends ContactMeta {
        String agentId;

        String tenantId;

        Long rootTeamId;

        // 钉钉用户-维格表用户
        Map<String, OpenUserToMember> openUserToMemberMap = MapUtil.newHashMap(true);

        // 钉钉部门-维格表部门
        Map<Long, OpenDeptToTeam> openDeptToTeamMap = MapUtil.newHashMap(true);

        // 这次同步的钉钉用户ID，用于发送开始使用消息
        Set<String> openIds = CollUtil.newHashSet();

        // 存储父-子部门关系 用于计算sequence
        HashMap<Long, List<Long>> openDeptIdMap = CollUtil.newHashMap();

        DingTalkContactMeta(String spaceId, String tenantId, String agentId, Long rootTeamId) {
            this.spaceId = spaceId;
            this.tenantId = tenantId;
            this.agentId = agentId;
            this.rootTeamId = rootTeamId;
            this.openDeptIdMap.put(ROOT_DEPARTMENT_ID, CollUtil.newArrayList());
        }

        // 获取缓存TeamId，无数据默认：rootTeamId
        Long getTeamId(Long dingTalkDeptId) {
            return Optional.ofNullable(this.openDeptToTeamMap.get(dingTalkDeptId))
                    .map(OpenDeptToTeam::getTeamId)
                    .orElse(rootTeamId);
        }

        void doDeleteTeams() {
            // 计算需要删除的小组
            List<Long> oldTeamIds = iTeamService.getTeamIdsBySpaceId(spaceId);
            Map<Long, Long> newTeams = this.openDeptToTeamMap.values().stream()
                    .filter(OpenDeptToTeam::getIsCurrentSync)
                    .collect(Collectors.toMap(OpenDeptToTeam::getTeamId, OpenDeptToTeam::getDepartmentId));

            Set<Long> newTeamIds = new HashSet<>(newTeams.keySet());

            // 计算交集，没有变更的部门
            newTeamIds.retainAll(oldTeamIds);
            if (!newTeamIds.isEmpty()) {
                // 计算差集，需要删除的部门
                oldTeamIds.removeAll(newTeamIds);
            }

            if (CollUtil.isNotEmpty(oldTeamIds)) {
                List<Long> currentSyncMemberUsers = this.openUserToMemberMap.values().stream()
                        .filter(OpenUserToMember::getIsCurrentSync)
                        .map(OpenUserToMember::getMemberId).collect(Collectors.toList());

                Map<Long, String> teamToWecomTeamMap = this.openDeptToTeamMap.values().stream()
                        .collect(Collectors.toMap(OpenDeptToTeam::getTeamId, dto -> dto.getDepartmentId().toString()));

                for (Long deleteTeamId : oldTeamIds) {
                    // 删除Vika部门下面的Menber，出现人员存在多个部门，需要判断本次同步人员在不在列表中，如果存在就不删除人员，反之删除
                    List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(deleteTeamId);
                    memberIds.removeAll(currentSyncMemberUsers);

                    String deleteWeComTeamId = teamToWecomTeamMap.get(deleteTeamId);
                    if (StrUtil.isNotBlank(deleteWeComTeamId)) {
                        // 移除部门 - 删除第三方部门，并且删除绑定关系，并且删除Vika部门
                        iSocialTenantDepartmentService.deleteSpaceTenantDepartment(spaceId, tenantId, deleteWeComTeamId);
                    }
                    else {
                        // 表示没有绑定过，直接删除Vika部门
                        iTeamService.deleteTeam(deleteTeamId);
                    }
                    // 移除成员
                    iMemberService.batchDeleteMemberFromSpace(spaceId, memberIds, false);
                }
            }
        }

        void deleteMembers() {
            List<Long> oldMemberIds = iMemberService.getMemberIdsBySpaceId(spaceId);
            Map<Long, String> newMemberUsers = this.openUserToMemberMap.values().stream()
                    .filter(OpenUserToMember::getIsCurrentSync)
                    .collect(Collectors.toMap(OpenUserToMember::getMemberId, OpenUserToMember::getOpenId));

            Set<Long> newMemberIds = new HashSet<>(newMemberUsers.keySet());

            // 计算交集，没有变更的用户
            newMemberIds.retainAll(oldMemberIds);
            if (!newMemberIds.isEmpty()) {
                // 计算差集，需要删除的用户
                oldMemberIds.removeAll(newMemberIds);
            }

            // 不等于或需要删除的成员为空，表示不是初次同步
            Set<String> newWeComUserIds = this.openUserToMemberMap.values().stream()
                    .filter(OpenUserToMember::getIsNew)
                    .map(OpenUserToMember::getOpenId)
                    .collect(Collectors.toSet());
            if (newMemberUsers.size() != newWeComUserIds.size() || oldMemberIds.isEmpty()) {
                // 重新计算本次新增的用户
                openIds.retainAll(newWeComUserIds);
            }

            // 移除成员
            iMemberService.batchDeleteMemberFromSpace(spaceId, oldMemberIds, false);
        }

        void doDeleteMemberRels() {
            this.openUserToMemberMap.values().forEach(cahceData -> {
                Set<Long> oldUnitTeamIds = cahceData.getOldUnitTeamIds();
                if (CollUtil.isNotEmpty(oldUnitTeamIds)) {
                    oldUnitTeamIds.removeAll(cahceData.getNewUnitTeamIds());
                    if (CollUtil.isNotEmpty(oldUnitTeamIds)) {
                        teamMemberRelMapper.deleteByTeamIdsAndMemberId(cahceData.getMemberId(), new ArrayList<>(oldUnitTeamIds));
                    }
                }
            });
        }

        void updateMainAdminMember(String openId) {
            OpenUserToMember adminMember = openUserToMemberMap.get(openId);
            // 更新主管理员信息
            iMemberService.updateById(MemberEntity.builder().memberName(adminMember.getMemberName()).id(adminMember.getMemberId()).openId(adminMember.getOpenId()).build());
        }
    }

}
