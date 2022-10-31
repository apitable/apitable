package com.vikadata.api.modular.space.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Privilege;

import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationRenderField;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.SpaceException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.holder.NotificationRenderFieldHolder;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.dto.base.MapDTO;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.dto.space.SpaceAdminInfoDto;
import com.vikadata.api.model.ro.space.SpaceUpdateOpRo;
import com.vikadata.api.model.vo.space.SpaceInfoVO;
import com.vikadata.api.model.vo.space.SpaceSocialConfig;
import com.vikadata.api.model.vo.space.SpaceVO;
import com.vikadata.api.model.vo.space.UserSpaceVo;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.internal.model.InternalSpaceCapacityVo;
import com.vikadata.api.modular.internal.model.InternalSpaceUsageVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.mapper.SocialTenantMapper;
import com.vikadata.api.modular.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDomainService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.IWeComService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.modular.space.model.GetSpaceListFilterCondition;
import com.vikadata.api.modular.space.model.SpaceCapacityUsedInfo;
import com.vikadata.api.modular.space.model.SpaceUpdateOperate;
import com.vikadata.api.modular.space.service.IInvitationService;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.statics.model.ControlStaticsVO;
import com.vikadata.api.modular.statics.model.DatasheetStaticsVO;
import com.vikadata.api.modular.statics.model.NodeTypeStatics;
import com.vikadata.api.modular.statics.service.IStaticsService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareSettingService;
import com.vikadata.api.security.ValidateCodeProcessorManage;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.billing.model.BillingPlanFeature;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.NotificationConstants.NEW_SPACE_NAME;
import static com.vikadata.api.constants.NotificationConstants.OLD_SPACE_NAME;
import static com.vikadata.api.enums.exception.OrganizationException.CREATE_MEMBER_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.NOT_EXIST_MEMBER;
import static com.vikadata.api.enums.exception.PermissionException.CAN_OP_MAIN_ADMIN;
import static com.vikadata.api.enums.exception.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.PermissionException.SET_MAIN_ADMIN_FAIL;
import static com.vikadata.api.enums.exception.PermissionException.TRANSFER_SELF;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_VISIBLE_WECOM;
import static com.vikadata.api.enums.exception.SpaceException.NO_ALLOW_OPERATE;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_QUIT_FAILURE;

@Service
@Slf4j
public class SpaceServiceImpl extends ServiceImpl<SpaceMapper, SpaceEntity> implements ISpaceService {

    @Resource
    private IUserService userService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private IStaticsService iStaticsService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private SocialTenantMapper socialTenantMapper;

    @Resource
    private ISocialService iSocialService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IWeComService iWeComService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private INodeShareSettingService iNodeShareSettingService;

    @Resource
    private ISocialTenantDomainService iSocialTenantDomainService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private IInvitationService iInvitationService;

    @Override
    public SpaceEntity getBySpaceId(String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(entity, SPACE_NOT_EXIST);
        return entity;
    }

    @Override
    public void checkExist(String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(entity, SPACE_NOT_EXIST);
    }

    @Override
    public SpaceEntity getBySpaceIdIgnoreDeleted(String spaceId) {
        return getBaseMapper().selectBySpaceIdIgnoreDeleted(spaceId);
    }

