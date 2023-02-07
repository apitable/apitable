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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.asset.service.IAssetService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.internal.vo.InternalSpaceCapacityVo;
import com.apitable.internal.vo.InternalSpaceUsageVo;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.enums.UserSpaceStatus;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.captcha.ValidateCodeProcessorManage;
import com.apitable.shared.captcha.ValidateCodeType;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.constants.MailPropConstants;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.IdUtil;
import com.apitable.space.assembler.SpaceAssembler;
import com.apitable.space.assembler.SubscribeAssembler;
import com.apitable.space.dto.ControlStaticsDTO;
import com.apitable.space.dto.DatasheetStaticsDTO;
import com.apitable.space.dto.GetSpaceListFilterCondition;
import com.apitable.space.dto.MapDTO;
import com.apitable.space.dto.NodeTypeStaticsDTO;
import com.apitable.space.dto.SpaceAdminInfoDTO;
import com.apitable.space.dto.SpaceCapacityUsedInfo;
import com.apitable.space.dto.SpaceDTO;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.enums.SpaceResourceGroupCode;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.mapper.SpaceMemberRoleRelMapper;
import com.apitable.space.ro.SpaceUpdateOpRo;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.service.IStaticsService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.space.vo.SpaceInfoVO;
import com.apitable.space.vo.SpaceSocialConfig;
import com.apitable.space.vo.SpaceSubscribeVo;
import com.apitable.space.vo.SpaceVO;
import com.apitable.space.vo.UserSpaceVo;
import com.apitable.template.service.ITemplateService;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareSettingService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.apitable.organization.enums.OrganizationException.CREATE_MEMBER_ERROR;
import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.apitable.shared.constants.NotificationConstants.NEW_SPACE_NAME;
import static com.apitable.shared.constants.NotificationConstants.OLD_SPACE_NAME;
import static com.apitable.space.enums.SpaceException.NO_ALLOW_OPERATE;
import static com.apitable.space.enums.SpaceException.SPACE_NOT_EXIST;
import static com.apitable.space.enums.SpaceException.SPACE_QUIT_FAILURE;
import static com.apitable.workspace.enums.PermissionException.CAN_OP_MAIN_ADMIN;
import static com.apitable.workspace.enums.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.apitable.workspace.enums.PermissionException.SET_MAIN_ADMIN_FAIL;
import static com.apitable.workspace.enums.PermissionException.TRANSFER_SELF;

/**
 * Space Service Implement Class.
 *
 * @author Chambers
 */
