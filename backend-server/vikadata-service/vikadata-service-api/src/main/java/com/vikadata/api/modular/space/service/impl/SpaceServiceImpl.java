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

/**
 * <p>
 * 空间表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2019-10-07
 */
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
        log.info("创建工作空间");
        Long userId = user.getId();
        // 检查用户是否到达空间数量上限
        boolean limit = this.checkSpaceNumber(userId);
        ExceptionUtil.isFalse(limit, SpaceException.NUMBER_LIMIT);
        String spaceId = IdUtil.createSpaceId();
        memberMapper.updateInactiveStatusByUserId(userId);
        MemberEntity member = new MemberEntity();
        member.setSpaceId(spaceId);
        //同步用户信息
        member.setUserId(userId);
        member.setMemberName(user.getNickName());
        member.setMobile(user.getMobilePhone());
        member.setEmail(user.getEmail());
        member.setStatus(UserSpaceStatus.ACTIVE.getStatus());
        member.setIsAdmin(true);
        member.setIsActive(true);
        // 空间的创建者
        boolean addMember = iMemberService.save(member);
        ExceptionUtil.isTrue(addMember, CREATE_MEMBER_ERROR);
        // 创建组织单元
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
        // 新增根节点
        String rootNodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
                .spaceId(space.getSpaceId())
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType()).build());
        // 创建根部门
        Long rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
        iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);
        //创建根部门与成员绑定
        iTeamMemberRelService.addMemberTeams(Collections.singletonList(member.getId()), Collections.singletonList(rootTeamId));
        // 获取新空间默认引用模板的节点ID
        String templateNodeId = iTemplateService.getDefaultTemplateNodeId();
        if (StrUtil.isNotBlank(templateNodeId)) {
            // 转存节点方法，包含GRPC调用，放置最后
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
        // 创建根部门
        Long rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
        iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);

        return space;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSpace(Long userId, String spaceId, SpaceUpdateOpRo spaceOpRo) {
        log.info("编辑空间信息");
        SpaceEntity entity = this.getBySpaceId(spaceId);
        String spaceName = spaceOpRo.getName();
        // 修改空间名称
        this.updateSpaceName(userId, spaceId, spaceName, entity);
        // 修改空间Logo
        this.updateSpaceLogo(userId, spaceId, spaceOpRo.getLogo(), entity);
        // 删除缓存
        TaskManager.me().execute(() -> userSpaceService.delete(spaceId));
    }

    private void updateSpaceName(Long userId, String spaceId, String spaceName, SpaceEntity entity) {
        // 传入空间名称为空，或者同数据库的值一致，结束
        if (StrUtil.isBlank(spaceName) || spaceName.equals(entity.getName())) {
            return;
        }
        // 数据库变更
        SpaceEntity space = SpaceEntity.builder().id(entity.getId()).build();
        space.setName(spaceName);
        boolean flag = updateById(space);
        ExceptionUtil.isTrue(flag, SpaceException.UPDATE_SPACE_INFO_FAIL);
        // 根部门同步修改
        Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
        iTeamService.updateTeamName(rootTeamId, spaceName);
        // 发送修改名字通知
        NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_NAME_CHANGE, null, userId, spaceId, Dict.create().set(OLD_SPACE_NAME, entity.getName()).set(NEW_SPACE_NAME, spaceName));

        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_SPACE_NAME, entity.getName());
        info.set(AuditConstants.SPACE_NAME, spaceName);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.RENAME_SPACE).userId(userId).spaceId(spaceId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateSpaceLogo(Long userId, String spaceId, String spaceLogo, SpaceEntity entity) {
        // 传入空间Logo为空，或者同数据库的值一致，结束
        if (StrUtil.isBlank(spaceLogo) || spaceLogo.equals(entity.getLogo())) {
            return;
        }
        // 数据库变更
        SpaceEntity space = SpaceEntity.builder().id(entity.getId()).build();
        space.setLogo(spaceLogo);
        boolean flag = updateById(space);
        ExceptionUtil.isTrue(flag, SpaceException.UPDATE_SPACE_INFO_FAIL);

        // 删除云端原logo文件
        if (StrUtil.isNotBlank(entity.getLogo())) {
            TaskManager.me().execute(() -> iAssetService.delete(entity.getLogo()));
        }

        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_SPACE_LOGO, StrUtil.nullToEmpty(entity.getLogo()));
        info.set(AuditConstants.SPACE_LOGO, spaceLogo);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_SPACE_LOGO).userId(userId).spaceId(spaceId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    public void preDeleteById(Long userId, String spaceId) {
        log.info("预删除空间");
        boolean flag = SqlHelper.retBool(baseMapper.updatePreDeletionTimeBySpaceId(LocalDateTime.now(), spaceId, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // 除主管理员外，其他成员无法再进入该空间
        iMemberService.preDelBySpaceId(spaceId, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSpace(Long userId, List<String> spaceIds) {
        log.info("用户「{}」删除空间「{}」", userId, spaceIds);
        // 逻辑删除空间
        baseMapper.updateIsDeletedBySpaceIdIn(spaceIds);
        // 删除活跃空间缓存（空间预删除之后，仅有主管理的成员数据未逻辑删除，产品逻辑若有变化需把所有未逻辑删除的成员查询出来清除缓存）
        userActiveSpaceService.delete(userId);
        spaceIds.forEach(spaceId -> userSpaceService.delete(userId, spaceId));
        // 删除成员（必须在查询 userIds 之后）
        memberMapper.delBySpaceIds(spaceIds, null);
        // 删除空间站专属域名
        iSocialTenantDomainService.removeDomain(spaceIds);
    }

    @Override
    public void cancelDelByIds(Long userId, String spaceId) {
        log.info("撤销删除空间");
        boolean flag = SqlHelper.retBool(baseMapper.updatePreDeletionTimeBySpaceId(null, spaceId, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        //恢复其他成员
        memberMapper.cancelPreDelBySpaceId(spaceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void quit(String spaceId, Long memberId) {
        log.info("退出空间");
        //删除对应成员、组织和成员关系
        if (ObjectUtil.isNotNull(memberId)) {
            SpaceEntity entity = this.getBySpaceId(spaceId);
            // 主管理员不能直接退出
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
        // 获取空间站域名
        Map<String, String> spaceDomains = iSocialTenantDomainService.getSpaceDomainBySpaceIdsToMap(spaceIds);
        // 批量获取订阅
        Map<String, BillingPlanFeature> spacePlanFeatureMap = iSpaceSubscriptionService.getSubscriptionFeatureBySpaceIds(spaceIds);
        // 设置信息
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
        // 人数统计
        long memberNumber = iStaticsService.getMemberTotalCountBySpaceId(spaceId);
        // 部门数量统计
        long teamCount = iStaticsService.getTeamTotalCountBySpaceId(spaceId);
        // 管理员数量
        long adminCount = iStaticsService.getAdminTotalCountBySpaceId(spaceId);
        // 总记录数统计
        long recordCount = iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        // 已用空间统计
        long capacityUsedSize = spaceCapacityCacheService.getSpaceCapacity(spaceId);
        // API用量统计
        long apiUsage = iStaticsService.getCurrentMonthApiUsage(spaceId);
        // 字段权限设置数量
        ControlStaticsVO controlStaticsVO = iStaticsService.getFieldRoleTotalCountBySpaceId(spaceId);
        long nodeRoleNums = controlStaticsVO != null ? controlStaticsVO.getNodeRoleCount() : 0L;
        long fieldRoleNums = controlStaticsVO != null ? controlStaticsVO.getFieldRoleCount() : 0L;
        // 节点统计
        List<NodeTypeStatics> nodeTypeStatics = iStaticsService.getNodeTypeStaticsBySpaceId(spaceId);
        long sheetNums = nodeTypeStatics.stream()
                .filter(condition -> NodeType.toEnum(condition.getType()).isFileNode())
                .mapToLong(NodeTypeStatics::getTotal).sum();
        Map<Integer, Integer> typeStaticsMap = nodeTypeStatics.stream().collect(Collectors.toMap(NodeTypeStatics::getType, NodeTypeStatics::getTotal));
        long formViewNums = typeStaticsMap.containsKey(NodeType.FORM.getNodeType()) ? typeStaticsMap.get(NodeType.FORM.getNodeType()) : 0L;
        // 表格视图统计
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
                .build();
        // 空间附件容量用量信息
        SpaceCapacityUsedInfo spaceCapacityUsedInfo = this.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        vo.setCurrentBundleCapacityUsedSizes(spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes());
        vo.setGiftCapacityUsedSizes(spaceCapacityUsedInfo.getGiftCapacityUsedSizes());
        // 拥有者信息
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
        // 获取第三方信息
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
                    // 是否正在同步通讯录
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
        // 空间订阅计划附件容量
        Long currentBundleCapacity = iSpaceSubscriptionService.getSpaceSubscription(spaceId).getSubscriptionCapacity();
        // 如果已使用附件容量小于空间订阅计划容量，那么当前已用附件容量即为当前套餐已用容量
        if (capacityUsedSize <= currentBundleCapacity) {
            spaceCapacityUsedInfo.setCurrentBundleCapacityUsedSizes(capacityUsedSize);
            // 因为优先使用套餐容量的缘故，所以已使用赠送附件容量为0
            spaceCapacityUsedInfo.setGiftCapacityUsedSizes(0L);
        }
        else {
            spaceCapacityUsedInfo.setCurrentBundleCapacityUsedSizes(currentBundleCapacity);
            // 赠送的附件容量
            Long giftCapacity = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(spaceId);
            // 如果附件容量使用超量，已用赠送附件容量等于赠送的附件容量大小
            if (capacityUsedSize > currentBundleCapacity + giftCapacity) {
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(giftCapacity);
            }
            else {
                // 未超量情况
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(capacityUsedSize - currentBundleCapacity);
            }
        }
        return spaceCapacityUsedInfo;
    }

    @Override
    public InternalSpaceUsageVo getInternalSpaceUsageVo(String spaceId) {
        log.info("获取空间「{}」的用量信息", spaceId);
        InternalSpaceUsageVo vo = new InternalSpaceUsageVo();
        // 总记录数统计
        long recordNums = iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        vo.setRecordNums(recordNums);
        // 表格视图统计
        DatasheetStaticsVO viewVO = iStaticsService.getDatasheetStaticsBySpaceId(spaceId);
        vo.setGalleryViewNums(viewVO.getGalleryViews());
        vo.setKanbanViewNums(viewVO.getKanbanViews());
        vo.setGanttViewNums(viewVO.getGanttViews());
        vo.setCalendarViewNums(viewVO.getCalendarViews());
        return vo;
    }

    @Override
    public InternalSpaceCapacityVo getSpaceCapacityVo(String spaceId) {
        log.info("获取空间的附件容量信息");
        // 已用空间统计
        Long usedCapacity = spaceCapacityCacheService.getSpaceCapacity(spaceId);
        // 空间订阅计划附件容量
        Long currentBundleCapacity = iSpaceSubscriptionService.getPlanMaxCapacity(spaceId);
        // 赠送的附件容量
        Long unExpireGiftCapacity = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(spaceId);
        // 空间附件总容量
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
        log.info("更换主管理员");
        // 校验新的成员
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        ExceptionUtil.isNotNull(userId, NOT_EXIST_MEMBER);
        // 检查新主管理员对应的用户，是否到达空间数量上限
        boolean limit = this.checkSpaceNumber(userId);
        ExceptionUtil.isFalse(limit, SpaceException.USER_ADMIN_SPACE_LIMIT);
        //获取主管理员信息
        SpaceAdminInfoDto dto = baseMapper.selectAdminInfoDto(spaceId);
        ExceptionUtil.isNotNull(dto, SPACE_NOT_EXIST);
        ExceptionUtil.isFalse(dto.getMemberId().equals(memberId), TRANSFER_SELF);
        if (dto.getMobile() != null) {
            // 校验是否已通过短信验证码
            ValidateTarget target = ValidateTarget.create(dto.getMobile(), dto.getAreaCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).verifyIsPass(target.getRealTarget());
        }
        else if (dto.getEmail() != null) {
            // 校验是否已通过邮件验证码
            ValidateTarget target = ValidateTarget.create(dto.getEmail());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).verifyIsPass(target.getRealTarget());
        }
        // 更新空间、成员信息
        boolean flag = SqlHelper.retBool(baseMapper.updateSpaceOwnerId(spaceId, memberId, SessionContext.getUserId()));
        ExceptionUtil.isTrue(flag, SET_MAIN_ADMIN_FAIL);
        iMemberService.cancelMemberMainAdmin(dto.getMemberId());
        iMemberService.setMemberMainAdmin(memberId);
        // 若新管理员原本是子管理员，删除原权限
        int count = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId));
        if (count > 0) {
            iSpaceRoleService.deleteRole(spaceId, memberId);
        }
        MemberEntity newMember = memberMapper.selectById(memberId);
        // 给新的主管理员发送邮箱通知
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
        log.info("检查指定成员是否主管理员");
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean isMainAdmin = owner != null && owner.equals(memberId);
        ExceptionUtil.isFalse(isMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    @Override
    public void checkMembersIsMainAdmin(String spaceId, List<Long> memberIds) {
        log.info("批量检查指定成员是否主管理员");
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean haveMainAdmin = CollUtil.contains(memberIds, owner);
        ExceptionUtil.isFalse(haveMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    @Override
    public void checkMemberInSpace(String spaceId, Long memberId) {
        log.info("检查指定成员是否在空间内");
        MemberEntity member = memberMapper.selectMemberIdAndSpaceId(spaceId, memberId);
        ExceptionUtil.isNotNull(member, MEMBER_NOT_IN_SPACE);
    }

    @Override
    public void checkMembersInSpace(String spaceId, List<Long> memberIds) {
        log.info("批量检查指定成员是否在空间内");
        int count = SqlTool.retCount(memberMapper.selectCountByMemberIds(memberIds));
        ExceptionUtil.isTrue(count == memberIds.size(), MEMBER_NOT_IN_SPACE);
    }

    @Override
    public UserSpaceVo getUserSpaceResource(Long userId, String spaceId) {
        log.info("获取空间资源权限");
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
        log.info("获取空间全局属性，spaceId:{}", spaceId);
        String props = baseMapper.selectPropsBySpaceId(spaceId);
        ExceptionUtil.isNotNull(props, SpaceException.SPACE_NOT_EXIST);

        return JSONUtil.toBean(props, SpaceGlobalFeature.class);
    }

    @Override
    public void switchSpacePros(Long userId, String spaceId, SpaceGlobalFeature feature) {
        log.info("切换空间属性状态，userId:{},spaceId:{}", userId, spaceId);
        JSONObject json = JSONUtil.parseObj(feature);
        if (json.size() == 0) {
            return;
        }
        List<MapDTO> features = new ArrayList<>(json.size());
        for (Entry<String, Object> entry : json.entrySet()) {
            log.info("切换属性状态，key:{},value:{}", entry.getKey(), entry.getValue());
            features.add(new MapDTO(entry.getKey(), entry.getValue()));
        }
        boolean flag = SqlHelper.retBool(baseMapper.updateProps(userId, spaceId, features));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 关闭邀请成员开关后，没有成员管理权限的成员，生成的空间公开邀请链接均失效
        if (Boolean.FALSE.equals(feature.getInvitable())) {
            TaskManager.me().execute(() -> iSpaceInviteLinkService.delNoPermitMemberLink(spaceId));
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
        // 过滤钉钉第三方集成
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
                // 飞书第三方不允许删除空间站
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
        log.info("检查可以操作空间更新，空间站：{}，操作：{}", spaceId, spaceUpdateOperates);
        SpaceBindTenantInfoDTO spaceBindTenant = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, null, null);
        if (null == spaceBindTenant) {
            return;
        }
        ExceptionUtil.isFalse(ArrayUtil.isEmpty(spaceUpdateOperates), NO_ALLOW_OPERATE);
        ExceptionUtil.isTrue(spaceBindTenant.getStatus(), NO_ALLOW_OPERATE);
        // 钉钉isv和自建都允许修改主管理员
        if (SocialPlatformType.DINGTALK.getValue().equals(spaceBindTenant.getPlatform())
                || SocialPlatformType.FEISHU.getValue().equals(spaceBindTenant.getPlatform())) {
            return;
        }
        if (SocialPlatformType.WECOM.getValue().equals(spaceBindTenant.getPlatform()) &&
                ArrayUtil.contains(spaceUpdateOperates, SpaceUpdateOperate.UPDATE_MAIN_ADMIN)) {
            // 检查操作成员是否存在企业微信可见区域
            String opOpenId = iMemberService.getOpenIdByMemberId(opMemberId);
            String acceptOpenId = iMemberService.getOpenIdByMemberId(acceptMemberId);
            log.info("校验绑定企业微信空间站「{}」，更换主管理员操作，原主管理员：{}，申请变更主管理员：{}", spaceId, opMemberId, acceptMemberId);
            try {
                if (SocialAppType.ISV.getType() == spaceBindTenant.getAppType()) {
                    // 企业微信服务商管理员授权模式才判断，因为成员授权没有可见范围
                    if (SocialTenantAuthMode.ADMIN.getValue() == spaceBindTenant.getAuthMode()) {
                        SocialTenantEntity socialTenantEntity = iSocialTenantService
                                .getByAppIdAndTenantId(spaceBindTenant.getAppId(), spaceBindTenant.getTenantId());
                        // 如果需要，先刷新 access_token
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
        log.info("获取关联信息的空间ID，linkId：{}", linkId);
        if (linkId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // 节点分享
            return iNodeShareSettingService.getSpaceId(linkId);
        }
        else {
            // 模板
            return iTemplateService.getSpaceId(linkId);
        }
    }

    @Override
    public Boolean isContactSyncing(String spaceId) {
        return StrUtil.isNotBlank(spaceId) && Boolean.TRUE.equals(redisTemplate.hasKey(RedisConstants.getSocialContactLockKey(spaceId)));
    }

    @Override
    public void setContactSyncing(String spaceId, String value) {
        // 标记空间正在同步空间站通讯录
        redisTemplate.opsForValue().set(RedisConstants.getSocialContactLockKey(spaceId), value, 3600, TimeUnit.SECONDS);
    }

    @Override
    public void contactFinished(String spaceId) {
        String contactLockKey = RedisConstants.getSocialContactLockKey(spaceId);
        // 处理通讯录完成，将之前的锁删掉
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
        // 防止访问未加入的空间
        userSpaceService.getMemberId(userId, spaceId);
        // 数据库保存激活状态
        iMemberService.updateActiveStatus(spaceId, userId);
        // 缓存用户最后操作激活的空间
        userActiveSpaceService.save(userId, spaceId);
    }

    private boolean checkSpaceNumber(Long userId) {
        log.info("检查用户是否到达空间数量上限");
        if (constProperties.getUserWhiteList().contains(userId.toString())) {
            return false;
        }
        int count = SqlTool.retCount(baseMapper.getAdminSpaceCount(userId));
        return count >= limitProperties.getSpaceMaxCount();
    }
}