    @Override
    public List<SpaceEntity> getBySpaceIds(List<String> spaceIds) {
        return baseMapper.selectBySpaceIds(spaceIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createSpace(UserEntity user, String spaceName) {
        log.info("Create space");
        Long userId = user.getId();
        // Check whether the user reaches the upper limit
        boolean limit = this.checkSpaceNumber(userId);
        ExceptionUtil.isFalse(limit, SpaceException.NUMBER_LIMIT);
        String spaceId = IdUtil.createSpaceId();
        memberMapper.updateInactiveStatusByUserId(userId);
        MemberEntity member = new MemberEntity();
        member.setSpaceId(spaceId);
        // synchronize user information
        member.setUserId(userId);
        member.setMemberName(user.getNickName());
        member.setMobile(user.getMobilePhone());
        member.setEmail(user.getEmail());
        member.setStatus(UserSpaceStatus.ACTIVE.getStatus());
        member.setIsAdmin(true);
        member.setIsActive(true);
        // the creator of space
        boolean addMember = iMemberService.save(member);
        ExceptionUtil.isTrue(addMember, CREATE_MEMBER_ERROR);
        // create unit
        iUnitService.create(spaceId, UnitType.MEMBER, member.getId());
        String props = JSONUtil.parseObj(SpaceGlobalFeature.builder()
                .fileSharable(true)
                .invitable(true)
                .joinable(false)
                .nodeExportable(true)
                .allowCopyDataToExternal(true)
                .allowDownloadAttachment(true)
                .mobileShowable(false)
                .watermarkEnable(false)
                .build()).toString();
        SpaceEntity space = SpaceEntity.builder()
                .spaceId(spaceId)
                .name(spaceName)
                .owner(member.getId())
                .creator(member.getId())
                .props(props)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
        boolean addSpace = save(space);
        ExceptionUtil.isTrue(addSpace, SpaceException.CREATE_SPACE_ERROR);
        // add root node
        String rootNodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
                .spaceId(space.getSpaceId())
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType()).build());
        // create root department
        Long rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
        iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);
        //  create root department and member binding
        iTeamMemberRelService.addMemberTeams(Collections.singletonList(member.getId()), Collections.singletonList(rootTeamId));
        // gets the node id of the default reference template for the new space.
        String templateNodeId = iTemplateService.getDefaultTemplateNodeId();
        if (StrUtil.isNotBlank(templateNodeId)) {
            // the dump node method, contains grpc calls, placing the last.
            iNodeService.copyNodeToSpace(userId, spaceId, rootNodeId, templateNodeId, NodeCopyOptions.create());
        }
        return spaceId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SpaceEntity createWeComIsvSpaceWithoutUser(String spaceName) {

        String spaceId = IdUtil.createSpaceId();
        SpaceEntity space = SocialFactory.createSocialBindBindSpaceInfo(spaceId, spaceName, null, null, null);
        boolean isSaved = save(space);
        ExceptionUtil.isTrue(isSaved, SpaceException.CREATE_SPACE_ERROR);
        // create root department
        Long rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
        iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);

