package com.vikadata.api.enterprise.social.service.impl;

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

import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.enterprise.social.factory.SocialFactory;
import com.vikadata.api.enterprise.social.model.FeishuTenantDetailVO;
import com.vikadata.api.enterprise.social.model.FeishuTenantDetailVO.Space;
import com.vikadata.api.enterprise.social.model.TenantBaseInfoDto;
import com.vikadata.api.enterprise.social.model.TenantBindDTO;
import com.vikadata.api.enterprise.social.model.TenantDetailVO;
import com.vikadata.api.enterprise.social.enums.SocialException;
import com.vikadata.api.organization.enums.UnitType;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.organization.enums.UserSpaceStatus;
import com.vikadata.api.enterprise.billing.service.ISpaceSubscriptionService;
import com.vikadata.api.organization.factory.OrganizationFactory;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.ITeamMemberRelService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.enums.SocialNameModified;
import com.vikadata.api.enterprise.social.model.DingTalkContactDTO;
import com.vikadata.api.enterprise.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.enterprise.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.api.enterprise.social.service.IFeishuService;
import com.vikadata.api.enterprise.social.service.ISocialService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.enterprise.social.service.ISocialTenantUserService;
import com.vikadata.api.enterprise.social.service.ISocialUserBindService;
import com.vikadata.api.enterprise.social.service.impl.SocialServiceImpl.OpenDeptToTeam.SyncOperation;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.space.service.ISpaceRoleService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.shared.util.CollectionUtil;
import com.vikadata.api.enterprise.billing.util.model.SubscribePlanInfo;
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
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuTenantInfo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.workspace.enums.PermissionException.SET_MAIN_ADMIN_FAIL;
import static com.vikadata.social.dingtalk.constants.DingTalkConst.ROOT_DEPARTMENT_ID;
import static com.vikadata.social.feishu.constants.FeishuErrorCode.GET_TENANT_DENIED;

