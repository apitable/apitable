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
import cn.hutool.core.date.DateUtil;
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
import com.vikadata.api.factory.VikaFactory;
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
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.define.enums.NodeType;
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
 * ISV钉钉事件服务接口实现
 * </p>
 * @author zoe zheng
 * @date 2021/9/14 3:36 下午
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
        // 已经存在，并且为启用状态重复
        if (entity != null && entity.getStatus()) {
            return;
        }
        // 检查第三方状态
        TenantInfoResult tenantInfo = iDingTalkInternalIsvService.getSocialTenantInfo(corpId, suiteId);
        // 可能存在重新授权，本地状态为0，新建一个空间进行绑定
        String authUserOpenId = event.getAuthUserInfo().getUserId();
        // 先保存授权人员的信息，初始化空间站然后再同步成员信息
        AuthOrgScopes scopes = new AuthOrgScopes();
        scopes.setAuthedUser(Collections.singletonList(authUserOpenId));
        scopes.setAuthedDept(Collections.emptyList());
        // 初始化一个新空间
        SpaceContext spaceContext = new SpaceContext(null, event.getAuthCorpInfo().getCorpName(),
                event.getAuthCorpInfo().getCorpLogoUrl());
        spaceContext.prepare();
        String spaceId = spaceContext.spaceId;
        ContactMeta contactMeta = new ContactMeta(spaceId, corpId, suiteId, authUserOpenId);
        handleIsvOrgContactData(contactMeta, spaceContext, scopes);
        String agentId = event.getAuthInfo().getAgent().get(0).getAgentid().toString();
        // 在保存前更正agentId
        if (StrUtil.isNotBlank(tenantInfo.getTenantId())) {
            agentId = tenantInfo.getAgentId();
            AuthInfo authInfo = event.getAuthInfo();
            Agent agent = authInfo.getAgent().get(0);
            agent.setAgentid(Long.parseLong(agentId));
            authInfo.setAgent(Collections.singletonList(agent));
            event.setAuthInfo(authInfo);
        }
        // 保存或者更新租户信息
        iSocialTenantService.createOrUpdateWithScope(SocialPlatformType.DINGTALK, SocialAppType.ISV,
                suiteId, corpId, JSONUtil.toJsonStr(scopes), JSONUtil.toJsonStr(event));
        // 绑定租户和此空间站
        iSocialTenantBindService.addTenantBind(suiteId, corpId, spaceId);
        // 保存通讯录信息
        contactMeta.doSaveOrUpdate();
        // 空间的主管理员成员ID（新空间随机引用模板方法，包含GRPC调用，放置最后）
        spaceContext.after(contactMeta.openIdMap.get(authUserOpenId).getMemberId());
        // 如果在授权之前有订单信息，需要补全
        handleTenantOrders(corpId, suiteId);
        // 发送开始使用通知
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
        // 更新租户的变更
        String authUserOpenId = event.getAuthUserInfo().getUserId();
        AuthOrgScopes scopes = event.getAuthScope().getAuthOrgScopes();
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, suiteId);
        // 初始化一个新空间
        SpaceContext spaceContext = new SpaceContext(spaceId, event.getAuthCorpInfo().getCorpName(),
                event.getAuthCorpInfo().getCorpLogoUrl());
        spaceContext.prepare();
        ContactMeta contactMeta = new ContactMeta(spaceId, corpId, suiteId, authUserOpenId);
        handleIsvOrgContactData(contactMeta, spaceContext, scopes);
        // 保存或者更新租户信息
        iSocialTenantService.createOrUpdateWithScope(SocialPlatformType.DINGTALK, SocialAppType.ISV,
                suiteId, corpId, JSONUtil.toJsonStr(scopes), JSONUtil.toJsonStr(event));
        // 保存通讯录信息
        contactMeta.deleteMembers();
        contactMeta.doSaveOrUpdate();
        // 主管理员移出了可见范围
        Long owner = contactMeta.openIds.contains(spaceContext.oldAdminOpenId) ?
                contactMeta.openIdMap.get(spaceContext.oldAdminOpenId).getMemberId() : null;
        // 空间的主管理员成员ID（新空间随机引用模板方法，包含GRPC调用，放置最后）
        spaceContext.after(owner);
        // 发送开始使用通知
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
                // 删除空间的绑定
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
            // 重新开启租户
            iSocialTenantService.updateTenantStatus(suiteId, corpId, true);
            // todo 发送消息卡片
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
            // 更新应用状态
            iSocialTenantService.updateTenantStatus(suiteId, corpId, false);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleUserAddOrgEvent(String openId, BaseOrgUserContactEvent event) {
        // 新版事件
        String tenantKey = event.getCorpId();
        String unionId = event.getUnionid();
        if (!event.getErrcode().equals(0)) {
            log.warn("[正常] - [用户信息有误]:{}:{}:{}", tenantKey, openId, event.getErrmsg());
            handleUserLeaveOrgEvent(openId, BeanUtil.toBean(event, SyncHttpUserLeaveOrgEvent.class));
            return;
        }
        if (StrUtil.isBlank(unionId)) {
            log.warn("[正常] - [用户没有unionId]:{}:{}", tenantKey, openId);
            return;
        }
        String suiteId = event.getSuiteId();
        // 获取当前部门的空间ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, suiteId);
        if (StrUtil.isBlank(spaceId)) {
            log.warn("[正常] - [用户信息发生变化事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        // 员工非激活状态的变化事件信息不处理
        if (!event.getActive()) {
            log.warn("[用户信息发生变化事件]租户「{}」下的用户[{}]未激活，不处理", tenantKey, openId);
            return;
        }
        if (!memberVisitable(tenantKey, suiteId, openId)) {
            log.warn("[用户信息发生变化事件]租户「{}」下的用户[{}]不在可见范围，不处理", tenantKey, openId);
            return;
        }
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, openId);
        if (ObjectUtil.isNull(memberId)) {
            HashMap<String, String> nickNameMap = iSocialUserBindService.getUserNameByUnionIds(Collections.singletonList(unionId));
            // 创建成员
            MemberEntity member = createMember(IdWorker.getId(), spaceId, nickNameMap.get(unionId), openId, false);
            // 创建成员
            iMemberService.batchCreate(spaceId, Collections.singletonList(member));
            // 创建部门关联,直接放入根部门
            Long rootTeamId = iTeamService.getRootTeamId(spaceId);
            iTeamMemberRelService.createBatch(Collections.singletonList(createTeamMemberRel(rootTeamId, member.getId())));
            // 发送开始使用通知
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
        // 获取空间ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, event.getSuiteId());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("[正常] - [用户离职事件]租户「{}」未绑定任何空间", tenantKey);
            return;
        }
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(spaceId, openId);
        if (member != null) {
            if (member.getIsAdmin()) {
                // 离职的成员是主管理员，将空间站主管理员置为null
                spaceMapper.updateSpaceOwnerId(spaceId, null, null);
            }
            // 禁止使用授权登录
            String unionId = iSocialTenantUserService.getUnionIdByOpenId(event.getSuiteId(), tenantKey, openId);
            if (StrUtil.isNotBlank(unionId)) {
                iUserLinkService.deleteBatchOpenId(Collections.singletonList(openId), LinkType.DINGTALK.getType());
            }
            socialTenantUserMapper.deleteByTenantIdAndOpenId(event.getSuiteId(), tenantKey, openId);
            // 移除成员所在空间
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
            log.warn("钉钉订单已经处理:{}", event.getOrderId());
            return;
        }
        // 写入钉钉订单
        if (null == status) {
            iSocialDingTalkOrderService.createOrder(event);
        }
        // 获取空间ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, event.getSuiteId());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("钉钉企业还未收到开通应用事件:{}", event.getCorpId());
            return;
        }
        try {
            String orderId = SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderPaidEvent(event);
            // 同步订单事件
            SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
        }
        catch (Exception e) {
            log.error("处理租户订单失败，请火速解决:{}:{}", spaceId, event.getOrderId(), e);
        }
        // 发送通知
        TaskManager.me().execute(() -> {
            LocalDateTime expireTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(event.getServiceStopTime()),
                    TimeZone.getDefault().toZoneId());
            Long toUserId = iSpaceService.getSpaceOwnerUserId(spaceId);
            NotificationManager.me().sendSocialSubscribeNotify(spaceId, toUserId, LocalDate.from(expireTime),
                    event.getItemName(), event.getPayFee());
        });
        // 保存数据到数表
        TaskManager.me().execute(() -> saveDingTalkSubscriptionInfo(spaceId, event));

    }

    @Override
    public void handleMarketServiceClosedEvent(SyncHttpMarketServiceCloseEvent event) {
        String tenantKey = event.getCorpId();
        // 获取空间ID
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, event.getSuiteId());
        if (StrUtil.isBlank(spaceId)) {
            log.error("企业未授权:{}", tenantKey);
            return;
        }
        Integer status = iSocialDingTalkRefundService.getStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId());
        // 已经处理过了
        if (SqlHelper.retBool(status)) {
            return;
        }
        // 退款不存在，写入钉钉退款订单
        if (null == status) {
            iSocialDingTalkRefundService.createRefund(event);
        }
        try {
            SocialOrderStrategyFactory.getService(SocialPlatformType.DINGTALK).retrieveOrderRefundEvent(event);
        }
        catch (Exception e) {
            log.error("处理租户退款失败，请火速解决:{}:{}:{}", spaceId, event.getOrderId(), event.getRefundId(), e);
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
        // 钉钉第三方应用，无需还原通讯录部门结构，全部同步到根部门
        String suiteId = contactMeta.suiteId;
        String authCorpId = contactMeta.corpId;
        // unionId -> DingTalkUserDto
        HashMap<String, DingTalkUserDto> userMap = iDingTalkInternalIsvService.getAuthCorpUserDetailMap(suiteId,
                authCorpId, authScopes.getAuthedDept(), authScopes.getAuthedUser());
        // 初次绑定，可见范围没有主管理员，主管理员就是空的
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
        // 数据库中的member 不存在,没有同步过，需要登录的时候才绑定用户
        if (ObjectUtil.isNull(dto)) {
            MemberEntity member = createMember(IdWorker.getId(), contactMeta.spaceId, userInfo.getUserName(),
                    openId, contactMeta.authOpenId.equals(openId));
            // 不存在，map中没有，更新memberId
            memberId = member.getId();
            contactMeta.memberEntities.add(member);
            // 部门绑定, 因为管理员可以编辑部门，所以只有新增的成员才会放到根部门
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(parentTeamId, memberId));
            contactMeta.openIdMap.put(openId,
                    DingTalkIsvMemberDto.builder().memberId(memberId).openId(openId).isVisible(true).build());
        }
        else {
            // 已经同步过 判断是否之前删除了，恢复数据
            memberId = dto.getMemberId();
            if (dto.isDeleted()) {
                contactMeta.recoverMemberIds.add(memberId);
                // 重新关联回根部门
                contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(parentTeamId, memberId));
                dto.setDeleted(false);
            }
            dto.setVisible(true);
            contactMeta.openIdMap.put(openId, dto);
        }
        // 同步第三方用户，过滤已经添加过的用户,因为测试环境存在一个应用绑定多个空间的情况,这里不做钉钉通讯录的管理，只有在通讯录事件的
        // 时候进行同步，防止误删钉钉通讯录用户
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
        // 实际上是所有成员
        contactMeta.allMemberIds.add(memberId);
        contactMeta.openIds.add(openId);
    }

    private void handleTenantOrders(String tenantKey, String appId) {
        List<String> orderData = iSocialDingTalkOrderService.getOrdersByTenantIdAndAppId(tenantKey, appId);
        if (CollUtil.isEmpty(orderData)) {
            log.warn("没有待处理的钉钉订单:{}:{}", tenantKey, appId);
        }
        orderData.forEach(data -> {
            SyncHttpMarketOrderEvent event = JSONUtil.toBean(data, SyncHttpMarketOrderEvent.class);
            try {
                handleMarketOrderEvent(event);
            }
            catch (Exception e) {
                log.error("处理钉钉订单失败，请火速解决:{}:{}", tenantKey, e);
            }
        });
    }

    void saveDingTalkSubscriptionInfo(String spaceId, BaseOrderEvent event) {
        DingTalkSubscriptionInfo info = new DingTalkSubscriptionInfo();
        // 订单购买的付费方案
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode(),
                (int) DateUtil.betweenMonth(DateUtil.date(event.getServiceStartTime()), DateUtil.date(event.getServiceStopTime()), false));
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
     * 检查用户是否在可见范围
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param  openId 用户的openId
     * @return boolean
     * @author zoe zheng
     * @date 2022/5/27 15:17
     */
    private boolean memberVisitable(String tenantId, String appId, String openId) {
        SocialTenantEntity entity = iSocialTenantService.getByAppIdAndTenantId(appId, tenantId);
        OrgSuiteAuthEvent event = JSONUtil.toBean(entity.getAuthInfo(), OrgSuiteAuthEvent.class, true);
        if (event.getAuthScope().getErrcode() != 0) {
            return false;
        }
        AuthOrgScopes scopes = event.getAuthScope().getAuthOrgScopes();
        // 包含授权用户
        if (scopes.getAuthedUser().size() > 0 && scopes.getAuthedUser().contains(openId)) {
            return true;
        }
        // 选择了部门
        if (scopes.getAuthedDept().size() > 0) {
            // 全部用户
            if (scopes.getAuthedDept().contains(ROOT_DEPARTMENT_ID.toString())) {
                return true;
            }
            // 查询授权部门下是否包涵此用户
            try {
                DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByUserId(appId, tenantId,
                        openId);
                List<String> deptIds = userDetail.getDeptIdList().stream().map(Object::toString).collect(Collectors.toList());
                if (CollUtil.containsAny(scopes.getAuthedDept(), deptIds)) {
                    return true;
                }
            }
            catch (Exception e) {
                log.warn("查询钉钉ISV用户失败:" + openId, e);
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
         * 是否在可见范围中
         */
        private boolean isVisible;
    }

    @Data
    @Builder(toBuilder = true)
    static class SocialTenantUserDTO {
        private String openId;

        /**
         * 是否新增，用于发送通知消息
         */
        private boolean isNew;

        /**
         * 是否在可见范围中
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
                // 创建根部门
                rootTeamId = iTeamService.createRootTeam(spaceId, spaceName);
                iUnitService.create(spaceId, UnitType.TEAM, rootTeamId);
                // 创建根节点
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
                // owner 可能为null 因为主管理员可能不在可见范围,api无法拿到数据
                SpaceEntity space = SocialFactory.createSocialBindBindSpaceInfo(spaceId, spaceName, spaceLogo,
                        null, owner);
                iSpaceService.save(space);
                // 更新应用市场状态
                iAppInstanceService.createInstanceByAppType(spaceId, AppType.DINGTALK_STORE.name());
                // 标记空间正在同步空间站通讯录
                iSpaceService.setContactSyncing(spaceId, owner.toString());

                // 随机引用模板中心 热门推荐 轮播图的模板
                String templateNodeId = iTemplateService.getDefaultTemplateNodeId();
                if (StrUtil.isNotBlank(templateNodeId)) {
                    // 转存节点方法，包含GRPC调用，放置最后
                    iNodeService.copyNodeToSpace(-1L, spaceId, rootNodeId, templateNodeId, NodeCopyOptions.create());
                }
            }
            else {
                if (owner == null) {
                    // 主管理员不在可见范围，将空间站主管理员置为null
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

        // 已经存在的钉钉通讯录用户, 不在同步通讯录的时候删除，通过回调事件进行同步，因为同一个企业用户ID是一样的
        Map<String, SocialTenantUserDTO> tenantUserMap;

        // 通讯录范围内的openId对应的members表的ID
        List<Long> allMemberIds = CollUtil.newArrayList();

        // 这次同步的钉钉用户ID，用于发送开始使用消息
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
            // 恢复成员
            if (!recoverMemberIds.isEmpty()) {
                iMemberService.batchRecoveryMemberFromSpace(spaceId, recoverMemberIds);
            }
            iTeamMemberRelService.createBatch(teamMemberRelEntities);
            // 删除缓存
            userSpaceService.delete(spaceId);
        }

        void deleteMembers() {
            // 计算出removeMemberIds, 之前的成员，并且不在此次同步范围中
            List<Long> removeMemberIds =
                    openIdMap.values().stream().filter(i -> !i.isVisible && !i.isDeleted).map(DingTalkIsvMemberDto::getMemberId).collect(Collectors.toList());
            // oldMembers就是需要删除的成员
            iMemberService.batchDeleteMemberFromSpace(spaceId, removeMemberIds, false);
            // 删除social tenant user
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

