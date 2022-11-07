package com.vikadata.api.modular.social.service.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.enums.finance.DingTalkOrderType;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.component.vika.VikaFactory;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.finance.service.ISocialDingTalkOrderService;
import com.vikadata.api.modular.finance.service.ISocialDingTalkRefundService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.organization.factory.OrganizationFactory;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.event.dingtalk.DingTalkCardFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.mapper.SocialTenantUserMapper;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.IDingTalkIsvEventService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.DingTalkPlanConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.apitable.starter.social.dingtalk.autoconfigure.DingTalkProperties.IsvAppProperty;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.api.enums.node.NodeType;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.integration.grpc.TenantInfoResult;
import com.vikadata.integration.vika.model.DingTalkSubscriptionInfo;
import com.vikadata.social.dingtalk.event.order.BaseOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent.Agent;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent.AuthInfo;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent.AuthOrgScopes;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteAuthEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.BaseOrgUserContactEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserLeaveOrgEvent;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.SpaceConstants.SPACE_NAME_DEFAULT_SUFFIX;
import static com.vikadata.social.dingtalk.constants.DingTalkConst.ROOT_DEPARTMENT_ID;

/**
 * <p>
 * ISV DingTalk Implementation of event service interface
 * </p>
 */
@Service
@Slf4j
public class DingTalkIsvEventServiceImpl implements IDingTalkIsvEventService {
    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private SocialTenantUserMapper socialTenantUserMapper;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private ISocialDingTalkOrderService iSocialDingTalkOrderService;