/**
 * Third party integration service interface implementation
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
        // Check whether the user is in the tenant and an administrator
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
                // This application has not been used by the enterprise in 180 days, so it is not an error, just return NULL
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
                // DingTalk Subscription
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
        log.info("Replace the master administrator");
        // Update space and member information
        Long beforeOwnerMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        if (beforeOwnerMemberId != null && beforeOwnerMemberId.equals(memberId)) {
            log.warn("Like the master administrator, no change is required");
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
        // If the new administrator was originally a sub administrator, delete the original permission
        int count = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId));
        if (count > 0) {
            iSpaceRoleService.deleteRole(spaceId, memberId);
        }

    }

    @Override
    public List<String> getSocialDisableRoleGroupCode(String spaceId) {
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        // Filtering Ding Talk third-party integration
        if (bindInfo != null && bindInfo.getAppId() != null) {
            SocialTenantEntity entity = iSocialTenantService.getByAppIdAndTenantId(bindInfo.getAppId(),
                    bindInfo.getTenantId());
            boolean isDingTalkIsv = SocialPlatformType.DINGTALK.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.equals(SocialAppType.of(entity.getAppType()));
            boolean isWeComIsv = SocialPlatformType.WECOM.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.getType() == entity.getAppType();
            boolean isLarkIsv = SocialPlatformType.FEISHU.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.getType() == entity.getAppType();
            if (isDingTalkIsv || isWeComIsv) {
                return new ArrayList<>();
            }
            if (isLarkIsv) {
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
        // Self built authorization application. It is not necessary to obtain the address book authorization permission of DingTalk
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String tenantId = agentApp.getCorpId();
        // Root organization ID of the space
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // DingTalk user information of the main administrator of the space
        DingTalkUserDetail operatorOpenUser = dingTalkService.getUserDetailByUserId(agentId, operatorOpenId);
        // Primary administrator member ID of the space
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        // Initialize master administrator information
        OpenUserToMember mainAdminOpenUserToMember = OpenUserToMember.builder().memberId(mainAdminMemberId)
                .memberName(operatorOpenUser.getName())
                .openId(operatorOpenId)
                .oldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(mainAdminMemberId)))
                .isNew(false).isCurrentSync(true).build();
        DingTalkContactMeta contactMeta = new DingTalkContactMeta(spaceId, tenantId, agentId, rootTeamId);
        contactMeta.openUserToMemberMap.put(operatorOpenId, mainAdminOpenUserToMember);
        // Initialize root department information
        OpenDeptToTeam rootDeptToTeam = OpenDeptToTeam.builder().departmentId(ROOT_DEPARTMENT_ID).teamId(rootTeamId)
                .isNew(false).isCurrentSync(true).op(SyncOperation.KEEP)
                .build();
        contactMeta.openDeptToTeamMap.put(ROOT_DEPARTMENT_ID, rootDeptToTeam);
        // The map of the currently synchronized member open User -> vika Member
        List<MemberEntity> memberList = iMemberService.getMembersBySpaceId(spaceId, true);
        // The same open ID, only the latest member is reserved
        Map<String, OpenUserToMember> memberListByOpenIdToMap = memberList.stream()
                // Since the master management is initialized manually above, filtering is required here
                .filter(dto -> !dto.getId().equals(mainAdminMemberId))
                .collect(Collectors.toMap(MemberEntity::getOpenId, dto -> {
                    OpenUserToMember cahceData =
                            OpenUserToMember.builder().openId(dto.getOpenId()).memberId(dto.getId()).memberName(dto.getMemberName()).isDeleted(dto.getIsDeleted()).build();
                    // Query Associated Organization Ids todo Batch query is required here
                    cahceData.setOldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(cahceData.getMemberId())));
                    return cahceData;
                }, (pre, cur) -> !cur.getIsDeleted() ? cur : pre));
        contactMeta.openUserToMemberMap.putAll(memberListByOpenIdToMap);

        // DingTalk department ID and vika system department ID, the initial value is the root department ID
        List<TenantDepartmentBindDTO> teamList = iSocialTenantDepartmentService.getTenantBindTeamListBySpaceId(spaceId);
        Map<Long, OpenDeptToTeam> teamListByDepartmentIdToMap = teamList.stream().collect(Collectors.toMap(keyDto -> Long.valueOf(keyDto.getDepartmentId()), dto -> OpenDeptToTeam.builder()
                .id(dto.getId()).departmentName(dto.getDepartmentName())
                .departmentId(Long.valueOf(dto.getDepartmentId())).openDepartmentId(Long.valueOf(dto.getOpenDepartmentId()))
                .parentDepartmentId(Long.valueOf(dto.getParentDepartmentId())).parentOpenDepartmentId(Long.valueOf(dto.getParentOpenDepartmentId()))
                .teamId(dto.getTeamId()).parentTeamId(dto.getParentTeamId())
                .internalSequence(dto.getInternalSequence())
                .build()));
        contactMeta.openDeptToTeamMap.putAll(teamListByDepartmentIdToMap);
        // Synchronize contacts
        syncDingTalkContacts(contactMeta, contactMap);

        // Limit on number of inspectors
        // long defaultMaxMemberCount = iSubscriptionService.getPlanSeats(spaceId);
        // ExceptionUtil.isTrue(contactMeta.openIds.size() <= defaultMaxMemberCount, SubscribeFunctionException.MEMBER_LIMIT);
        // If the synchronization member does not have a master administrator, the master administrator needs to be attached to the root door
        if (!contactMeta.openIds.contains(operatorOpenId)) {
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(rootTeamId, mainAdminMemberId));
        }
        // Initialize address book structure
        contactMeta.doDeleteTeams();
        // Delete the missing member
        contactMeta.deleteMembers();
        // Delete member association
        contactMeta.doDeleteMemberRels();
        // Update master administrator information
        contactMeta.updateMainAdminMember(operatorOpenId);
        // Store to DB
        contactMeta.doSaveOrUpdate();
        // Delete Cache
        userSpaceService.delete(spaceId);
        return contactMeta.openIds;
    }

    private void syncDingTalkContacts(DingTalkContactMeta contactMeta, LinkedHashMap<Long, DingTalkContactDTO> contactTree) {
        Set<Long> deptIds = contactTree.keySet();
        contactTree.forEach((deptId, contact) -> {
            DingTalkDepartmentDTO dingTalkDepartmentDTO = contact.getDepartment();
            // The current visible range has no parent department
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
        // Filter inactive DingTalk users
        if (BooleanUtil.isFalse(userDetail.getActive())) {
            return;
        }
        String dingTalkUserid = userDetail.getOpenId();
        OpenUserToMember cahceMember = contactMeta.openUserToMemberMap.get(dingTalkUserid);
        // No synchronization
        if (!contactMeta.openIds.contains(dingTalkUserid)) {
            // The member in the database does not exist and has not been synchronized. Users can be bound only when they need to log in
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
                // ExistCheck whether key information needs to be modified
                if (!cahceMember.getMemberName().equals(userDetail.getName()) || cahceMember.getIsDeleted() || !userDetail.getOpenId().equals(cahceMember.getOpenId())) {
                    MemberEntity updateMember =
                            MemberEntity.builder().id(cahceMember.getMemberId()).memberName(userDetail.getName()).openId(userDetail.getOpenId()).isDeleted(false).spaceId(contactMeta.spaceId).build();
                    // Members to be recovered
                    if (cahceMember.getIsDeleted()) {
                        contactMeta.recoverMemberIds.add(cahceMember.getMemberId());
                    }
                    // Update Cache
                    cahceMember.setMemberName(userDetail.getName());
                    cahceMember.setOpenId(userDetail.getOpenId());
                    cahceMember.setIsDeleted(false);
                    contactMeta.openUserToMemberMap.put(cahceMember.getOpenId(), cahceMember);
                    contactMeta.updateMemberEntities.add(updateMember);
                }
            }
            // Mark users for this synchronization
            cahceMember.setIsCurrentSync(true);
        }
        // Bind departments. If there is no corresponding department relationship in the cache, directly link to the root department
        cahceMember.getNewUnitTeamIds().add(parentTeamId);
        if (CollUtil.isEmpty(cahceMember.getOldUnitTeamIds()) || (CollUtil.isNotEmpty(cahceMember.getOldUnitTeamIds()) && !cahceMember.getOldUnitTeamIds().contains(parentTeamId))) {
            // Member history does not exist under department, add member and department association records
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(parentTeamId, cahceMember.getMemberId()));
        }
        contactMeta.openIds.add(dingTalkUserid);
        // Add DingTalk user - vika user
        contactMeta.openUserToMemberMap.put(dingTalkUserid, cahceMember);
    }

    private void handleDingTalkDept(DingTalkContactMeta contactMeta, DingTalkDepartmentDTO deptBaseInfo) {
        if (ROOT_DEPARTMENT_ID.equals(deptBaseInfo.getDeptId())) {
            // Do not process root department
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
            // Synchronous relation
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
                    // Modify Department Level
                    BooleanUtil.negate(openDeptToTeam.getParentOpenDepartmentId().equals(parentDeptId)),
                    // Modify Name
                    BooleanUtil.negate(openDeptToTeam.getDepartmentName().equals(deptBaseInfo.getDeptName())),
                    // Modify Order
                    openDeptToTeam.getInternalSequence() != sequence
            );
            if (isUpdate) {
                // Modify Department Structure
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
                // No modification
                openDeptToTeam.setOp(SyncOperation.KEEP);
            }
        }

        // Save parent department ID -> team ID
        openDeptToTeam.setIsCurrentSync(true); // Mark the department for this synchronization
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
            // Restore the previous organizational unit to prevent the members in the table from being grayed out
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

        // DingTalk User - vika User
        Map<String, OpenUserToMember> openUserToMemberMap = MapUtil.newHashMap(true);

        // DingTalk Department - vika Department
        Map<Long, OpenDeptToTeam> openDeptToTeamMap = MapUtil.newHashMap(true);

        // The DingTalk user ID of this synchronization, which is used to send the start message
        Set<String> openIds = CollUtil.newHashSet();

        // Store the parent-child department relationship for calculating sequence
        HashMap<Long, List<Long>> openDeptIdMap = CollUtil.newHashMap();

        DingTalkContactMeta(String spaceId, String tenantId, String agentId, Long rootTeamId) {
            this.spaceId = spaceId;
            this.tenantId = tenantId;
            this.agentId = agentId;
            this.rootTeamId = rootTeamId;
            this.openDeptIdMap.put(ROOT_DEPARTMENT_ID, CollUtil.newArrayList());
        }

        // Get the cached Team Id. No data. Default: root Team Id
        Long getTeamId(Long dingTalkDeptId) {
            return Optional.ofNullable(this.openDeptToTeamMap.get(dingTalkDeptId))
                    .map(OpenDeptToTeam::getTeamId)
                    .orElse(rootTeamId);
        }

        void doDeleteTeams() {
            // Calculate the groups to be deleted
            List<Long> oldTeamIds = iTeamService.getTeamIdsBySpaceId(spaceId);
            Map<Long, Long> newTeams = this.openDeptToTeamMap.values().stream()
                    .filter(OpenDeptToTeam::getIsCurrentSync)
                    .collect(Collectors.toMap(OpenDeptToTeam::getTeamId, OpenDeptToTeam::getDepartmentId));

            Set<Long> newTeamIds = new HashSet<>(newTeams.keySet());

            // Calculate intersection, department without change
            newTeamIds.retainAll(oldTeamIds);
            if (!newTeamIds.isEmpty()) {
                // Calculate the difference set and the department to be deleted
                oldTeamIds.removeAll(newTeamIds);
            }

            if (CollUtil.isNotEmpty(oldTeamIds)) {
                List<Long> currentSyncMemberUsers = this.openUserToMemberMap.values().stream()
                        .filter(OpenUserToMember::getIsCurrentSync)
                        .map(OpenUserToMember::getMemberId).collect(Collectors.toList());

                Map<Long, String> teamToWecomTeamMap = this.openDeptToTeamMap.values().stream()
                        .collect(Collectors.toMap(OpenDeptToTeam::getTeamId, dto -> dto.getDepartmentId().toString()));

                for (Long deleteTeamId : oldTeamIds) {
                    // Delete the Member under the vika department. There are multiple departments for the personnel. It is necessary to judge whether the synchronized personnel are in the list.
                    // If they exist, they will not be deleted. Otherwise, they will be deleted
                    List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(deleteTeamId);
                    memberIds.removeAll(currentSyncMemberUsers);

                    String deleteWeComTeamId = teamToWecomTeamMap.get(deleteTeamId);
                    if (StrUtil.isNotBlank(deleteWeComTeamId)) {
                        // Remove department - delete the third-party department, delete the binding relationship, and delete the Vika department
                        iSocialTenantDepartmentService.deleteSpaceTenantDepartment(spaceId, tenantId, deleteWeComTeamId);
                    }
                    else {
                        // It means that there is no binding, and vika department is deleted directly
                        iTeamService.deleteTeam(deleteTeamId);
                    }
                    // Remove Members
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

            // Calculate intersection, users without changes
            newMemberIds.retainAll(oldMemberIds);
            if (!newMemberIds.isEmpty()) {
                // Users to be deleted when calculating difference sets
                oldMemberIds.removeAll(newMemberIds);
            }

            // The member that is not equal to or needs to be deleted is empty, which means it is not the first synchronization
            Set<String> newWeComUserIds = this.openUserToMemberMap.values().stream()
                    .filter(OpenUserToMember::getIsNew)
                    .map(OpenUserToMember::getOpenId)
                    .collect(Collectors.toSet());
            if (newMemberUsers.size() != newWeComUserIds.size() || oldMemberIds.isEmpty()) {
                // Recalculate the new users
                openIds.retainAll(newWeComUserIds);
            }

            // Remove Members
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
            // Update master administrator information
            iMemberService.updateById(MemberEntity.builder().memberName(adminMember.getMemberName()).id(adminMember.getMemberId()).openId(adminMember.getOpenId()).build());
        }
    }

}