        return space;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSpace(Long userId, String spaceId, SpaceUpdateOpRo spaceOpRo) {
        log.info("edit space information");
        SpaceEntity entity = this.getBySpaceId(spaceId);
        String spaceName = spaceOpRo.getName();
        // modify space name
        this.updateSpaceName(userId, spaceId, spaceName, entity);
        // modify spatial logo
        this.updateSpaceLogo(userId, spaceId, spaceOpRo.getLogo(), entity);
        // delete cache
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId));
    }

    private void updateSpaceName(Long userId, String spaceId, String spaceName, SpaceEntity entity) {
        // The name of the incoming space is empty or the same as the value of the database.
        if (StrUtil.isBlank(spaceName) || spaceName.equals(entity.getName())) {
            return;
        }
        // database change
        SpaceEntity space = SpaceEntity.builder().id(entity.getId()).build();
        space.setName(spaceName);
        boolean flag = updateById(space);
        ExceptionUtil.isTrue(flag, SpaceException.UPDATE_SPACE_INFO_FAIL);
        // synchronous modification of root department
        Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
        iTeamService.updateTeamName(rootTeamId, spaceName);
        // send name modification notification
        NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_NAME_CHANGE, null, userId, spaceId, Dict.create().set(OLD_SPACE_NAME, entity.getName()).set(NEW_SPACE_NAME, spaceName));

        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_SPACE_NAME, entity.getName());
        info.set(AuditConstants.SPACE_NAME, spaceName);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.RENAME_SPACE).userId(userId).spaceId(spaceId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateSpaceLogo(Long userId, String spaceId, String spaceLogo, SpaceEntity entity) {
        // The incoming space Logo is empty or the same as the database value. End
        if (StrUtil.isBlank(spaceLogo) || spaceLogo.equals(entity.getLogo())) {
            return;
        }
        // database change
        SpaceEntity space = SpaceEntity.builder().id(entity.getId()).build();
        space.setLogo(spaceLogo);
        boolean flag = updateById(space);
        ExceptionUtil.isTrue(flag, SpaceException.UPDATE_SPACE_INFO_FAIL);

        // delete the original logo file in the cloud
        if (StrUtil.isNotBlank(entity.getLogo())) {
            TaskManager.me().execute(() -> iAssetService.delete(entity.getLogo()));
        }

        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_SPACE_LOGO, StrUtil.nullToEmpty(entity.getLogo()));
        info.set(AuditConstants.SPACE_LOGO, spaceLogo);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_SPACE_LOGO).userId(userId).spaceId(spaceId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    public void preDeleteById(Long userId, String spaceId) {
        log.info("pre delete space");
        boolean flag = SqlHelper.retBool(baseMapper.updatePreDeletionTimeBySpaceId(LocalDateTime.now(), spaceId, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // Except for the main administrator, other members can no longer enter the space
        iMemberService.preDelBySpaceId(spaceId, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSpace(Long userId, List<String> spaceIds) {
        log.info("user「{}」delete space「{}」", userId, spaceIds);
        // logical delete space
        baseMapper.updateIsDeletedBySpaceIdIn(spaceIds);
        // delete active space cache
        // （After the space is pre-deleted, only the member data of the master management is not logically deleted.
        // If the product logic changes, all members that have not been logically deleted need to be queried to clear the cache.)
        userActiveSpaceService.delete(userId);
        spaceIds.forEach(spaceId -> userSpaceService.delete(userId, spaceId));
        // delete member（must be after deleting user）
        memberMapper.delBySpaceIds(spaceIds, null);
        // delete space exclusive domain name
        iSocialTenantDomainService.removeDomain(spaceIds);
    }

    @Override
    public void cancelDelByIds(Long userId, String spaceId) {
        log.info("undo delete space");
        boolean flag = SqlHelper.retBool(baseMapper.updatePreDeletionTimeBySpaceId(null, spaceId, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        //restore other members
        memberMapper.cancelPreDelBySpaceId(spaceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void quit(String spaceId, Long memberId) {
        log.info("quit space.");
        // Delete corresponding members, the organizations and member relationships
        if (ObjectUtil.isNotNull(memberId)) {
            SpaceEntity entity = this.getBySpaceId(spaceId);
            // the masin administrator cannot exit directly
            ExceptionUtil.isFalse(entity.getOwner().equals(memberId), SPACE_QUIT_FAILURE);
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(memberId), false);
        }
    }

    @Override
    public List<SpaceVO> getSpaceListByUserId(Long userId, GetSpaceListFilterCondition condition) {
        List<SpaceVO> list = baseMapper.selectListByUserId(userId);
        if (CollUtil.isEmpty(list)) {
            return list;
        }
        Map<String, SpaceVO> spaceMaps = list.stream().collect(Collectors.toMap(SpaceVO::getSpaceId, v -> v, (k1, k2) -> k1));
        List<String> spaceIds = new ArrayList<>(spaceMaps.keySet());
        // get space domains
        Map<String, String> spaceDomains = iSocialTenantDomainService.getSpaceDomainBySpaceIdsToMap(spaceIds);
        // batch query subscriptions
        Map<String, BillingPlanFeature> spacePlanFeatureMap = iSpaceSubscriptionService.getSubscriptionFeatureBySpaceIds(spaceIds);
        // setting information
        spaceMaps.forEach((spaceId, spaceVO) -> {
            BillingPlanFeature planFeature = spacePlanFeatureMap.get(spaceId);
            spaceVO.setMaxSeat(planFeature.getMaxSeats());
            spaceVO.setSpaceDomain(spaceDomains.get(spaceId));
        });
        if (condition != null) {
            if (BooleanUtil.isTrue(condition.getManageable())) {
                return list.stream()
                        .filter(v -> v.getAdmin().equals(condition.getManageable()))
                        .collect(Collectors.toList());
            }
        }
        return list;
    }

    @Override
    public SpaceInfoVO getSpaceInfo(String spaceId) {
        SpaceEntity entity = getBySpaceId(spaceId);
        // numbers statistics
        long memberNumber = iStaticsService.getMemberTotalCountBySpaceId(spaceId);
        // teams statistics
        long teamCount = iStaticsService.getTeamTotalCountBySpaceId(spaceId);
        // admin statistics
        long adminCount = iStaticsService.getAdminTotalCountBySpaceId(spaceId);
        // record statistics
        long recordCount = iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        // used space statistics
        long capacityUsedSize = spaceCapacityCacheService.getSpaceCapacity(spaceId);
        // APIusage statistics
        long apiUsage = iStaticsService.getCurrentMonthApiUsage(spaceId);
        // file control amount
        ControlStaticsVO controlStaticsVO = iStaticsService.getFieldRoleTotalCountBySpaceId(spaceId);
        long nodeRoleNums = controlStaticsVO != null ? controlStaticsVO.getNodeRoleCount() : 0L;
        long fieldRoleNums = controlStaticsVO != null ? controlStaticsVO.getFieldRoleCount() : 0L;
        // node statistics
        List<NodeTypeStatics> nodeTypeStatics = iStaticsService.getNodeTypeStaticsBySpaceId(spaceId);
        long sheetNums = nodeTypeStatics.stream()
                .filter(condition -> NodeType.toEnum(condition.getType()).isFileNode())
                .mapToLong(NodeTypeStatics::getTotal).sum();
        long mirrorNums = nodeTypeStatics.stream()
                .filter(condition -> NodeType.MIRROR == NodeType.toEnum(condition.getType()))
                .mapToLong(NodeTypeStatics::getTotal).sum();

        Map<Integer, Integer> typeStaticsMap = nodeTypeStatics.stream().collect(Collectors.toMap(NodeTypeStatics::getType, NodeTypeStatics::getTotal));
        long formViewNums = typeStaticsMap.containsKey(NodeType.FORM.getNodeType()) ? typeStaticsMap.get(NodeType.FORM.getNodeType()) : 0L;
        // table view statistics
        DatasheetStaticsVO viewVO = iStaticsService.getDatasheetStaticsBySpaceId(spaceId);
        SpaceInfoVO vo = SpaceInfoVO.builder()
                .spaceName(entity.getName())
                .spaceLogo(entity.getLogo())
                .createTime(entity.getCreatedAt())
                .deptNumber(teamCount)
                .seats(memberNumber)
                .sheetNums(sheetNums)
                .recordNums(recordCount)
                .adminNums(adminCount)
                .apiRequestCountUsage(apiUsage)
                .capacityUsedSizes(capacityUsedSize)
                .nodeRoleNums(nodeRoleNums)
                .fieldRoleNums(fieldRoleNums)
                .formViewNums(formViewNums)
                .kanbanViewNums(viewVO.getKanbanViews())
                .calendarViewNums(viewVO.getCalendarViews())
                .galleryViewNums(viewVO.getGalleryViews())
                .ganttViewNums(viewVO.getGanttViews())
                .mirrorNums(mirrorNums)
                .build();
        // space attachment capacity usage information
        SpaceCapacityUsedInfo spaceCapacityUsedInfo = this.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        vo.setCurrentBundleCapacityUsedSizes(spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes());
        vo.setGiftCapacityUsedSizes(spaceCapacityUsedInfo.getGiftCapacityUsedSizes());
        // owner info
        if (entity.getOwner() != null) {
            MemberDto ownerMember = memberMapper.selectDtoByMemberId(entity.getOwner());
            if (ownerMember != null) {
                vo.setOwnerName(ownerMember.getMemberName());
                vo.setOwnerAvatar(ownerMember.getAvatar());
                vo.setIsOwnerNameModified(ownerMember.getIsSocialNameModified() > 0);
                if (entity.getCreator() != null) {
                    if (entity.getCreator().equals(ownerMember.getId())) {
                        vo.setCreatorName(ownerMember.getMemberName());
                        vo.setCreatorAvatar(ownerMember.getAvatar());
                        vo.setIsCreatorNameModified(ownerMember.getIsSocialNameModified() > 0);
                    }
                    else {
                        MemberDto creatorMember = memberMapper.selectDtoByMemberId(entity.getCreator());
                        if (creatorMember != null) {
                            vo.setCreatorName(creatorMember.getMemberName());
                            vo.setCreatorAvatar(creatorMember.getAvatar());
                            vo.setIsCreatorNameModified(creatorMember.getIsSocialNameModified() > 0);
                        }
                    }
                }
            }
        }
        if (ObjectUtil.isNotNull(entity.getPreDeletionTime())) {
            vo.setDelTime(entity.getPreDeletionTime().plusDays(7));
        }
        // obtain third party information
        TenantBindDTO tenantBindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        SpaceSocialConfig bindInfo = new SpaceSocialConfig();
        if (ObjectUtil.isNotNull(tenantBindInfo)) {
            if (StrUtil.isNotBlank(tenantBindInfo.getAppId())) {
                SocialTenantEntity socialTenant = socialTenantMapper.selectByAppIdAndTenantId(tenantBindInfo.getAppId(), tenantBindInfo.getTenantId());
                if (socialTenant != null && socialTenant.getStatus()) {
                    bindInfo.setEnabled(true);
                    bindInfo.setPlatform(socialTenant.getPlatform());
                    bindInfo.setAppType(socialTenant.getAppType());
                    bindInfo.setAuthMode(socialTenant.getAuthMode());
                    // is it synchronizing the contact
                    bindInfo.setContactSyncing(isContactSyncing(spaceId));
                }
            }
        }
        vo.setSocial(bindInfo);

        return vo;
    }

    @Override
    public SpaceCapacityUsedInfo getSpaceCapacityUsedInfo(String spaceId, Long capacityUsedSize) {
        SpaceCapacityUsedInfo spaceCapacityUsedInfo = new SpaceCapacityUsedInfo();
        // space subscription plan attachment capacity
        Long currentBundleCapacity = iSpaceSubscriptionService.getSpaceSubscription(spaceId).getSubscriptionCapacity();
        // If the used attachment capacity is less than the space subscription plan capacity, the current used attachment capacity is the current package used capacity.
        if (capacityUsedSize <= currentBundleCapacity) {
            spaceCapacityUsedInfo.setCurrentBundleCapacityUsedSizes(capacityUsedSize);
            // Because the package capacity is preferred, the complimentary attachment capacity has been used to be 0.
            spaceCapacityUsedInfo.setGiftCapacityUsedSizes(0L);
        }
        else {
            spaceCapacityUsedInfo.setCurrentBundleCapacityUsedSizes(currentBundleCapacity);
            // complimentary attachment capacity
            Long giftCapacity = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(spaceId);
            // If the attachment capacity is used in excess,
            // the used complimentary attachment capacity is equal to the size of the complimentary assert capacity.
            if (capacityUsedSize > currentBundleCapacity + giftCapacity) {
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(giftCapacity);
            }
            else {
                // no excess
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(capacityUsedSize - currentBundleCapacity);
            }
        }
        return spaceCapacityUsedInfo;
    }

    @Override
    public InternalSpaceUsageVo getInternalSpaceUsageVo(String spaceId) {
        log.info("Get the usage information of the space {}", spaceId);
        InternalSpaceUsageVo vo = new InternalSpaceUsageVo();
        // statistics of total records
        long recordNums = iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        vo.setRecordNums(recordNums);
        // table view statistics
        DatasheetStaticsVO viewVO = iStaticsService.getDatasheetStaticsBySpaceId(spaceId);
        vo.setGalleryViewNums(viewVO.getGalleryViews());
        vo.setKanbanViewNums(viewVO.getKanbanViews());
        vo.setGanttViewNums(viewVO.getGanttViews());
        vo.setCalendarViewNums(viewVO.getCalendarViews());
        return vo;
    }

    @Override
    public InternalSpaceCapacityVo getSpaceCapacityVo(String spaceId) {
        log.info("Obtain the capacity information of the space");
        // used space statistics
        Long usedCapacity = spaceCapacityCacheService.getSpaceCapacity(spaceId);
        // space subscription plan attachment capacity
        Long currentBundleCapacity = iSpaceSubscriptionService.getPlanMaxCapacity(spaceId);
        // complimentary attachment capacity
        Long unExpireGiftCapacity = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(spaceId);
        // total capacity of space assert
        Long totalCapacity = currentBundleCapacity + unExpireGiftCapacity;
        return InternalSpaceCapacityVo.builder()
                .usedCapacity(usedCapacity)
                .currentBundleCapacity(currentBundleCapacity)
                .unExpireGiftCapacity(unExpireGiftCapacity)
                .totalCapacity(totalCapacity)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long changeMainAdmin(String spaceId, Long memberId) {
        log.info("Change main admin");
        // Verifying new members
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        ExceptionUtil.isNotNull(userId, NOT_EXIST_MEMBER);
        // Check whether the space of the user corresponding to the new active administrator has reached the upper limit
        boolean limit = this.checkSpaceNumber(userId);
        ExceptionUtil.isFalse(limit, SpaceException.USER_ADMIN_SPACE_LIMIT);
        // Obtain the information about the main administrator
        SpaceAdminInfoDto dto = baseMapper.selectAdminInfoDto(spaceId);
        ExceptionUtil.isNotNull(dto, SPACE_NOT_EXIST);
        ExceptionUtil.isFalse(dto.getMemberId().equals(memberId), TRANSFER_SELF);
        if (dto.getMobile() != null) {
            // check whether the mobile phone verification code is passed
            ValidateTarget target = ValidateTarget.create(dto.getMobile(), dto.getAreaCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).verifyIsPass(target.getRealTarget());
        }
        else if (dto.getEmail() != null) {
            // check whether the sms verification code is passed
            ValidateTarget target = ValidateTarget.create(dto.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).verifyIsPass(target.getRealTarget());
        }
        // Update space and member information
        boolean flag = SqlHelper.retBool(baseMapper.updateSpaceOwnerId(spaceId, memberId, SessionContext.getUserId()));
        ExceptionUtil.isTrue(flag, SET_MAIN_ADMIN_FAIL);
        iMemberService.cancelMemberMainAdmin(dto.getMemberId());
        iMemberService.setMemberMainAdmin(memberId);
        // If the new administrator is a sub-administrator, delete the original permission
        int count = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId));
        if (count > 0) {
            iSpaceRoleService.deleteRole(spaceId, memberId);
        }
        MemberEntity newMember = memberMapper.selectById(memberId);
        // Send email notification to the new main administrator
        if (ObjectUtil.isNotNull(newMember) && StrUtil.isNotBlank(newMember.getEmail())) {
            Dict dict = Dict.create();
            dict.set("USER_NAME", dto.getMemberName());
            dict.set("SPACE_NAME", dto.getSpaceName());
            dict.set("URL", StrUtil.format(constProperties.getServerDomain() + "/space/{}/workbench", spaceId));
            dict.set("YEARS", LocalDate.now().getYear());
            final String lang;
            lang = userService.getLangByEmail(LocaleContextHolder.getLocale().toLanguageTag(), newMember.getEmail());
            NotifyMailFactory.me().sendMail(lang, MailPropConstants.SUBJECT_CHANGE_ADMIN, dict, Collections.singletonList(newMember.getEmail()));
        }
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(ListUtil.toList(memberId)).build());
        return userId;
    }

    @Override
    public void removeMainAdmin(String spaceId) {

        baseMapper.removeSpaceOwnerId(spaceId, null);

    }

    @Override
    public Long getSpaceMainAdminMemberId(String spaceId) {
        return baseMapper.selectSpaceMainAdmin(spaceId);
    }

    @Override
    public Long getSpaceMainAdminUserId(String spaceId) {
        Long spaceMainAdminMemberId = getSpaceMainAdminMemberId(spaceId);
        return memberMapper.selectUserIdByMemberId(spaceMainAdminMemberId);
    }

    @Override
    public void checkMemberIsMainAdmin(String spaceId, Long memberId) {
        log.info("checks whether specified member is main admin");
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean isMainAdmin = owner != null && owner.equals(memberId);
        ExceptionUtil.isFalse(isMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    @Override
    public void checkMembersIsMainAdmin(String spaceId, List<Long> memberIds) {
        log.info("Batch checks whether specified members are main admin");
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean haveMainAdmin = CollUtil.contains(memberIds, owner);
        ExceptionUtil.isFalse(haveMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    @Override
    public void checkMemberInSpace(String spaceId, Long memberId) {
        log.info("checks whether the specified member is in space");
        MemberEntity member = memberMapper.selectMemberIdAndSpaceId(spaceId, memberId);
        ExceptionUtil.isNotNull(member, MEMBER_NOT_IN_SPACE);
    }

    @Override
    public void checkMembersInSpace(String spaceId, List<Long> memberIds) {
        log.info("Batch checks whether specified members are in space");
        int count = SqlTool.retCount(memberMapper.selectCountByMemberIds(memberIds));
        ExceptionUtil.isTrue(count == memberIds.size(), MEMBER_NOT_IN_SPACE);
    }

    @Override
    public UserSpaceVo getUserSpaceResource(Long userId, String spaceId) {
        log.info("obtain the space resource permission");
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, spaceId);
        UserSpaceVo userSpaceVo = new UserSpaceVo();
        userSpaceVo.setSpaceName(userSpaceDto.getSpaceName());
        userSpaceVo.setMainAdmin(userSpaceDto.isMainAdmin());
        Set<String> resourceGroupCodes = userSpaceDto.getResourceGroupCodes();
        if (CollUtil.isNotEmpty(resourceGroupCodes)) {
            List<String> disabledResourceGroupCodes = iSocialService.getSocialDisableRoleGroupCode(spaceId);
            if (CollUtil.isNotEmpty(disabledResourceGroupCodes)) {
                disabledResourceGroupCodes.forEach(resourceGroupCodes::remove);
            }
            userSpaceVo.setPermissions(resourceGroupCodes);
        }
        return userSpaceVo;
    }

    @Override
    public SpaceGlobalFeature getSpaceGlobalFeature(String spaceId) {
        log.info("gets space global properties，spaceId:{}", spaceId);
        String props = baseMapper.selectPropsBySpaceId(spaceId);
        ExceptionUtil.isNotNull(props, SpaceException.SPACE_NOT_EXIST);

        return JSONUtil.toBean(props, SpaceGlobalFeature.class);
    }

    @Override
    public void switchSpacePros(Long userId, String spaceId, SpaceGlobalFeature feature) {
        log.info("switch space pros，userId:{},spaceId:{}", userId, spaceId);
        JSONObject json = JSONUtil.parseObj(feature);
        if (json.size() == 0) {
            return;
        }
        List<MapDTO> features = new ArrayList<>(json.size());
        for (Entry<String, Object> entry : json.entrySet()) {
            log.info("switch space pros，key:{},value:{}", entry.getKey(), entry.getValue());
            features.add(new MapDTO(entry.getKey(), entry.getValue()));
        }
        boolean flag = SqlHelper.retBool(baseMapper.updateProps(userId, spaceId, features));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // When the function of inviting all members of the space is turned off,
        // all public invitation links generated by the original main administrator become invalid.
        if (Boolean.FALSE.equals(feature.getInvitable())) {
            TaskManager.me().execute(() -> iSpaceInviteLinkService.delNoPermitMemberLink(spaceId));
            TaskManager.me().execute(() -> iInvitationService.closeMemberInvitationBySpaceId(spaceId));
        }
    }

    @Override
    public void checkCanOperateSpaceUpdate(String spaceId) {
        boolean isBoundSocial = iSocialTenantBindService.getSpaceBindStatus(spaceId);
        ExceptionUtil.isFalse(isBoundSocial, NO_ALLOW_OPERATE);
    }

    @Override
    public void checkCanOperateSpaceUpdate(String spaceId, SpaceUpdateOperate spaceUpdateOperate) {
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (spaceUpdateOperate == null) {
            ExceptionUtil.isTrue(bindInfo == null, NO_ALLOW_OPERATE);
        }
        // filter dingtalk
        if (bindInfo != null && bindInfo.getAppId() != null) {
            SocialTenantEntity entity = iSocialTenantService.getByAppIdAndTenantId(bindInfo.getAppId(),
                    bindInfo.getTenantId());
            if (SocialPlatformType.DINGTALK.getValue().equals(entity.getPlatform()) && SocialAppType.ISV.equals(SocialAppType.of(entity.getAppType()))) {
                if (SpaceUpdateOperate.dingTalkIsvCanOperated(spaceUpdateOperate)) {
                    return;
                }
            }
            else if (SocialPlatformType.WECOM.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.getType() == entity.getAppType() &&
                    SpaceUpdateOperate.weComIsvCanOperated(spaceUpdateOperate)) {
                return;
            }
            else if (SocialPlatformType.FEISHU.getValue().equals(entity.getPlatform()) &&
                    SocialAppType.ISV.getType() == entity.getAppType() &&
                    SpaceUpdateOperate.larIsvCanOperated(spaceUpdateOperate)) {
                return;
            }
            if (spaceUpdateOperate == SpaceUpdateOperate.DELETE_SPACE) {
                // feishu space cannot be deleted
                ExceptionUtil.isFalse(SocialPlatformType.FEISHU.getValue().equals(entity.getPlatform())
                        && SocialAppType.ISV.equals(SocialAppType.of(entity.getAppType())), NO_ALLOW_OPERATE);
                ExceptionUtil.isFalse(entity.getStatus(), NO_ALLOW_OPERATE);
                return;
            }
        }
        ExceptionUtil.isTrue(bindInfo == null, NO_ALLOW_OPERATE);
    }

    @Override
    public void checkCanOperateSpaceUpdate(String spaceId, Long opMemberId, Long acceptMemberId, SpaceUpdateOperate[] spaceUpdateOperates) {
        log.info("check that user can operate space updates，space：{}，operation：{}", spaceId, spaceUpdateOperates);
        SpaceBindTenantInfoDTO spaceBindTenant = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, null, null);
        if (null == spaceBindTenant) {
            return;
        }
        ExceptionUtil.isFalse(ArrayUtil.isEmpty(spaceUpdateOperates), NO_ALLOW_OPERATE);
        ExceptionUtil.isTrue(spaceBindTenant.getStatus(), NO_ALLOW_OPERATE);
        // Dingtalk and feishu all allow to modify the master administrator
        if (SocialPlatformType.DINGTALK.getValue().equals(spaceBindTenant.getPlatform())
                || SocialPlatformType.FEISHU.getValue().equals(spaceBindTenant.getPlatform())) {
            return;
        }
        if (SocialPlatformType.WECOM.getValue().equals(spaceBindTenant.getPlatform()) &&
                ArrayUtil.contains(spaceUpdateOperates, SpaceUpdateOperate.UPDATE_MAIN_ADMIN)) {
            // Check whether the operation member has a visible area of wecom
            String opOpenId = iMemberService.getOpenIdByMemberId(opMemberId);
            String acceptOpenId = iMemberService.getOpenIdByMemberId(acceptMemberId);
            log.info("verify binding wecpm space「{}」，replace main administrator operation，original administrator：{}，change administrator：{}", spaceId, opMemberId, acceptMemberId);
            try {
                if (SocialAppType.ISV.getType() == spaceBindTenant.getAppType()) {
                    // The administrator authorization mode of the wecom  provider is only judged.
                    // because there is no visible scope for member authorization.
                    if (SocialTenantAuthMode.ADMIN.getValue() == spaceBindTenant.getAuthMode()) {
                        SocialTenantEntity socialTenantEntity = iSocialTenantService
                                .getByAppIdAndTenantId(spaceBindTenant.getAppId(), spaceBindTenant.getTenantId());
                        // If necessary, refresh access_token first
                        socialCpIsvService.refreshAccessToken(spaceBindTenant.getAppId(), spaceBindTenant.getTenantId(), socialTenantEntity.getPermanentCode());
                        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
                        Privilege privilege = agent.getPrivilege();
                        boolean isOpViewable = socialCpIsvService.judgeViewable(socialTenantEntity.getTenantId(), opOpenId, socialTenantEntity.getAppId(),
                                privilege.getAllowUsers(), privilege.getAllowParties(), privilege.getAllowTags());
                        if (!isOpViewable) {
                            throw new BusinessException(USER_NOT_VISIBLE_WECOM);
                        }
                        boolean isAcceptViewable = socialCpIsvService.judgeViewable(socialTenantEntity.getTenantId(), acceptOpenId, socialTenantEntity.getAppId(),
                                privilege.getAllowUsers(), privilege.getAllowParties(), privilege.getAllowTags());
                        if (!isAcceptViewable) {
                            throw new BusinessException(USER_NOT_VISIBLE_WECOM);
                        }
                    }
                }
                else {
                    iWeComService.getWeComUserByWeComUserId(spaceBindTenant.getTenantId(), Integer.valueOf(spaceBindTenant.getAppId()), opOpenId);
                    iWeComService.getWeComUserByWeComUserId(spaceBindTenant.getTenantId(), Integer.valueOf(spaceBindTenant.getAppId()), acceptOpenId);
                }
            }
            catch (BusinessException e) {
                if (e.getCode().equals(USER_NOT_EXIST.getCode())) {
                    throw new BusinessException(USER_NOT_VISIBLE_WECOM);
                }
                throw e;
            }
            catch (WxErrorException e) {
                throw new IllegalArgumentException(e);
            }
        }
        else {
            throw new BusinessException(NO_ALLOW_OPERATE);
        }
    }

    @Override
    public String getSpaceIdByLinkId(String linkId) {
        log.info("gets the space id of the association information，linkId：{}", linkId);
        if (linkId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // sharing node
            return iNodeShareSettingService.getSpaceId(linkId);
        }
        else {
            // template
            return iTemplateService.getSpaceId(linkId);
        }
    }

    @Override
    public Boolean isContactSyncing(String spaceId) {
        return StrUtil.isNotBlank(spaceId) && Boolean.TRUE.equals(redisTemplate.hasKey(RedisConstants.getSocialContactLockKey(spaceId)));
    }

    @Override
    public void setContactSyncing(String spaceId, String value) {
        // the label space is synchronizing the contact
        redisTemplate.opsForValue().set(RedisConstants.getSocialContactLockKey(spaceId), value, 3600, TimeUnit.SECONDS);
    }

    @Override
    public void contactFinished(String spaceId) {
        String contactLockKey = RedisConstants.getSocialContactLockKey(spaceId);
        // Contact processing completed, delete the previous lock
        if (Boolean.TRUE.equals(redisTemplate.hasKey(contactLockKey))) {
            redisTemplate.delete(contactLockKey);
        }
    }

    @Override
    public String getNameBySpaceId(String spaceId) {
        return baseMapper.selectSpaceNameBySpaceId(spaceId);
    }

    @Override
    public Long getSpaceOwnerUserId(String spaceId) {
        Long adminMemberId = baseMapper.selectSpaceMainAdmin(spaceId);
        if (adminMemberId != null) {
            return memberMapper.selectUserIdByMemberId(adminMemberId);
        }
        return null;
    }

    @Override
    public boolean isCertified(String spaceId) {
        SpaceGlobalFeature spaceGlobalFeature = getSpaceGlobalFeature(spaceId);
        return StrUtil.isNotBlank(spaceGlobalFeature.getCertification());
    }

    @Override
    public void switchSpace(Long userId, String spaceId) {
        // Prevents access to unjoined spaces
        userSpaceService.getMemberId(userId, spaceId);
        // The database saves the activation state
        iMemberService.updateActiveStatus(spaceId, userId);
        // Cache the space where the user's last action was active
        userActiveSpaceService.save(userId, spaceId);
    }

    @Override
    public void isSpaceAvailable(String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isTrue(null != entity && null == entity.getPreDeletionTime(), SPACE_NOT_EXIST);
    }

    private boolean checkSpaceNumber(Long userId) {
        log.info("Check whether the user reaches the upper limit");
        if (constProperties.getUserWhiteList().contains(userId.toString())) {
            return false;
        }
        int count = SqlTool.retCount(baseMapper.getAdminSpaceCount(userId));
        return count >= limitProperties.getSpaceMaxCount();
    }

    @Override
    public void checkUserInSpace(Long userId, String spaceId, Consumer<Boolean> consumer) {
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        boolean exist = ObjectUtil.isNotNull(memberId);
        consumer.accept(exist);
    }

}