    @Resource
    private ISocialDingTalkRefundService iSocialDingTalkRefundService;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgSuiteAuthEvent(String suiteId, BaseOrgSuiteEvent event) {
        String corpId = event.getAuthCorpInfo().getCorpid();
        SocialTenantEntity entity = iSocialTenantService.getByAppIdAndTenantId(suiteId, corpId);
        // Already exists, and is in the enabled state repeatedly
        if (entity != null && entity.getStatus()) {
            return;
        }
        // Check third-party status
        TenantInfoResult tenantInfo = iDingTalkInternalIsvService.getSocialTenantInfo(corpId, suiteId);
        // There may be re authorization. The local status is 0. Create a new space to bind
        String authUserOpenId = event.getAuthUserInfo().getUserId();
        // First save the information of authorized personnel, initialize the space station, and then synchronize the member information
        AuthOrgScopes scopes = new AuthOrgScopes();
        scopes.setAuthedUser(Collections.singletonList(authUserOpenId));
        scopes.setAuthedDept(Collections.emptyList());
        // Initialize a new space
        SpaceContext spaceContext = new SpaceContext(null, event.getAuthCorpInfo().getCorpName(),
                event.getAuthCorpInfo().getCorpLogoUrl());
        spaceContext.prepare();
        String spaceId = spaceContext.spaceId;
        ContactMeta contactMeta = new ContactMeta(spaceId, corpId, suiteId, authUserOpenId);
        handleIsvOrgContactData(contactMeta, spaceContext, scopes);
        String agentId = event.getAuthInfo().getAgent().get(0).getAgentid().toString();
        // Correct agent id before saving
        if (StrUtil.isNotBlank(tenantInfo.getTenantId())) {
            agentId = tenantInfo.getAgentId();
            AuthInfo authInfo = event.getAuthInfo();
            Agent agent = authInfo.getAgent().get(0);
            agent.setAgentid(Long.parseLong(agentId));
            authInfo.setAgent(Collections.singletonList(agent));
            event.setAuthInfo(authInfo);
        }
        // Save or update tenant information
        iSocialTenantService.createOrUpdateWithScope(SocialPlatformType.DINGTALK, SocialAppType.ISV,
                suiteId, corpId, JSONUtil.toJsonStr(scopes), JSONUtil.toJsonStr(event));
        // Bind the tenant and this space station
        iSocialTenantBindService.addTenantBind(suiteId, corpId, spaceId);
        // Save address book information
        contactMeta.doSaveOrUpdate();
        // ID of the main administrator member of the space (the new space randomly references the template method, including GRPC calls, and places the last)
        spaceContext.after(contactMeta.openIdMap.get(authUserOpenId).getMemberId());
        // If there is order information before authorization, it needs to be completed
        handleTenantOrders(corpId, suiteId);
        // Send start notification
        String finalAgentId = agentId;
        TaskManager.me().execute(() -> {
            IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfig(suiteId);
            iDingTalkInternalIsvService.sendMessageToUserByTemplateId(suiteId, corpId, app.getMsgTplId().getWelcome(),
                    DingTalkCardFactory.createIsvEntryCardData(suiteId, corpId, app.getAppId()),
                    ListUtil.toList(contactMeta.openIds), finalAgentId);
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgSuiteChangeEvent(String suiteId, BaseOrgSuiteEvent event) {
        String corpId = event.getAuthCorpInfo().getCorpid();
        // Update tenant changes
        String authUserOpenId = event.getAuthUserInfo().getUserId();
        AuthOrgScopes scopes = event.getAuthScope().getAuthOrgScopes();
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, suiteId);
        // Initialize a new space
        SpaceContext spaceContext = new SpaceContext(spaceId, event.getAuthCorpInfo().getCorpName(),
                event.getAuthCorpInfo().getCorpLogoUrl());
        spaceContext.prepare();
        ContactMeta contactMeta = new ContactMeta(spaceId, corpId, suiteId, authUserOpenId);
        handleIsvOrgContactData(contactMeta, spaceContext, scopes);
        // Save or update tenant information
        iSocialTenantService.createOrUpdateWithScope(SocialPlatformType.DINGTALK, SocialAppType.ISV,
                suiteId, corpId, JSONUtil.toJsonStr(scopes), JSONUtil.toJsonStr(event));
        // Save address book information
        contactMeta.deleteMembers();
        contactMeta.doSaveOrUpdate();
        // The master administrator moved out of the visible range
        Long owner = contactMeta.openIds.contains(spaceContext.oldAdminOpenId) ?
                contactMeta.openIdMap.get(spaceContext.oldAdminOpenId).getMemberId() : null;
        // ID of the main administrator member of the space (the new space randomly references the template method, including GRPC calls, and places the last)
        spaceContext.after(owner);
        // Send start notification
        TaskManager.me().execute(() -> {
            IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfig(suiteId);
            List<String> openIds = contactMeta.tenantUserMap.values().stream().filter(i -> i.isNew)
                    .map(SocialTenantUserDTO::getOpenId).collect(Collectors.toList());
            if (!openIds.isEmpty()) {
                iDingTalkInternalIsvService.sendMessageToUserByTemplateId(suiteId, corpId, app.getMsgTplId().getWelcome(),
                        DingTalkCardFactory.createIsvEntryCardData(suiteId, corpId, app.getAppId()), openIds);
            }
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgSuiteRelieveEvent(String suiteId, String corpId) {
        List<String> spaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(corpId, suiteId);
        if (CollUtil.isNotEmpty(spaceIds)) {
            for (String spaceId : spaceIds) {
                iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.DINGTALK_STORE.name());
                Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
                SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
                iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
                // Delete space binding
                iSocialTenantBindService.removeBySpaceId(spaceId);
                List<String> openIds = memberMapper.selectOpenIdBySpaceId(CollUtil.toList(spaceId));
                if (!openIds.isEmpty()) {
                    iSocialTenantUserService.deleteByTenantIdAndOpenIds(suiteId, corpId, openIds);
                }
            }
        }
        iSocialTenantService.updateTenantStatus(suiteId, corpId, false);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgMicroAppRestoreEvent(String suiteId, String corpId) {
        List<String> spaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(corpId, suiteId);
        if (CollUtil.isNotEmpty(spaceIds)) {
            for (String spaceId : spaceIds) {
                iAppInstanceService.createInstanceByAppType(spaceId, AppType.DINGTALK_STORE.name());
            }
            // Reopen the tenant
            iSocialTenantService.updateTenantStatus(suiteId, corpId, true);
            // todo Send Message Card
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgMicroAppStopEvent(String suiteId, String corpId) {
        List<String> spaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(corpId, suiteId);
        if (CollUtil.isNotEmpty(spaceIds)) {
            for (String spaceId : spaceIds) {
                iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.DINGTALK_STORE.name());
            }
            // Update application status
            iSocialTenantService.updateTenantStatus(suiteId, corpId, false);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleUserAddOrgEvent(String openId, BaseOrgUserContactEvent event) {
        // New version event
        String tenantKey = event.getCorpId();
        String unionId = event.getUnionid();
        if (!event.getErrcode().equals(0)) {
            log.warn("[Normal] - [Incorrect user information]:{}:{}:{}", tenantKey, openId, event.getErrmsg());
            handleUserLeaveOrgEvent(openId, BeanUtil.toBean(event, SyncHttpUserLeaveOrgEvent.class));
            return;
        }
        if (StrUtil.isBlank(unionId)) {
            log.warn("[Normal] - [The user does not have a union ID]:{}:{}", tenantKey, openId);
            return;
        }
        String suiteId = event.getSuiteId();
        // Get the space ID of the current department
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, suiteId);
        if (StrUtil.isBlank(spaceId)) {
            log.warn("[Normal] - [User information change event]Tenant「{}」No space bound", tenantKey);
            return;
        }
        // Employee inactive change event information will not be processed
        if (!event.getActive()) {
            log.warn("[User information change event] Tenant「{}」User [{}]Not activated, not processed", tenantKey, openId);
            return;
        }
        if (!memberVisitable(tenantKey, suiteId, openId)) {
            log.warn("[User information change event]Tenant「{}」User[{}]Not in the visible range, not processed", tenantKey, openId);
            return;
        }
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, openId);
        if (ObjectUtil.isNull(memberId)) {
            HashMap<String, String> nickNameMap = iSocialUserBindService.getUserNameByUnionIds(Collections.singletonList(unionId));
            // Create Member
            MemberEntity member = createMember(IdWorker.getId(), spaceId, nickNameMap.get(unionId), openId, false);
            // Create Member
            iMemberService.batchCreate(spaceId, Collections.singletonList(member));
            // Create department association and put it directly into the root department
            Long rootTeamId = iTeamService.getRootTeamId(spaceId);
            iTeamMemberRelService.createBatch(Collections.singletonList(createTeamMemberRel(rootTeamId, member.getId())));
            // Send start notification
            TaskManager.me().execute(() -> {
                IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfig(suiteId);
                iDingTalkInternalIsvService.sendMessageToUserByTemplateId(suiteId, tenantKey, app.getMsgTplId().getWelcome(),
                        DingTalkCardFactory.createIsvEntryCardData(suiteId, tenantKey, app.getAppId()),
                        Collections.singletonList(openId));
            });
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleUserLeaveOrgEvent(String openId, SyncHttpUserLeaveOrgEvent event) {
        String tenantKey = event.getCorpId();
        // Get space ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, event.getSuiteId());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("[Normal] - [User resignation event]Tenant「{}」No space bound", tenantKey);
            return;
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, openId);
        if (member != null) {
            if (member.getIsAdmin()) {
                // The resigned member is the master administrator. Set the master administrator of the space station to null
                spaceMapper.updateSpaceOwnerId(spaceId, null, null);
            }
            // Prohibit login with authorization
            String unionId = iSocialTenantUserService.getUnionIdByOpenId(event.getSuiteId(), tenantKey, openId);
            if (StrUtil.isNotBlank(unionId)) {
                iUserLinkService.deleteBatchOpenId(Collections.singletonList(openId), LinkType.DINGTALK.getType());
            }
            socialTenantUserMapper.deleteByTenantIdAndOpenId(event.getSuiteId(), tenantKey, openId);
            // Remove member's space
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(member.getId()), false);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleMarketOrderEvent(SyncHttpMarketOrderEvent event) {
        String tenantKey = event.getCorpId();
        Integer status = iSocialDingTalkOrderService.getStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId());
        if (SqlHelper.retBool(status)) {
            log.warn("DingTalk order has been processed:{}", event.getOrderId());
            return;
        }
        // Write DingTalk order
        if (null == status) {
            iSocialDingTalkOrderService.createOrder(event);
        }
        // Get space ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, event.getSuiteId());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("The DingTalk enterprise has not received the application activation event:{}", event.getCorpId());
            return;
        }
        try {
            String orderId = SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);
            // Synchronize order events
            SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
        }
        catch (Exception e) {
            log.error("Failed to process tenant order, please solve it as soon as possible:{}:{}", spaceId, event.getOrderId(), e);
        }
        // Send notification
        TaskManager.me().execute(() -> {
            LocalDateTime expireTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(event.getServiceStopTime()),
                    TimeZone.getDefault().toZoneId());
            Long toUserId = iSpaceService.getSpaceOwnerUserId(spaceId);
            NotificationManager.me().sendSocialSubscribeNotify(spaceId, toUserId, LocalDate.from(expireTime),
                    event.getItemName(), event.getPayFee());
        });
        // Save data to data table
        TaskManager.me().execute(() -> saveDingTalkSubscriptionInfo(spaceId, event));

    }

    @Override
    public void handleMarketServiceClosedEvent(SyncHttpMarketServiceCloseEvent event) {
        String tenantKey = event.getCorpId();
        // Get space ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, event.getSuiteId());
        if (StrUtil.isBlank(spaceId)) {
            log.error("Enterprise not authorized:{}", tenantKey);
            return;
        }
        Integer status = iSocialDingTalkRefundService.getStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId());
        // Already handled
        if (SqlHelper.retBool(status)) {
            return;
        }
        // Refund does not exist. Write Ding Talk refund order
        if (null == status) {
            iSocialDingTalkRefundService.createRefund(event);
        }
        try {
            SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(event);
        }
        catch (Exception e) {
            log.error("Failed to process tenant refund, please solve it as soon as possible:{}:{}:{}", spaceId, event.getOrderId(), event.getRefundId(), e);
        }
    }

    private MemberEntity createMember(Long memberId, String spaceId, String memberName, String openId, boolean isAdmin) {
        MemberEntity member = new MemberEntity();
        member.setId(memberId);
        member.setSpaceId(spaceId);
        memberName = StrUtil.isNotBlank(memberName) ? memberName
                : StrUtil.format("星球居民{}", RandomExtendUtil.randomString(4));
        member.setMemberName(memberName);
        member.setOpenId(openId);
        member.setIsAdmin(isAdmin);
        member.setIsActive(false);
        member.setIsPoint(true);
        member.setNameModified(false);
        member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
        member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
        return member;
    }


    private TeamMemberRelEntity createTeamMemberRel(Long teamId, Long memberId) {
        TeamMemberRelEntity teamMemberRel = new TeamMemberRelEntity();
        teamMemberRel.setId(IdWorker.getId());
        teamMemberRel.setMemberId(memberId);
        teamMemberRel.setTeamId(teamId);
        return teamMemberRel;
    }


    private void handleIsvOrgContactData(ContactMeta contactMeta, SpaceContext spaceContext, AuthOrgScopes authScopes) {
        // DingTalk third-party applications do not need to restore the address book department structure, and all are synchronized to the root department
        String suiteId = contactMeta.suiteId;
        String authCorpId = contactMeta.corpId;
        // unionId -> DingTalkUserDto
        HashMap<String, DingTalkUserDto> userMap = iDingTalkInternalIsvService.getAuthCorpUserDetailMap(suiteId,
                authCorpId, authScopes.getAuthedDept(), authScopes.getAuthedUser());
        // When binding for the first time, there is no primary administrator in the visible range, and the primary administrator is empty
        Long rootTeamId = spaceContext.rootTeamId;
        for (DingTalkUserDto userInfo : userMap.values()) {
            handleMember(contactMeta, userInfo, rootTeamId);
        }
    }

    private void handleMember(ContactMeta contactMeta, DingTalkUserDto userInfo, Long parentTeamId) {
        String openId = userInfo.getOpenId();
        if (contactMeta.openIds.contains(openId)) {
            return;
        }
        DingTalkIsvMemberDto dto = contactMeta.openIdMap.get(openId);
        Long memberId;
        // The member in the database does not exist and has not been synchronized. Users can be bound only when they need to log in
        if (ObjectUtil.isNull(dto)) {
            MemberEntity member = createMember(IdWorker.getId(), contactMeta.spaceId, userInfo.getUserName(),
                    openId, contactMeta.authOpenId.equals(openId));
            // Does not exist, does not exist in the map, update member Id
            memberId = member.getId();
            contactMeta.memberEntities.add(member);
            // Department binding. Because administrators can edit departments, only new members will be placed in the root department
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(parentTeamId, memberId));
            contactMeta.openIdMap.put(openId,
                    DingTalkIsvMemberDto.builder().memberId(memberId).openId(openId).isVisible(true).build());
        }
        else {
            // It has been synchronized to determine whether it has been deleted before and recover the data
            memberId = dto.getMemberId();
            if (dto.isDeleted()) {
                contactMeta.recoverMemberIds.add(memberId);
                // Reassociate to the root department
                contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(parentTeamId, memberId));
                dto.setDeleted(false);
            }
            dto.setVisible(true);
            contactMeta.openIdMap.put(openId, dto);
        }
        // Synchronize third-party users and filter users that have been added. Because the test environment has an application bound to multiple spaces, the management of the Ding Talk address book is not done here.
        // Only synchronize when the address book events occur to prevent the deletion of Ding Talk address book users by mistake
        SocialTenantUserDTO tenantUserDTO = contactMeta.tenantUserMap.get(openId);
        if (null == tenantUserDTO) {
            contactMeta.tenantUserEntities.add(SocialFactory.createTenantUser(contactMeta.suiteId, contactMeta.corpId,
                    openId, userInfo.getUnionId()));
            tenantUserDTO = SocialTenantUserDTO.builder().openId(openId).isNew(true).isVisible(true).build();
        }
        else {
            tenantUserDTO.setVisible(true);
        }
        contactMeta.tenantUserMap.put(openId, tenantUserDTO);
        contactMeta.allMemberIds.add(memberId);
        contactMeta.openIds.add(openId);
    }

    private void handleTenantOrders(String tenantKey, String appId) {
        List<String> orderData = iSocialDingTalkOrderService.getOrdersByTenantIdAndAppId(tenantKey, appId);
        if (CollUtil.isEmpty(orderData)) {
            log.warn("No pending DingTalk orders:{}:{}", tenantKey, appId);
        }
        orderData.forEach(data -> {
            SyncHttpMarketOrderEvent event = JSONUtil.toBean(data, SyncHttpMarketOrderEvent.class);
            try {
                handleMarketOrderEvent(event);
            }
            catch (Exception e) {
                log.error("Failed to process Ding Talk list, please solve it quickly:{}:{}", tenantKey, e);
            }
        });
    }

    void saveDingTalkSubscriptionInfo(String spaceId, BaseOrderEvent event) {
        DingTalkSubscriptionInfo info = new DingTalkSubscriptionInfo();
        // Payment scheme for order purchase
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        info.setSpaceId(spaceId);
        info.setSpaceName(iSpaceService.getNameBySpaceId(spaceId));
        if (event.getClass().equals(SyncHttpMarketOrderEvent.class)) {
            info.setOrderType(((SyncHttpMarketOrderEvent) event).getOrderType());
        }
        if (event.getClass().equals(SyncHttpMarketServiceCloseEvent.class)) {
            info.setOrderType(DingTalkOrderType.REFUND_CLOSE.getValue());
        }
        info.setGoodsCode(event.getGoodsCode());
        if (null == price) {
            Plan plan = BillingConfigManager.getFreePlan(ProductChannel.DINGTALK);
            info.setSubscriptionType(plan.getProduct());
            info.setSeat(plan.getSeats());
        }
        else {
            info.setSubscriptionType(price.getProduct());
            info.setSeat(price.getSeat());
        }
        info.setServiceStartTime(event.getServiceStartTime());
        info.setServiceStopTime(event.getServiceStopTime());
        info.setData(JSONUtil.toJsonStr(event));
        VikaFactory.saveDingTalkSubscriptionInfo(info);
    }

    /**
     * Check if the user is in the visible range
     *
     * @param tenantId Enterprise ID
     * @param appId App ID
     * @param  openId User's open ID
     * @return boolean
     */
    private boolean memberVisitable(String tenantId, String appId, String openId) {
        SocialTenantEntity entity = iSocialTenantService.getByAppIdAndTenantId(appId, tenantId);
        OrgSuiteAuthEvent event = JSONUtil.toBean(entity.getAuthInfo(), OrgSuiteAuthEvent.class, true);
        if (event.getAuthScope().getErrcode() != 0) {
            return false;
        }
        AuthOrgScopes scopes = event.getAuthScope().getAuthOrgScopes();
        // Include authorized users
        if (scopes.getAuthedUser().size() > 0 && scopes.getAuthedUser().contains(openId)) {
            return true;
        }
        // Department selected
        if (scopes.getAuthedDept().size() > 0) {
            // All users
            if (scopes.getAuthedDept().contains(ROOT_DEPARTMENT_ID.toString())) {
                return true;
            }
            // Query whether the user is included in the authorized department
            try {
                DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByUserId(appId, tenantId,
                        openId);
                List<String> deptIds = userDetail.getDeptIdList().stream().map(Object::toString).collect(Collectors.toList());
                if (CollUtil.containsAny(scopes.getAuthedDept(), deptIds)) {
                    return true;
                }
            }
            catch (Exception e) {
                log.warn("Failed to query the DingTalk ISV user:" + openId, e);
            }
        }
        return false;
    }

    @Data
    @Builder(toBuilder = true)
    static class DingTalkIsvMemberDto {
        private Long memberId;

        private String openId;

        private boolean isDeleted;

        /**
         * Whether it is in the visible range
         */
        private boolean isVisible;
    }

    @Data
    @Builder(toBuilder = true)
    static class SocialTenantUserDTO {
        private String openId;

        /**
         * New or not, used to send notification messages
         */
        private boolean isNew;

        /**
         * Whether it is in the visible range
         */
        private boolean isVisible;
    }

    class SpaceContext {

        String spaceId;

        String spaceName;

        String spaceLogo;

        Long rootTeamId;

        String oldAdminOpenId;

        String rootNodeId;

        private boolean isCreate;

        public SpaceContext(String spaceId, String spaceName, String spaceLogo) {
            this.spaceId = spaceId;
            this.spaceName = spaceName;
            this.spaceLogo = spaceLogo;
        }

        void prepare() {
            if (StrUtil.isBlank(spaceId)) {
                spaceId = IdUtil.createSpaceId();
                spaceName = spaceName + SPACE_NAME_DEFAULT_SUFFIX;
                // Create root department
                rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
                iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);
                // Create Root Node
                rootNodeId = iNodeService.createChildNode(-1L, CreateNodeDto.builder()
                        .spaceId(spaceId)
                        .newNodeId(IdUtil.createNodeId())
                        .type(NodeType.ROOT.getNodeType()).build());
                isCreate = true;
            }
            else {
                rootTeamId = iTeamService.getRootTeamId(spaceId);
                oldAdminOpenId = getMainAdminOpenId();
            }
        }

        void after(Long owner) {
            if (isCreate) {
                // owner may be null because the main administrator may not be in the visible range, and the api cannot get data
                SpaceEntity space = SocialFactory.createSocialBindBindSpaceInfo(spaceId, spaceName, spaceLogo,
                        null, owner);
                iSpaceService.save(space);
                // Update app market status
                iAppInstanceService.createInstanceByAppType(spaceId, AppType.DINGTALK_STORE.name());
                // Tagged space is synchronizing the address book of the space station
                iSpaceService.setContactSyncing(spaceId, owner.toString());

                // Randomly quote the template of the popular recommended carousel chart in the template center
                String templateNodeId = iTemplateService.getDefaultTemplateNodeId();
                if (StrUtil.isNotBlank(templateNodeId)) {
                    // Transfer node method, including GRPC calls, and place the last
                    iNodeService.copyNodeToSpace(-1L, spaceId, rootNodeId, templateNodeId, NodeCopyOptions.create());
                }
            }
            else {
                if (owner == null) {
                    // The primary administrator is not in the visible range. Set the primary administrator of the space station to null
                    spaceMapper.updateSpaceOwnerId(spaceId, null, null);
                }
                iSpaceService.contactFinished(spaceId);
            }
        }

        String getMainAdminOpenId() {
            Long mainMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
            return memberMapper.selectOpenIdById(mainMemberId);
        }

        List<MemberEntity> getMembers() {
            if (isCreate) {
                return new ArrayList<>();
            }
            else {
                return iMemberService.getMembersBySpaceId(spaceId, true);
            }
        }
    }

