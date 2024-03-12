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

import static com.apitable.organization.enums.OrganizationException.CREATE_MEMBER_ERROR;
import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.apitable.shared.constants.NotificationConstants.NEW_SPACE_NAME;
import static com.apitable.shared.constants.NotificationConstants.OLD_SPACE_NAME;
import static com.apitable.space.enums.SpaceException.NO_ALLOW_OPERATE;
import static com.apitable.space.enums.SpaceException.SPACE_NOT_EXIST;
import static com.apitable.space.enums.SpaceException.SPACE_QUIT_FAILURE;
import static com.apitable.workspace.enums.PermissionException.CAN_OP_MAIN_ADMIN;
import static com.apitable.workspace.enums.PermissionException.SET_MAIN_ADMIN_FAIL;
import static com.apitable.workspace.enums.PermissionException.TRANSFER_SELF;

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
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.ai.facade.AiServiceFacade;
import com.apitable.interfaces.ai.model.ChartTimeDimension;
import com.apitable.interfaces.ai.model.CreditInfo;
import com.apitable.interfaces.ai.model.CreditTransactionChartData;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.CycleDateRange;
import com.apitable.interfaces.billing.model.DefaultSubscriptionInfo;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionFeatures;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.internal.service.InternalSpaceService;
import com.apitable.internal.vo.InternalSpaceAutomationRunMessageV0;
import com.apitable.internal.vo.InternalSpaceCapacityVo;
import com.apitable.internal.vo.InternalSpaceUsageVo;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.enums.UserSpaceStatus;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.CommonCacheService;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.captcha.ValidateCodeProcessorManage;
import com.apitable.shared.captcha.ValidateCodeType;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.clock.spring.ClockManager;
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
import com.apitable.shared.exception.LimitException;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.SubscriptionDateRange;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
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
import com.apitable.space.model.CreditUsages;
import com.apitable.space.model.Space;
import com.apitable.space.ro.SpaceUpdateOpRo;
import com.apitable.space.service.IInvitationService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.service.IStaticsService;
import com.apitable.space.vo.SeatUsage;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.space.vo.SpaceInfoVO;
import com.apitable.space.vo.SpaceSocialConfig;
import com.apitable.space.vo.SpaceSubscribeVo;
import com.apitable.space.vo.SpaceVO;
import com.apitable.space.vo.UserSpaceVo;
import com.apitable.template.service.ITemplateService;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import com.apitable.widget.service.IWidgetService;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareSettingService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Space Service Implement Class.
 *
 * @author Chambers
 */