@Slf4j
@Service
public class SpaceServiceImpl extends ServiceImpl<SpaceMapper, SpaceEntity>
        implements ISpaceService {

    /** */
    private static final int DELETE_SPACE_RETAIN_DAYS = 7;


    /** */
    @Resource
    private IUserService userService;

    /** */
    @Resource
    private INodeService iNodeService;

    /** */
    @Resource
    private IMemberService iMemberService;

    /** */
    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    /** */
    @Resource
    private UserActiveSpaceCacheService userActiveSpaceCacheService;

    /** */
    @Resource
    private ITeamService iTeamService;

    /** */
    @Resource
    private TeamMapper teamMapper;

    /** */
    @Resource
    private MemberMapper memberMapper;

    /** */
    @Resource
    private IAssetService iAssetService;

    /** */
    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    /** */
    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    /** */
    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    /** */
    @Resource
    private ISpaceRoleService iSpaceRoleService;

    /** */
    @Resource
    private SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    /** */
    @Resource
    private IUnitService iUnitService;

    /** */
    @Resource
    private ConstProperties constProperties;

    /** */
    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    /** */
    @Resource
    private ITemplateService iTemplateService;

    /** */
    @Resource
    private IStaticsService iStaticsService;

    /** */
    @Resource
    private SocialServiceFacade socialServiceFacade;

    /** */
    @Resource
    private INodeShareSettingService iNodeShareSettingService;

    /** */
    @Resource
    private LimitProperties limitProperties;

    /** */
    @Resource
    private IInvitationService iInvitationService;

    /**
     * getBySpaceId.
     *
     * @param spaceId space id
     * @return SpaceEntity
     */
    @Override
    public SpaceEntity getBySpaceId(final String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(entity, SPACE_NOT_EXIST);
        return entity;
    }

    /**
     * Check Exist.
     *
     * @param spaceId space id
     */
    @Override
    public void checkExist(final String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(entity, SPACE_NOT_EXIST);
    }

    /**
     * getBySpaceIdIgnoreDeleted.
     *
     * @param spaceId space id
     * @return SpaceEntity
     */
    @Override
    public SpaceEntity getBySpaceIdIgnoreDeleted(final String spaceId) {
        return getBaseMapper().selectBySpaceIdIgnoreDeleted(spaceId);
    }

    /**
     * getBySpaceIds.
     *
     * @param spaceIds space ids
     * @return List<SpaceEntity>
     */
    @Override
    public List<SpaceEntity> getBySpaceIds(final List<String> spaceIds) {
        return baseMapper.selectBySpaceIds(spaceIds);
    }

    /**
     * Create Space.
     *
     * @param user    user
     * @param spaceName spaceName
     * @return SpaceId
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createSpace(final UserEntity user, final String spaceName) {
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
        String props = JSONUtil.parseObj(
                SpaceGlobalFeature.builder().fileSharable(true).invitable(true)
                        .joinable(false).nodeExportable(true)
                        .allowCopyDataToExternal(true)
                        .allowDownloadAttachment(true).mobileShowable(false)
                        .watermarkEnable(false).build()).toString();
        SpaceEntity space =
                SpaceEntity.builder().spaceId(spaceId).name(spaceName)
                        .owner(member.getId()).creator(member.getId())
                        .props(props).createdBy(userId).updatedBy(userId)
                        .build();
        boolean addSpace = save(space);
        ExceptionUtil.isTrue(addSpace, SpaceException.CREATE_SPACE_ERROR);
        // add root node
        String rootNodeId = iNodeService.createChildNode(userId,
                CreateNodeDto.builder().spaceId(space.getSpaceId())
                        .newNodeId(IdUtil.createNodeId())
                        .type(NodeType.ROOT.getNodeType()).build());
        // create root department
        Long rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
        iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);
        //  create root department and member binding
        iTeamMemberRelService.addMemberTeams(
                Collections.singletonList(member.getId()),
                Collections.singletonList(rootTeamId));
        // gets the node id of the default reference template for the new space.
        String templateNodeId = iTemplateService.getDefaultTemplateNodeId();
        if (StrUtil.isNotBlank(templateNodeId)) {
            // the dump node method, contains grpc calls, placing the last.
            iNodeService.copyNodeToSpace(userId, spaceId, rootNodeId,
                    templateNodeId, NodeCopyOptions.create());
        }
        return spaceId;
    }

    /**
     * Update Space.
     *
     * @param userId userId
     * @param spaceId space id
     * @param spaceOpRo SpaceUpdateOpRo
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSpace(final Long userId, final String spaceId,
                            final SpaceUpdateOpRo spaceOpRo) {
        log.info("edit space information");
        SpaceEntity entity = this.getBySpaceId(spaceId);
        String spaceName = spaceOpRo.getName();
        // modify space name
        this.updateSpaceName(userId, spaceId, spaceName, entity);
        // modify spatial logo
        this.updateSpaceLogo(userId, spaceId, spaceOpRo.getLogo(), entity);
        // delete cache
        TaskManager.me().execute(() -> userSpaceCacheService.delete(spaceId));
    }

    private void updateSpaceName(
            final Long userId,
            final String spaceId,
            final String spaceName,
            final SpaceEntity entity
    ) {
        // The name of the incoming space is empty or the same as the value
        // of the database.
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
        NotificationManager.me()
                .playerNotify(NotificationTemplateId.SPACE_NAME_CHANGE, null,
                        userId, spaceId,
                        Dict.create().set(OLD_SPACE_NAME, entity.getName())
                                .set(NEW_SPACE_NAME, spaceName));

        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_SPACE_NAME, entity.getName());
        info.set(AuditConstants.SPACE_NAME, spaceName);
        AuditSpaceArg arg =
                AuditSpaceArg.builder().action(AuditSpaceAction.RENAME_SPACE)
                        .userId(userId).spaceId(spaceId).info(info).build();
        SpringContextHolder.getApplicationContext()
                .publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateSpaceLogo(
            final Long userId,
            final String spaceId,
            final String spaceLogo,
            final SpaceEntity entity
    ) {
        // The incoming space Logo is empty or the same as the database value
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
            TaskManager.me()
                    .execute(() -> iAssetService.delete(entity.getLogo()));
        }

        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_SPACE_LOGO,
                StrUtil.nullToEmpty(entity.getLogo()));
        info.set(AuditConstants.SPACE_LOGO, spaceLogo);
        AuditSpaceArg arg = AuditSpaceArg.builder()
                .action(AuditSpaceAction.UPDATE_SPACE_LOGO).userId(userId)
                .spaceId(spaceId).info(info).build();
        SpringContextHolder.getApplicationContext()
                .publishEvent(new AuditSpaceEvent(this, arg));
    }

    /**
     * preDeleteById.
     *
     * @param userId userId
     * @param spaceId space id
     */
    @Override
    public void preDeleteById(final Long userId, final String spaceId) {
        log.info("pre delete space");
        boolean flag = SqlHelper.retBool(
                baseMapper.updatePreDeletionTimeBySpaceId(LocalDateTime.now(),
                        spaceId, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // Except for the main administrator, other members can no longer
        // enter the space
        iMemberService.preDelBySpaceId(spaceId, userId);
    }

    /**
     * Delete Space.
     *
     * @param userId   userId
     * @param spaceIds space ids
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSpace(final Long userId, final List<String> spaceIds) {
        log.info("user「{}」delete space「{}」", userId, spaceIds);
        // logical delete space
        baseMapper.updateIsDeletedBySpaceIdIn(spaceIds);
        // delete active space cache
        // After the space is pre-deleted, only the member data of the master
        // management is not logically deleted.
        // If the product logic changes, all members that have not been
        // logically deleted need to be queried to clear the cache
        userActiveSpaceCacheService.delete(userId);
        spaceIds.forEach(
                spaceId -> userSpaceCacheService.delete(userId, spaceId));
        // delete member（must be after deleting user）
        memberMapper.delBySpaceIds(spaceIds, null);
        // delete space exclusive domain name
        socialServiceFacade.removeDomainBySpaceIds(spaceIds);
    }

    /**
     * Cancel Del By Ids.
     *
     * @param userId userId
     * @param spaceId space id
     */
    @Override
    public void cancelDelByIds(final Long userId, final String spaceId) {
        log.info("undo delete space");
        boolean flag = SqlHelper.retBool(
                baseMapper.updatePreDeletionTimeBySpaceId(null, spaceId,
                        userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        //restore other members
        memberMapper.cancelPreDelBySpaceId(spaceId);
    }

    /**
     * Quit Space.
     *
     * @param spaceId space id
     * @param memberId memberId
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void quit(final String spaceId, final Long memberId) {
        log.info("quit space.");
        // Delete corresponding members, the organizations and member
        // relationships
        if (ObjectUtil.isNotNull(memberId)) {
            SpaceEntity entity = this.getBySpaceId(spaceId);
            // the main administrator cannot exit directly
            ExceptionUtil.isFalse(entity.getOwner().equals(memberId),
                    SPACE_QUIT_FAILURE);
            iMemberService.batchDeleteMemberFromSpace(spaceId,
                    Collections.singletonList(memberId), false);
        }
    }

    /**
     * Get Space List By User Id.
     *
     * @param userId userId
     * @param condition query condition
     * @return List<SpaceVO>
     */
    @Override
    public List<SpaceVO> getSpaceListByUserId(
        final Long userId,
        final GetSpaceListFilterCondition condition
    ) {
        List<SpaceDTO> spaceDTOList = baseMapper.selectListByUserId(userId);
        if (CollUtil.isEmpty(spaceDTOList)) {
            return Collections.emptyList();
        }
        if (condition != null
            && BooleanUtil.isTrue(condition.getManageable())) {
            spaceDTOList = spaceDTOList.stream()
                    .filter(SpaceDTO::getAdmin)
                    .collect(Collectors.toList());
        }
        if (CollUtil.isEmpty(spaceDTOList)) {
            return Collections.emptyList();
        }
        List<String> spaceIds = spaceDTOList.stream().map(SpaceDTO::getSpaceId)
            .collect(Collectors.toList());
        // get space domains
        Map<String, String> spaceDomains =
            socialServiceFacade.getDomainNameMap(spaceIds);
        // batch query subscriptions
        Map<String, SubscriptionFeature> spacePlanFeatureMap =
            entitlementServiceFacade.getSpaceSubscriptions(spaceIds);
        // setting information
        List<SpaceVO> resultList = new ArrayList<>();
        for (SpaceDTO spaceDTO : spaceDTOList) {
            String spaceId = spaceDTO.getSpaceId();
            SpaceVO spaceVO = SpaceAssembler.toVO(spaceDTO);
            SocialConnectInfo socialConnectInfo =
                socialServiceFacade.getConnectInfo(spaceId);
            SpaceSocialConfig socialConfig =
                SpaceAssembler.toSocialConfig(socialConnectInfo);
            spaceVO.setSocial(socialConfig);
            if (spacePlanFeatureMap.containsKey(spaceId)) {
                SubscriptionFeature planFeature =
                    spacePlanFeatureMap.get(spaceId);
                spaceVO.setMaxSeat(planFeature.getSeat().getValue());
                spaceVO.setSpaceDomain(spaceDomains.get(spaceId));
            }
            resultList.add(spaceVO);
        }
        return resultList;
    }

    /**
     * Get Space Info.
     *
     * @param spaceId space id
     * @return SpaceInfoVO
     */
    @Override
    public SpaceInfoVO getSpaceInfo(final String spaceId) {
        SpaceEntity entity = getBySpaceId(spaceId);
        // numbers statistics
        long memberNumber =
                iStaticsService.getMemberTotalCountBySpaceId(spaceId);
        // teams statistics
        long teamCount = iStaticsService.getTeamTotalCountBySpaceId(spaceId);
        // admin statistics
        long adminCount = iStaticsService.getAdminTotalCountBySpaceId(spaceId);
        // record statistics
        long recordCount =
                iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        // used space statistics
        long capacityUsedSize =
                spaceCapacityCacheService.getSpaceCapacity(spaceId);
        // API usage statistics
        long apiUsage = iStaticsService.getCurrentMonthApiUsage(spaceId);
        // file control amount
        ControlStaticsDTO controlStaticsDTO =
                iStaticsService.getFieldRoleTotalCountBySpaceId(spaceId);
        long nodeRoleNums = controlStaticsDTO != null
            ? controlStaticsDTO.getNodeRoleCount() : 0L;
        long fieldRoleNums = controlStaticsDTO != null
            ? controlStaticsDTO.getFieldRoleCount() : 0L;
        // node statistics
        List<NodeTypeStaticsDTO> nodeTypeStaticDTOS =
                iStaticsService.getNodeTypeStaticsBySpaceId(spaceId);
        long sheetNums = nodeTypeStaticDTOS.stream()
                .filter(condition -> NodeType.toEnum(condition.getType())
                        .isFileNode()).mapToLong(NodeTypeStaticsDTO::getTotal)
                .sum();
        long mirrorNums = nodeTypeStaticDTOS.stream()
                .filter(condition ->
                    NodeType.MIRROR == NodeType.toEnum(condition.getType()))
                .mapToLong(NodeTypeStaticsDTO::getTotal).sum();

        Map<Integer, Integer> typeStaticsMap = nodeTypeStaticDTOS.stream()
                .collect(Collectors.toMap(NodeTypeStaticsDTO::getType,
                        NodeTypeStaticsDTO::getTotal));
        long formViewNums =
            typeStaticsMap.containsKey(NodeType.FORM.getNodeType())
                    ? typeStaticsMap.get(NodeType.FORM.getNodeType()) : 0L;
        // table view statistics
        DatasheetStaticsDTO viewVO =
                iStaticsService.getDatasheetStaticsBySpaceId(spaceId);
        SpaceInfoVO vo = SpaceInfoVO.builder().spaceName(entity.getName())
                .spaceLogo(entity.getLogo()).createTime(entity.getCreatedAt())
                .deptNumber(teamCount).seats(memberNumber).sheetNums(sheetNums)
                .recordNums(recordCount).adminNums(adminCount)
                .apiRequestCountUsage(apiUsage)
                .capacityUsedSizes(capacityUsedSize).nodeRoleNums(nodeRoleNums)
                .fieldRoleNums(fieldRoleNums).formViewNums(formViewNums)
                .kanbanViewNums(viewVO.getKanbanViews())
                .calendarViewNums(viewVO.getCalendarViews())
                .galleryViewNums(viewVO.getGalleryViews())
                .ganttViewNums(viewVO.getGanttViews()).mirrorNums(mirrorNums)
                .build();
        // space attachment capacity usage information
        SpaceCapacityUsedInfo spaceCapacityUsedInfo =
                this.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        vo.setCurrentBundleCapacityUsedSizes(
                spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes());
        vo.setGiftCapacityUsedSizes(
                spaceCapacityUsedInfo.getGiftCapacityUsedSizes());
        // owner info
        this.appendOwnerInfo(vo, entity);
        if (ObjectUtil.isNotNull(entity.getPreDeletionTime())) {
            vo.setDelTime(entity.getPreDeletionTime()
                    .plusDays(DELETE_SPACE_RETAIN_DAYS));
        }
        // obtain third party information
        SocialConnectInfo socialConnectInfo =
                socialServiceFacade.getConnectInfo(spaceId);
        SpaceSocialConfig bindInfo = new SpaceSocialConfig();
        if (ObjectUtil.isNotNull(socialConnectInfo)) {
            if (socialConnectInfo.isEnabled()) {
                bindInfo.setEnabled(true);
                bindInfo.setPlatform(socialConnectInfo.getPlatform());
                bindInfo.setAppType(socialConnectInfo.getAppType());
                bindInfo.setAuthMode(socialConnectInfo.getAuthMode());
                // is it synchronizing the contact
                bindInfo.setContactSyncing(socialConnectInfo.contactSyncing());
            }
        }
        vo.setSocial(bindInfo);

        return vo;
    }

    private void appendOwnerInfo(final SpaceInfoVO vo,
                                 final SpaceEntity entity) {
        if (entity.getOwner() == null) {
            return;
        }
        MemberDTO ownerMember =
                memberMapper.selectDtoByMemberId(entity.getOwner());
        if (ownerMember == null) {
            return;
        }
        vo.setOwnerName(ownerMember.getMemberName());
        vo.setOwnerAvatar(ownerMember.getAvatar());
        vo.setIsOwnerNameModified(ownerMember.getIsSocialNameModified() > 0);
        if (entity.getCreator() == null) {
            return;
        }
        if (entity.getCreator().equals(ownerMember.getId())) {
            vo.setCreatorName(ownerMember.getMemberName());
            vo.setCreatorAvatar(ownerMember.getAvatar());
            vo.setIsCreatorNameModified(
                    ownerMember.getIsSocialNameModified() > 0);
            return;
        }
        MemberDTO creatorMember =
                memberMapper.selectDtoByMemberId(entity.getCreator());
        if (creatorMember == null) {
            return;
        }
        vo.setCreatorName(creatorMember.getMemberName());
        vo.setCreatorAvatar(creatorMember.getAvatar());
        vo.setIsCreatorNameModified(
                creatorMember.getIsSocialNameModified() > 0);
    }

    /**
     * Get Space Capacity Used Info.
     *
     * @param spaceId          space id
     * @param capacityUsedSize space capacity used sizes
     * @return SpaceCapacityUsedInfo
     */
    @Override
    public SpaceCapacityUsedInfo getSpaceCapacityUsedInfo(
            final String spaceId,
            final Long capacityUsedSize
    ) {
        SpaceCapacityUsedInfo spaceCapacityUsedInfo =
                new SpaceCapacityUsedInfo();
        // space subscription plan attachment capacity
        SubscriptionInfo subscriptionInfo =
                entitlementServiceFacade.getSpaceSubscription(spaceId);
        // Plan total capacity except gift capacity
        Long planCapacity = subscriptionInfo.getTotalCapacity().getValue()
            - subscriptionInfo.getGiftCapacity().getValue();
        // If the used attachment capacity is less than
        // the space subscription plan capacity,
        // the current used attachment capacity
        // is the current package used capacity.
        if (capacityUsedSize <= planCapacity) {
            spaceCapacityUsedInfo.setCurrentBundleCapacityUsedSizes(
                    capacityUsedSize);
            // Because the package capacity is preferred,
            // the complimentary attachment capacity has been used to be 0.
            spaceCapacityUsedInfo.setGiftCapacityUsedSizes(0L);
        } else {
            spaceCapacityUsedInfo
                .setCurrentBundleCapacityUsedSizes(planCapacity);
            // complimentary attachment capacity
            Long giftCapacity = subscriptionInfo.getGiftCapacity().getValue();
            // If the attachment capacity is used in excess,
            // the used complimentary attachment capacity is equal to
            // the size of the complimentary assert capacity.
            if (capacityUsedSize
                > subscriptionInfo.getTotalCapacity().getValue()) {
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(giftCapacity);
            } else {
                // gift capacity used left
                long usedSizes = capacityUsedSize - planCapacity;
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(usedSizes);
            }
        }
        return spaceCapacityUsedInfo;
    }

    /**
     * Get Internal Space Usage View.
     *
     * @param spaceId space id
     * @return InternalSpaceUsageVo
     */
    @Override
    public InternalSpaceUsageVo getInternalSpaceUsageVo(final String spaceId) {
        log.info("Get the usage information of the space {}", spaceId);
        InternalSpaceUsageVo vo = new InternalSpaceUsageVo();
        // statistics of total records
        long recordNums =
                iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        vo.setRecordNums(recordNums);
        // table view statistics
        DatasheetStaticsDTO viewVO =
                iStaticsService.getDatasheetStaticsBySpaceId(spaceId);
        vo.setGalleryViewNums(viewVO.getGalleryViews());
        vo.setKanbanViewNums(viewVO.getKanbanViews());
        vo.setGanttViewNums(viewVO.getGanttViews());
        vo.setCalendarViewNums(viewVO.getCalendarViews());
        return vo;
    }

    /**
     * Get Space Capacity View.
     *
     * @param spaceId space id
     * @return InternalSpaceCapacityVo
     */
    @Override
    public InternalSpaceCapacityVo getSpaceCapacityVo(final String spaceId) {
        log.info("Obtain the capacity information of the space");
        // used space statistics
        Long usedCapacity = spaceCapacityCacheService.getSpaceCapacity(spaceId);
        // space subscription plan attachment capacity
        SubscriptionInfo subscriptionInfo =
                entitlementServiceFacade.getSpaceSubscription(spaceId);
        Long totalCapacity = subscriptionInfo.getTotalCapacity().getValue();
        // complimentary attachment capacity
        Long unExpireGiftCapacity =
                subscriptionInfo.getGiftCapacity().getValue();
        return InternalSpaceCapacityVo.builder().usedCapacity(usedCapacity)
                .currentBundleCapacity(totalCapacity)
                .unExpireGiftCapacity(unExpireGiftCapacity)
                .totalCapacity(totalCapacity).build();
    }

    /**
     * Change Main Admin.
     *
     * @param spaceId  space id
     * @param memberId memberId
     * @return UserId
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long changeMainAdmin(final String spaceId, final Long memberId) {
        log.info("Change main admin");
        // Verifying new members
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        ExceptionUtil.isNotNull(userId, NOT_EXIST_MEMBER);
        // Check whether the space of the user corresponding to
        // the new active administrator has reached the upper limit
        boolean limit = this.checkSpaceNumber(userId);
        ExceptionUtil.isFalse(limit, SpaceException.USER_ADMIN_SPACE_LIMIT);
        // Obtain the information about the main administrator
        SpaceAdminInfoDTO dto = baseMapper.selectAdminInfoDto(spaceId);
        ExceptionUtil.isNotNull(dto, SPACE_NOT_EXIST);
        ExceptionUtil.isFalse(dto.getMemberId().equals(memberId),
                TRANSFER_SELF);
        if (dto.getMobile() != null) {
            // check whether the mobile phone verification code is passed
            ValidateTarget target =
                ValidateTarget.create(dto.getMobile(), dto.getAreaCode());
            ValidateCodeProcessorManage.me()
                .findValidateCodeProcessor(ValidateCodeType.SMS)
                .verifyIsPass(target.getRealTarget());
        } else if (dto.getEmail() != null) {
            // check whether the sms verification code is passed
            ValidateTarget target = ValidateTarget.create(dto.getEmail());
            ValidateCodeProcessorManage.me()
                    .findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .verifyIsPass(target.getRealTarget());
        }
        // Update space and member information
        boolean flag = SqlHelper.retBool(
                baseMapper.updateSpaceOwnerId(spaceId, memberId,
                        SessionContext.getUserId()));
        ExceptionUtil.isTrue(flag, SET_MAIN_ADMIN_FAIL);
        iMemberService.cancelMemberMainAdmin(dto.getMemberId());
        iMemberService.setMemberMainAdmin(memberId);
        // If the new administrator is a sub-administrator,
        // delete the original permission
        int count = SqlTool.retCount(
                spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(
                        spaceId, memberId));
        if (count > 0) {
            iSpaceRoleService.deleteRole(spaceId, memberId);
        }
        MemberEntity newMember = memberMapper.selectById(memberId);
        // Send email notification to the new main administrator
        if (ObjectUtil.isNotNull(newMember)
            && StrUtil.isNotBlank(newMember.getEmail())) {
            Dict dict = Dict.create();
            dict.set("USER_NAME", dto.getMemberName());
            dict.set("SPACE_NAME", dto.getSpaceName());
            String url = StrUtil.format(
                    constProperties.getServerDomain() + "/space/{}/workbench",
                    spaceId);
            dict.set("URL", url);
            dict.set("YEARS", LocalDate.now().getYear());
            final String lang;
            lang = userService.getLangByEmail(
                    LocaleContextHolder.getLocale().toLanguageTag(),
                    newMember.getEmail());
            NotifyMailFactory.me()
                    .sendMail(lang, MailPropConstants.SUBJECT_CHANGE_ADMIN,
                            dict,
                            Collections.singletonList(newMember.getEmail()));
        }
        NotificationRenderFieldHolder.set(NotificationRenderField.builder()
                .playerIds(ListUtil.toList(memberId)).build());
        return userId;
    }

    /**
     * Remove Main Admin.
     *
     * @param spaceId space id
     */
    @Override
    public void removeMainAdmin(final String spaceId) {
        baseMapper.removeSpaceOwnerId(spaceId, null);
    }

    /**
     * Get Space Main Admin Member Id.
     *
     * @param spaceId space id
     * @return MemberId
     */
    @Override
    public Long getSpaceMainAdminMemberId(final String spaceId) {
        return baseMapper.selectSpaceMainAdmin(spaceId);
    }

    /**
     * Get Space Main Admin User Id.
     *
     * @param spaceId space id
     * @return UserId
     */
    @Override
    public Long getSpaceMainAdminUserId(final String spaceId) {
        Long spaceMainAdminMemberId = getSpaceMainAdminMemberId(spaceId);
        return memberMapper.selectUserIdByMemberId(spaceMainAdminMemberId);
    }

    /**
     * Check Member Is Main Admin.
     *
     * @param spaceId  space id
     * @param memberId memberId
     */
    @Override
    public void checkMemberIsMainAdmin(final String spaceId,
                                       final Long memberId) {
        log.info("checks whether specified member is main admin");
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean isMainAdmin = owner != null && owner.equals(memberId);
        ExceptionUtil.isFalse(isMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    /**
     * Check Members Is Main Admin.
     *
     * @param spaceId   space id
     * @param memberIds memberIds
     */
    @Override
    public void checkMembersIsMainAdmin(final String spaceId,
                                        final List<Long> memberIds) {
        log.info("Batch checks whether specified members are main admin");
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean haveMainAdmin = CollUtil.contains(memberIds, owner);
        ExceptionUtil.isFalse(haveMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    /**
     * Check Member In Space.
     *
     * @param spaceId  space id
     * @param memberId memberId
     */
    @Override
    public void checkMemberInSpace(final String spaceId, final Long memberId) {
        log.info("checks whether the specified member is in space");
        MemberEntity member =
                memberMapper.selectMemberIdAndSpaceId(spaceId, memberId);
        ExceptionUtil.isNotNull(member, MEMBER_NOT_IN_SPACE);
    }

    /**
     * Check Members In Space.
     *
     * @param spaceId   space id
     * @param memberIds memberIds
     */
    @Override
    public void checkMembersInSpace(final String spaceId,
                                    final List<Long> memberIds) {
        log.info("Batch checks whether specified members are in space");
        int count = SqlTool.retCount(
                memberMapper.selectCountByMemberIds(memberIds));
        ExceptionUtil.isTrue(count == memberIds.size(), MEMBER_NOT_IN_SPACE);
    }

    /**
     * Get User Space Resource.
     *
     * @param userId  userId
     * @param spaceId space id
     * @return UserSpaceVo
     */
    @Override
    public UserSpaceVo getUserSpaceResource(final Long userId,
                                            final String spaceId) {
        log.info("obtain the space resource permission");
        UserSpaceDto userSpaceDto =
                userSpaceCacheService.getUserSpace(userId, spaceId);
        UserSpaceVo userSpaceVo = new UserSpaceVo();
        userSpaceVo.setSpaceName(userSpaceDto.getSpaceName());
        userSpaceVo.setMainAdmin(userSpaceDto.isMainAdmin());
        Set<String> resourceGroupCodes = userSpaceDto.getResourceGroupCodes();
        if (CollUtil.isEmpty(resourceGroupCodes)) {
            return userSpaceVo;
        }
        List<SpaceResourceGroupCode> disabledResourceGroupCodes =
                iSpaceRoleService.getSpaceDisableResourceCodeIfSocialConnect(
                        spaceId);
        if (CollUtil.isNotEmpty(disabledResourceGroupCodes)) {
            disabledResourceGroupCodes.forEach(
                    code -> resourceGroupCodes.remove(code.getCode()));
        }
        userSpaceVo.setPermissions(resourceGroupCodes);
        return userSpaceVo;
    }

    /**
     * Get Space Global Feature.
     *
     * @param spaceId space id
     * @return SpaceGlobalFeature
     */
    @Override
    public SpaceGlobalFeature getSpaceGlobalFeature(final String spaceId) {
        log.info("gets space global properties，spaceId:{}", spaceId);
        String props = baseMapper.selectPropsBySpaceId(spaceId);
        ExceptionUtil.isNotNull(props, SpaceException.SPACE_NOT_EXIST);

        return JSONUtil.toBean(props, SpaceGlobalFeature.class);
    }

    /**
     * Switch Space Pros.
     *
     * @param userId  userId
     * @param spaceId space id
     * @param feature feature
     */
    @Override
    public void switchSpacePros(final Long userId, final String spaceId,
                                final SpaceGlobalFeature feature) {
        log.info("switch space pros，userId:{},spaceId:{}", userId, spaceId);
        JSONObject json = JSONUtil.parseObj(feature);
        if (json.size() == 0) {
            return;
        }
        List<MapDTO> features = new ArrayList<>(json.size());
        for (Entry<String, Object> entry : json.entrySet()) {
            log.info("switch space pros，key:{},value:{}", entry.getKey(),
                    entry.getValue());
            features.add(new MapDTO(entry.getKey(), entry.getValue()));
        }
        boolean flag = SqlHelper.retBool(
                baseMapper.updateProps(userId, spaceId, features));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // When the function of inviting all members of the space is turned off,
        // all public invitation links generated by
        // the original main administrator become invalid.
        if (Boolean.FALSE.equals(feature.getInvitable())) {
            TaskManager.me().execute(
                    () -> iSpaceInviteLinkService.delNoPermitMemberLink(
                            spaceId));
            TaskManager.me().execute(
                    () -> iInvitationService.closeMemberInvitationBySpaceId(
                            spaceId));
        }
    }

    /**
     * Check Can Operate Space Update.
     *
     * @param spaceId space id
     */
    @Override
    public void checkCanOperateSpaceUpdate(final String spaceId) {
        boolean isBoundSocial = socialServiceFacade.checkSocialBind(spaceId);
        ExceptionUtil.isFalse(isBoundSocial, NO_ALLOW_OPERATE);
    }

    /**
     * Get Space ID By Link ID.
     *
     * @param linkId linkId（sharing id or template id）
     * @return SpaceId
     */
    @Override
    public String getSpaceIdByLinkId(final String linkId) {
        log.info("gets the space id of the association information，linkId：{}",
                linkId);
        if (linkId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // sharing node
            return iNodeShareSettingService.getSpaceId(linkId);
        } else {
            // template
            return iTemplateService.getSpaceId(linkId);
        }
    }

    /**
     * Get Name By Space ID.
     *
     * @param spaceId space id
     * @return SpaceName
     */
    @Override
    public String getNameBySpaceId(final String spaceId) {
        return baseMapper.selectSpaceNameBySpaceId(spaceId);
    }

    /**
     * Get Space Owner User ID.
     *
     * @param spaceId space id
     * @return UserId
     */
    @Override
    public Long getSpaceOwnerUserId(final String spaceId) {
        Long adminMemberId = baseMapper.selectSpaceMainAdmin(spaceId);
        if (adminMemberId != null) {
            return memberMapper.selectUserIdByMemberId(adminMemberId);
        }
        return null;
    }

    /**
     * Is Certified.
     *
     * @param spaceId space id
     * @return boolean
     */
    @Override
    public boolean isCertified(final String spaceId) {
        SpaceGlobalFeature spaceGlobalFeature = getSpaceGlobalFeature(spaceId);
        return StrUtil.isNotBlank(spaceGlobalFeature.getCertification());
    }

    /**
     * Switch Space.
     *
     * @param userId  userId
     * @param spaceId space id
     */
    @Override
    public void switchSpace(final Long userId, final String spaceId) {
        // Prevents access to enjoined spaces
        userSpaceCacheService.getMemberId(userId, spaceId);
        // The database saves the activation state
        iMemberService.updateActiveStatus(spaceId, userId);
        // Cache the space where the user's last action was active
        userActiveSpaceCacheService.save(userId, spaceId);
    }

    /**
     * Is Space Available.
     *
     * @param spaceId spaceId
     */
    @Override
    public void isSpaceAvailable(final String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isTrue(
                null != entity && null == entity.getPreDeletionTime(),
                SPACE_NOT_EXIST);
    }

    private boolean checkSpaceNumber(final Long userId) {
        log.info("Check whether the user reaches the upper limit");
        int count = SqlTool.retCount(baseMapper.getAdminSpaceCount(userId));
        return count >= limitProperties.getSpaceMaxCount();
    }

    /**
     * Check User In Space.
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param consumer callback
     */
    @Override
    public void checkUserInSpace(final Long userId, final String spaceId,
                                 final Consumer<Boolean> consumer) {
        Long memberId =
                iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        boolean exist = ObjectUtil.isNotNull(memberId);
        consumer.accept(exist);
    }

    /**
     * Get Space Subscription Info.
     *
     * @param spaceId spaceId
     * @return SpaceSubscribeVo
     */
    @Override
    public SpaceSubscribeVo getSpaceSubscriptionInfo(final String spaceId) {
        SubscriptionInfo subscriptionInfo =
                entitlementServiceFacade.getSpaceSubscription(spaceId);
        SubscribeAssembler assembler = new SubscribeAssembler();
        SpaceSubscribeVo result = assembler.toVo(subscriptionInfo);
        SpaceGlobalFeature spaceGlobalFeature = getSpaceGlobalFeature(spaceId);
        boolean blackSpace = subscriptionInfo.isFree()
            ? ObjectUtil.defaultIfNull(spaceGlobalFeature.getBlackSpace(),
                        Boolean.FALSE) : Boolean.FALSE;
        result.setBlackSpace(blackSpace);
        return result;
    }

}