    class ContactMeta {
        String spaceId;

        String suiteId;

        String corpId;

        String authOpenId;

        Map<String, DingTalkIsvMemberDto> openIdMap;

        // The existing DingTalk address book users are not deleted when the address book is synchronized.
        // They are synchronized through callback events because the same enterprise user ID is the same
        Map<String, SocialTenantUserDTO> tenantUserMap;

        // ID of the member table corresponding to the open ID in the address book range
        List<Long> allMemberIds = CollUtil.newArrayList();

        // The DingTalk user ID of this synchronization, which is used to send the start message
        Set<String> openIds = CollUtil.newHashSet();

        List<SocialTenantUserEntity> tenantUserEntities = new ArrayList<>();

        List<MemberEntity> memberEntities = new ArrayList<>();

        List<Long> recoverMemberIds = new ArrayList<>();

        List<TeamMemberRelEntity> teamMemberRelEntities = new ArrayList<>();

        ContactMeta(String spaceId, String corpId, String suiteId, String authOpenId) {
            this.spaceId = spaceId;
            this.corpId = corpId;
            this.suiteId = suiteId;
            this.authOpenId = authOpenId;
            this.openIdMap = getMemberOpenIdMap();
            this.tenantUserMap = getSocialTenantUserMap();
        }

        void doSaveOrUpdate() {
            iSocialTenantUserService.createBatch(tenantUserEntities);
            iMemberService.batchCreate(spaceId, memberEntities);
            // Restore Member
            if (!recoverMemberIds.isEmpty()) {
                iMemberService.batchRecoveryMemberFromSpace(spaceId, recoverMemberIds);
            }
            iTeamMemberRelService.createBatch(teamMemberRelEntities);
            // Delete Cache
            userSpaceService.delete(spaceId);
        }