@Slf4j
@Service
public class SpaceServiceImpl extends ServiceImpl<SpaceMapper, SpaceEntity>
    implements ISpaceService {

    private static final int DELETE_SPACE_RETAIN_DAYS = 7;

    @Resource
    private IUserService iUserService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private UserActiveSpaceCacheService userActiveSpaceCacheService;

    @Resource
    private ITeamService iTeamService;

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
    private EntitlementServiceFacade entitlementServiceFacade;

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private IStaticsService iStaticsService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private AiServiceFacade aiServiceFacade;

    @Resource
    private INodeShareSettingService iNodeShareSettingService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private IInvitationService iInvitationService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private InternalSpaceService internalSpaceService;

    @Value("${SKIP_USAGE_VERIFICATION:false}")
    private Boolean skipUsageVerification;

    @Override
    public SpaceEntity getEntityBySpaceId(String spaceId) {
        return baseMapper.selectBySpaceId(spaceId);
    }

    @Override
    public SpaceEntity getBySpaceId(final String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(entity, SPACE_NOT_EXIST);
        return entity;
    }

    @Override
    public void checkExist(final String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(entity, SPACE_NOT_EXIST);
    }

    @Override
    public SpaceEntity getBySpaceIdIgnoreDeleted(final String spaceId) {
        return baseMapper.selectBySpaceIdIgnoreDeleted(spaceId);
    }

    @Override
    public List<SpaceEntity> getBySpaceIds(final List<String> spaceIds) {
        return baseMapper.selectBySpaceIds(spaceIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Space createSpace(final UserEntity user, final String spaceName) {
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
            .fileSharable(true).invitable(true)
            .joinable(false).nodeExportable(true)
            .allowCopyDataToExternal(true)
            .allowDownloadAttachment(true).mobileShowable(false)
            .watermarkEnable(false).build()).toString();
        SpaceEntity space = SpaceEntity.builder()
            .spaceId(spaceId).name(spaceName)
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
        return new Space(spaceId, rootNodeId);
    }

    /**
     * Update Space.
     *
     * @param userId    userId
     * @param spaceId   space id
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
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
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
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg = AuditSpaceArg.builder()
            .action(AuditSpaceAction.RENAME_SPACE)
            .requestIp(clientOriginInfo.getIp())
            .requestUserAgent(clientOriginInfo.getUserAgent())
            .userId(userId)
            .spaceId(spaceId)
            .info(info)
            .build();
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
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg = AuditSpaceArg.builder()
            .action(AuditSpaceAction.UPDATE_SPACE_LOGO)
            .userId(userId)
            .requestIp(clientOriginInfo.getIp())
            .requestUserAgent(clientOriginInfo.getUserAgent())
            .spaceId(spaceId)
            .info(info)
            .build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new AuditSpaceEvent(this, arg));
    }

    /**
     * preDeleteById.
     *
     * @param userId  userId
     * @param spaceId space id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
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
        spaceIds.forEach(spaceId -> userSpaceCacheService.delete(userId, spaceId));
        // delete member（must be after deleting user）
        memberMapper.delBySpaceIds(spaceIds, null);
        // delete space exclusive domain name
        socialServiceFacade.removeDomainBySpaceIds(spaceIds);
    }

    /**
     * Cancel Del By Ids.
     *
     * @param userId  userId
     * @param spaceId space id
     */
    @Override
    public void cancelDelByIds(final Long userId, final String spaceId) {
        log.info("undo delete space");
        boolean flag = SqlHelper.retBool(
            baseMapper.updatePreDeletionTimeBySpaceId(null, spaceId, userId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        //restore other members
        memberMapper.cancelPreDelBySpaceId(spaceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void quit(final String spaceId, final Long memberId) {
        log.info("quit space.");
        // Delete corresponding members, the organizations and member
        // relationships
        if (ObjectUtil.isNull(memberId)) {
            return;
        }
        SpaceEntity entity = this.getBySpaceId(spaceId);
        // the main administrator cannot exit directly
        ExceptionUtil.isFalse(entity.getOwner().equals(memberId), SPACE_QUIT_FAILURE);
        iMemberService.batchDeleteMemberFromSpace(spaceId,
            Collections.singletonList(memberId), false);
    }

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

    @Override
    public long getNodeCountBySpaceId(String spaceId, Predicate<NodeType> excludeType) {
        List<NodeTypeStaticsDTO> nodeTypeStaticsDTOList =
            iStaticsService.getNodeTypeStaticsBySpaceId(spaceId);
        return nodeTypeStaticsDTOList.stream()
            .filter(statics -> {
                NodeType nodeType = NodeType.toEnum(statics.getType());
                return !nodeType.isRoot() && !excludeType.test(nodeType);
            })
            .mapToLong(NodeTypeStaticsDTO::getTotal).sum();
    }

    @Override
    public CreditInfo getCredit(String spaceId) {
        SubscriptionInfo subscriptionInfo = new DefaultSubscriptionInfo();
        if (StrUtil.isNotBlank(spaceId)) {
            subscriptionInfo =
                entitlementServiceFacade.getSpaceSubscription(spaceId);
        }
        LocalDate now = ClockManager.me().getLocalDateNow();
        CycleDateRange dateRange = SubscriptionDateRange.calculateCycleDate(subscriptionInfo, now);
        return new CreditInfo(subscriptionInfo.getConfig().isAllowCreditOverLimit(),
            subscriptionInfo.getFeature().getMessageCreditNums().getValue(),
            aiServiceFacade.getUsedCreditCount(spaceId, dateRange.getCycleStartDate(),
                dateRange.getCycleEndDate()));
    }

    @Override
    public CreditUsages getCreditUsagesChart(
        String spaceId, ChartTimeDimension chartTimeDimension) {
        List<CreditTransactionChartData> dataCollection =
            aiServiceFacade.loadCreditTransactionChartData(spaceId, chartTimeDimension);
        return CreditUsages.of(dataCollection);
    }

    @Override
    public SeatUsage getSeatUsage(String spaceId) {
        long memberCount =
            iMemberService.getTotalActiveMemberCountBySpaceId(spaceId);
        return new SeatUsage(0L, memberCount);
    }

    @Override
    public void checkChatBotNumsOverLimit(String spaceId) {
        checkChatBotNumsOverLimit(spaceId, 1);
    }

    @Override
    public void checkChatBotNumsOverLimit(String spaceId, int addedNums) {
        var subscriptionInfo =
            entitlementServiceFacade.getSpaceSubscription(spaceId);
        var aiAgentNums = subscriptionInfo.getFeature().getAiAgentNums();
        if (!subscriptionInfo.isFree() && aiAgentNums.isUnlimited()) {
            return;
        }
        if (aiAgentNums.isUnlimited()) {
            return;
        }
        long chatBotCount = iStaticsService.getTotalChatbotNodesfromCache(spaceId);
        if (chatBotCount + addedNums > aiAgentNums.getValue()) {
            throw new BusinessException(LimitException.CHAT_BOT_OVER_LIMIT);
        }
    }

    @Override
    public void checkSeatOverLimit(String spaceId) {
        checkSeatOverLimit(spaceId, 1);
    }

    @Override
    public void checkSeatOverLimit(String spaceId, long addedSeatNums) {
        // get subscription max seat nums
        var subscriptionInfo =
            entitlementServiceFacade.getSpaceSubscription(spaceId);
        var seatNums = subscriptionInfo.getFeature().getSeat();
        if (!subscriptionInfo.isFree() && seatNums.isUnlimited()) {
            return;
        }
        var seatUsage = getSeatUsage(spaceId);
        var total = seatUsage.getTotal();
        if (total + addedSeatNums > seatNums.getValue()) {
            throw new BusinessException(LimitException.SEATS_OVER_LIMIT);
        }
    }

    @Override
    public void checkFileNumOverLimit(String spaceId) {
        checkFileNumOverLimit(spaceId, 1);
    }

    @Override
    public void checkFileNumOverLimit(String spaceId, long addFileNums) {
        // get subscription max sheet nums
        var subscriptionInfo =
            entitlementServiceFacade.getSpaceSubscription(spaceId);
        if (!subscriptionInfo.isFree()) {
            return;
        }
        var fileNodeNums =
            subscriptionInfo.getFeature().getFileNodeNums();
        var currentSheetNums = getNodeCountBySpaceId(spaceId, NodeType::isFolder);
        if (!fileNodeNums.isUnlimited()
            && (currentSheetNums + addFileNums > fileNodeNums.getValue())) {
            throw new BusinessException(LimitException.FILE_NUMS_OVER_LIMIT);
        }
    }

    @Override
    public boolean checkSeatOverLimitAndSendNotify(List<Long> userIds, String spaceId,
                                                   long addedSeatNums, boolean isAllMember,
                                                   boolean sendNotify) {
        // get subscription max seat nums
        SubscriptionInfo subscriptionInfo = entitlementServiceFacade.getSpaceSubscription(spaceId);
        var seat = subscriptionInfo.getFeature().getSeat();
        if (!subscriptionInfo.isFree() && seat.isUnlimited()) {
            // apitable billing mode, paid space，skip validation
            return true;
        }
        SeatUsage seatUsage = getSeatUsageForIM(spaceId);
        long totalSeatNums = seatUsage.getTotal() + addedSeatNums;
        if (isAllMember) {
            totalSeatNums = addedSeatNums;
        }
        if (!seat.isUnlimited() && (totalSeatNums > seat.getValue())) {
            log.info("spaceId:{}, current num:{}, max seats:{}", spaceId, totalSeatNums,
                seat.getValue());
            if (sendNotify) {
                // Send space station notifications
                try {
                    String spaceName = getNameBySpaceId(spaceId);
                    long finalTotalSeatNums = totalSeatNums;
                    TaskManager.me().execute(() -> NotificationManager.me()
                        .playerNotify(NotificationTemplateId.SPACE_REFRESH_CONTACT_SEATS_LIMIT,
                            userIds, 0L, spaceId, Dict.create().set("spaceName", spaceName)
                                .set("specification", seat.getValue())
                                .set("usage", finalTotalSeatNums)));
                } catch (Exception e) {
                    log.error("send space station notifications error", e);
                }
            }
            log.warn("{} seats over limit", spaceId);
            return true;
        }
        return true;
    }


    @Override
    public SeatUsage getSeatUsageForIM(String spaceId) {
        long memberCount =
            iMemberService.getTotalMemberCountBySpaceId(spaceId);
        return new SeatUsage(0L, memberCount);
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
        SpaceInfoVO spaceInfoVO = this.transform(entity);
        if (Boolean.TRUE.equals(skipUsageVerification)) {
            spaceInfoVO.setSocial(new SpaceSocialConfig());
            spaceInfoVO.setSeatUsage(new SeatUsage());
            return spaceInfoVO;
        }
        SubscriptionInfo subscriptionInfo = entitlementServiceFacade.getSpaceSubscription(spaceId);
        LocalDate now = ClockManager.me().getLocalDateNow();
        CycleDateRange dateRange = SubscriptionDateRange.calculateCycleDate(subscriptionInfo, now);
        SeatUsage seatUsage = getSeatUsage(spaceId);
        spaceInfoVO.setSeatUsage(seatUsage);
        spaceInfoVO.setSeats(seatUsage.getMemberCount());
        // widget statistics
        long widgetCount = iWidgetService.getSpaceWidgetCount(spaceId);
        spaceInfoVO.setWidgetNums(widgetCount);
        // robot runs statistics
        InternalSpaceAutomationRunMessageV0 automationRunMessageV0 =
            internalSpaceService.getAutomationRunMessageV0(spaceId);
        spaceInfoVO.setAutomationRunsNums(automationRunMessageV0.getAutomationRunNums());
        // teams statistics
        long teamCount = iStaticsService.getTeamTotalCountBySpaceId(spaceId);
        spaceInfoVO.setDeptNumber(teamCount);
        // admin statistics
        long adminCount = iStaticsService.getAdminTotalCountBySpaceId(spaceId);
        spaceInfoVO.setAdminNums(adminCount);
        // record statistics
        long recordCount =
            iStaticsService.getDatasheetRecordTotalCountBySpaceId(spaceId);
        spaceInfoVO.setRecordNums(recordCount);
        // used space statistics
        long capacityUsedSize =
            spaceCapacityCacheService.getSpaceCapacity(spaceId);
        spaceInfoVO.setCapacityUsedSizes(capacityUsedSize);
        // API usage statistics
        long apiUsage =
            iStaticsService.getCurrentMonthApiUsage(spaceId, dateRange.getCycleEndDate());
        spaceInfoVO.setApiRequestCountUsage(apiUsage);
        // file control amount
        ControlStaticsDTO controlStaticsDTO =
            iStaticsService.getFieldRoleTotalCountBySpaceId(spaceId);
        if (controlStaticsDTO != null) {
            spaceInfoVO.setNodeRoleNums(controlStaticsDTO.getNodeRoleCount());
            spaceInfoVO.setFieldRoleNums(controlStaticsDTO.getFieldRoleCount());
        }
        // node statistics
        List<NodeTypeStaticsDTO> nodeTypeStaticDtos =
            iStaticsService.getNodeTypeStaticsBySpaceId(spaceId);
        long sheetNums = nodeTypeStaticDtos.stream()
            .filter(condition -> NodeType.toEnum(condition.getType()).isNotFolder())
            .mapToLong(NodeTypeStaticsDTO::getTotal)
            .sum();
        spaceInfoVO.setSheetNums(sheetNums);
        long mirrorNums = nodeTypeStaticDtos.stream()
            .filter(condition ->
                NodeType.MIRROR == NodeType.toEnum(condition.getType()))
            .mapToLong(NodeTypeStaticsDTO::getTotal).sum();
        spaceInfoVO.setMirrorNums(mirrorNums);
        Map<Integer, Integer> typeStaticsMap = nodeTypeStaticDtos.stream()
            .collect(Collectors.toMap(NodeTypeStaticsDTO::getType,
                NodeTypeStaticsDTO::getTotal));
        long formViewNums =
            typeStaticsMap.containsKey(NodeType.FORM.getNodeType())
                ? typeStaticsMap.get(NodeType.FORM.getNodeType()) : 0L;
        spaceInfoVO.setFormViewNums(formViewNums);
        // table view statistics
        DatasheetStaticsDTO viewVO = iStaticsService.getDatasheetStaticsBySpaceId(spaceId);
        spaceInfoVO.setKanbanViewNums(viewVO.getKanbanViews());
        spaceInfoVO.setCalendarViewNums(viewVO.getCalendarViews());
        spaceInfoVO.setGalleryViewNums(viewVO.getGalleryViews());
        spaceInfoVO.setGanttViewNums(viewVO.getGanttViews());
        // space attachment capacity usage information
        SpaceCapacityUsedInfo spaceCapacityUsedInfo =
            this.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        spaceInfoVO.setCurrentBundleCapacityUsedSizes(
            spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes());
        spaceInfoVO.setGiftCapacityUsedSizes(
            spaceCapacityUsedInfo.getGiftCapacityUsedSizes());

        // obtain third party information
        SocialConnectInfo socialConnectInfo =
            socialServiceFacade.getConnectInfo(spaceId);
        SpaceSocialConfig bindInfo = new SpaceSocialConfig();
        if (ObjectUtil.isNotNull(socialConnectInfo) && socialConnectInfo.isEnabled()) {
            bindInfo.setEnabled(true);
            bindInfo.setPlatform(socialConnectInfo.getPlatform());
            bindInfo.setAppType(socialConnectInfo.getAppType());
            bindInfo.setAuthMode(socialConnectInfo.getAuthMode());
            // is it synchronizing the contact
            bindInfo.setContactSyncing(socialConnectInfo.contactSyncing());
        }
        spaceInfoVO.setSocial(bindInfo);
        // credit
        BigDecimal usedCredit =
            aiServiceFacade.getUsedCreditCount(spaceId, dateRange.getCycleStartDate(),
                dateRange.getCycleEndDate());
        spaceInfoVO.setUsedCredit(usedCredit);
        // chat bot status
        CommonCacheService cacheService = SpringContextHolder.getBean(CommonCacheService.class);
        boolean isEnableChatbot = cacheService.checkIfSpaceEnabledChatbot(spaceId);
        spaceInfoVO.setIsEnableChatbot(isEnableChatbot);
        return spaceInfoVO;
    }

    private SpaceInfoVO transform(SpaceEntity entity) {
        SpaceInfoVO spaceInfoVO = SpaceInfoVO.builder()
            .spaceName(entity.getName())
            .spaceLogo(entity.getLogo())
            .createTime(entity.getCreatedAt())
            .build();
        // owner info
        this.appendOwnerInfo(spaceInfoVO, entity);
        if (ObjectUtil.isNotNull(entity.getPreDeletionTime())) {
            spaceInfoVO.setDelTime(entity.getPreDeletionTime()
                .plusDays(DELETE_SPACE_RETAIN_DAYS));
        }
        return spaceInfoVO;
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
        Long planCapacity = subscriptionInfo.getTotalCapacity().getValue().toBytes()
            - subscriptionInfo.getGiftCapacity().getValue().toBytes();
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
            Long giftCapacity = subscriptionInfo.getGiftCapacity().getValue().toBytes();
            // If the attachment capacity is used in excess,
            // the used complimentary attachment capacity is equal to
            // the size of the complimentary assert capacity.
            if (capacityUsedSize
                > subscriptionInfo.getTotalCapacity().getValue().toBytes()) {
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(giftCapacity);
            } else {
                // gift capacity used left
                long usedSizes = capacityUsedSize - planCapacity;
                spaceCapacityUsedInfo.setGiftCapacityUsedSizes(usedSizes);
            }
        }
        return spaceCapacityUsedInfo;
    }

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
        Long totalCapacity = subscriptionInfo.getTotalCapacity().getValue().toBytes();
        // complimentary attachment capacity
        Long unExpireGiftCapacity =
            subscriptionInfo.getGiftCapacity().getValue().toBytes();
        return InternalSpaceCapacityVo.builder().usedCapacity(usedCapacity)
            .currentBundleCapacity(totalCapacity)
            .unExpireGiftCapacity(unExpireGiftCapacity)
            .totalCapacity(totalCapacity).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long changeMainAdmin(final String spaceId, final Long memberId) {
        log.info("Change main admin");
        // Verifying new members
        Long userId = iMemberService.getUserIdByMemberId(memberId);
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
            spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId));
        if (count > 0) {
            iSpaceRoleService.deleteRole(spaceId, memberId);
        }
        ArrayList<Long> memberIdList = ListUtil.toList(memberId);
        List<String> emails = iMemberService.getEmailsByMemberIds(memberIdList);
        // Send email notification to the new main administrator
        if (CollUtil.isNotEmpty(emails)) {
            Dict dict = Dict.create();
            dict.set("SPACE_NAME", dto.getSpaceName());
            dict.set("MEMBER_NAME", dto.getMemberName());
            dict.set("AVATAR", constProperties.spliceAssetUrl(dto.getAvatar()));
            String url = StrUtil.format("{}/space/{}/workbench",
                constProperties.getServerDomain(), spaceId);
            dict.set("URL", url);
            Dict subjectDict = Dict.create();
            subjectDict.set("SPACE_NAME", dto.getSpaceName());
            subjectDict.set("MEMBER_NAME", dto.getMemberName());
            final String lang;
            lang = iUserService.getLangByEmail(
                LocaleContextHolder.getLocale().toLanguageTag(), emails.get(0));
            NotifyMailFactory.me()
                .sendMail(lang, MailPropConstants.SUBJECT_CHANGE_ADMIN,
                    subjectDict, dict, emails);
        }
        NotificationRenderFieldHolder.set(NotificationRenderField.builder()
            .playerIds(memberIdList).build());
        return userId;
    }

    @Override
    public void removeMainAdmin(final String spaceId) {
        baseMapper.removeSpaceOwnerId(spaceId, null);
    }

    @Override
    public Long getSpaceMainAdminMemberId(final String spaceId) {
        return baseMapper.selectSpaceMainAdmin(spaceId);
    }

    @Override
    public Long getSpaceMainAdminUserId(final String spaceId) {
        Long spaceMainAdminMemberId = getSpaceMainAdminMemberId(spaceId);
        return iMemberService.getUserIdByMemberId(spaceMainAdminMemberId);
    }

    @Override
    public void checkMemberIsMainAdmin(final String spaceId,
                                       final Long memberId, Consumer<Boolean> consumer) {
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        consumer.accept(owner != null && owner.equals(memberId));
    }

    @Override
    public void checkMemberIsAdmin(String spaceId, Long memberId) {
        Long mainAdminMemberId = getSpaceMainAdminMemberId(spaceId);
        List<Long> subAdminMemberIds = iSpaceRoleService.getSubAdminIdList(spaceId);
        boolean exist = mainAdminMemberId.equals(memberId) || subAdminMemberIds.contains(memberId);
        ExceptionUtil.isTrue(exist, PermissionException.NOT_PERMISSION_ACCESS);
    }

    @Override
    public void checkMembersIsMainAdmin(final String spaceId,
                                        final List<Long> memberIds) {
        Long owner = baseMapper.selectSpaceMainAdmin(spaceId);
        boolean haveMainAdmin = CollUtil.contains(memberIds, owner);
        ExceptionUtil.isFalse(haveMainAdmin, CAN_OP_MAIN_ADMIN);
    }

    @Override
    public UserSpaceVo getUserSpaceResource(final Long userId,
                                            final String spaceId) {
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
            iSpaceRoleService.getSpaceDisableResourceCodeIfSocialConnect(spaceId);
        if (CollUtil.isNotEmpty(disabledResourceGroupCodes)) {
            disabledResourceGroupCodes.forEach(
                code -> resourceGroupCodes.remove(code.getCode()));
        }
        userSpaceVo.setPermissions(resourceGroupCodes);
        return userSpaceVo;
    }

    @Override
    public SpaceGlobalFeature getSpaceGlobalFeature(final String spaceId) {
        log.info("gets space global properties，spaceId:{}", spaceId);
        String props = baseMapper.selectPropsBySpaceId(spaceId);
        ExceptionUtil.isNotNull(props, SpaceException.SPACE_NOT_EXIST);
        return JSONUtil.toBean(props, SpaceGlobalFeature.class);
    }

    @Override
    public void switchSpacePros(final Long userId, final String spaceId,
                                final SpaceGlobalFeature feature) {
        log.info("switch space pros，userId:{},spaceId:{}", userId, spaceId);
        JSONObject json = JSONUtil.parseObj(feature);
        if (json.isEmpty()) {
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
            TaskManager.me().execute(() ->
                iSpaceInviteLinkService.delNoPermitMemberLink(spaceId));
            TaskManager.me().execute(() ->
                iInvitationService.closeMemberInvitationBySpaceId(spaceId));
        }
    }

    @Override
    public void checkCanOperateSpaceUpdate(final String spaceId) {
        boolean isBoundSocial = socialServiceFacade.checkSocialBind(spaceId);
        ExceptionUtil.isFalse(isBoundSocial, NO_ALLOW_OPERATE);
    }

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

    @Override
    public String getNameBySpaceId(final String spaceId) {
        return baseMapper.selectSpaceNameBySpaceId(spaceId);
    }

    @Override
    public Long getSpaceOwnerUserId(final String spaceId) {
        Long adminMemberId = baseMapper.selectSpaceMainAdmin(spaceId);
        if (adminMemberId == null) {
            return null;
        }
        return iMemberService.getUserIdByMemberId(adminMemberId);
    }

    @Override
    public boolean isCertified(final String spaceId) {
        SpaceGlobalFeature spaceGlobalFeature = getSpaceGlobalFeature(spaceId);
        return StrUtil.isNotBlank(spaceGlobalFeature.getCertification());
    }

    @Override
    public void switchSpace(final Long userId, final String spaceId) {
        // Prevents access to enjoined spaces
        userSpaceCacheService.getMemberId(userId, spaceId);
        // The database saves the activation state
        iMemberService.updateActiveStatus(spaceId, userId);
        // Cache the space where the user's last action was active
        userActiveSpaceCacheService.save(userId, spaceId);
    }

    @Override
    public SpaceEntity isSpaceAvailable(final String spaceId) {
        SpaceEntity entity = baseMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isTrue(null != entity
            && null == entity.getPreDeletionTime(), SPACE_NOT_EXIST);
        return entity;
    }

    private boolean checkSpaceNumber(final Long userId) {
        log.info("Check whether the user reaches the upper limit");
        int count = SqlTool.retCount(baseMapper.getAdminSpaceCount(userId));
        return count >= limitProperties.getSpaceMaxCount();
    }

    @Override
    public void checkUserInSpace(final Long userId, final String spaceId,
                                 final Consumer<Boolean> consumer) {
        Long memberId =
            iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        boolean exist = ObjectUtil.isNotNull(memberId);
        consumer.accept(exist);
    }

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

    @Override
    public String getSpaceOwnerOpenId(String spaceId) {
        Long adminMemberId = baseMapper.selectSpaceMainAdmin(spaceId);
        if (adminMemberId == null) {
            return null;
        }
        return memberMapper.selectOpenIdByMemberId(adminMemberId);
    }

    @Override
    public boolean getSpaceSeatAvailableStatus(String spaceId) {
        // seat information
        SubscriptionInfo subscriptionInfo =
            entitlementServiceFacade.getSpaceSubscription(spaceId);
        Long seat = subscriptionInfo.getFeature().getSeat().getValue();
        if (seat == null || seat == 0) {
            return false;
        }
        if (seat < 0) {
            return true;
        }
        long activeMemberTotalCount =
            iStaticsService.getActiveMemberTotalCountFromCache(spaceId);
        return seat - activeMemberTotalCount > 0;
    }

    @Override
    public List<String> getSpaceIdsByCreatedBy(Long userId) {
        return baseMapper.selectSpaceIdsByUserId(userId);
    }

    @Override
    public void checkWidgetOverLimit(String spaceId) {
        // get subscription max widget nums
        SubscriptionInfo subscriptionInfo = getSpaceSubscription(spaceId);
        // Only the free version requires verification
        if (!subscriptionInfo.isFree()) {
            return;
        }
        SubscriptionFeatures.ConsumeFeatures.WidgetNums widgetNums =
            subscriptionInfo.getFeature().getWidgetNums();
        // check the number of components in the space
        Long count = iWidgetService.getSpaceWidgetCount(spaceId);
        if (!widgetNums.isUnlimited() && count >= widgetNums.getValue()) {
            throw new BusinessException(LimitException.WIDGET_OVER_LIMIT);
        }
    }

    @Override
    public SubscriptionInfo getSpaceSubscription(String spaceId) {
        return entitlementServiceFacade.getSpaceSubscription(spaceId);
    }

    @Override
    public SocialConnectInfo getSocialConnectInfo(String spaceId) {
        return socialServiceFacade.getConnectInfo(spaceId);
    }

    @Override
    public String getSocialSuiteKeyByAppId(String appId) {
        return socialServiceFacade.getSuiteKeyByDingtalkSuiteId(appId);
    }
}