        void deleteMembers() {
            // RemoveMemberIds, the previous member, is calculated and is not in this synchronization range
            List<Long> removeMemberIds =
                    openIdMap.values().stream().filter(i -> !i.isVisible && !i.isDeleted).map(DingTalkIsvMemberDto::getMemberId).collect(Collectors.toList());
            // Old Members are the members to be deleted
            iMemberService.batchDeleteMemberFromSpace(spaceId, removeMemberIds, false);
            // Delete social tenant user
            List<String> openIds =
                    tenantUserMap.values().stream().filter(i -> !i.isVisible).map(SocialTenantUserDTO::getOpenId).collect(Collectors.toList());
            if (!openIds.isEmpty()) {
                iSocialTenantUserService.deleteByTenantIdAndOpenIds(suiteId, corpId, openIds);
            }
        }

        Map<String, DingTalkIsvMemberDto> getMemberOpenIdMap() {
            List<MemberEntity> members = iMemberService.getMembersBySpaceId(spaceId, true);
            return members.stream().filter(i -> StrUtil.isNotBlank(i.getOpenId()))
                    .collect(Collectors.toMap(MemberEntity::getOpenId,
                            dto -> DingTalkIsvMemberDto.builder().memberId(dto.getId()).openId(dto.getOpenId()).isDeleted(dto.getIsDeleted()).build(),
                            (pre, cur) -> !cur.isDeleted() ? cur : pre));
        }

        Map<String, SocialTenantUserDTO> getSocialTenantUserMap() {
            List<String> openIds = iSocialTenantUserService.getOpenIdsByTenantId(suiteId, corpId);
            return openIds.stream().collect(Collectors.toMap(i -> i,
                    i -> SocialTenantUserDTO.builder().openId(i).build(), (pre, cur) -> pre));
        }
    }
}

