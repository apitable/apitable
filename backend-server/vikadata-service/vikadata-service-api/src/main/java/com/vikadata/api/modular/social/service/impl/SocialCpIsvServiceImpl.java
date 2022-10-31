package com.vikadata.api.modular.social.service.impl;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.json.JSONUtil;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts.KefuMsgType;
import me.chanjar.weixin.common.bean.WxAccessToken;
import me.chanjar.weixin.common.error.WxError;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAdmin;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearch;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp.QueryResult;
import me.chanjar.weixin.cp.bean.WxCpTpDepart;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.AuthCorpInfo;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.AuthInfo;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.AuthUserInfo;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.Privilege;
import me.chanjar.weixin.cp.bean.WxCpTpTagGetResult;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.article.MpnewsArticle;
import me.chanjar.weixin.cp.bean.article.NewArticle;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpMessageSendResult;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpContactService;
import me.chanjar.weixin.cp.tp.service.WxCpTpDepartmentService;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.WxCpTpUserService;

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.component.clock.ClockManager;
import com.vikadata.api.enums.exception.BillingException;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.exception.SpaceException;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.model.WeComIsvJsSdkAgentConfigVo;
import com.vikadata.api.modular.social.model.WeComIsvJsSdkConfigVo;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.social.service.ISocialEditionChangelogWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitDelayService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.clock.ClockUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.WxCpIsvTagServiceImpl;
import com.vikadata.social.wecom.WxCpIsvUserServiceImpl;
import com.vikadata.social.wecom.constants.WeComUserStatus;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.event.order.WeComOrderRefundEvent;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvGetOrderList;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;
import com.vikadata.system.config.billing.Plan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.NotificationConstants.EXPIRE_AT;
import static com.vikadata.api.constants.NotificationConstants.PAY_FEE;
import static com.vikadata.api.constants.NotificationConstants.PLAN_NAME;
import static com.vikadata.api.constants.SpaceConstants.SPACE_NAME_DEFAULT_SUFFIX;
import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;
import static com.vikadata.api.enums.exception.OrganizationException.CREATE_MEMBER_ERROR;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider
 * </p>
 */
@Service
@Slf4j
public class SocialCpIsvServiceImpl implements ISocialCpIsvService {

    private static final String KEY_REFRESH_ACCESS_TOKEN = "refreshAccessToken:%s";

    /**
     * "errcode":60011,"errmsg":"no privilege to access/modify contact/party/agent"
     */
    private static final int WX_ERROR_NO_PRIVILEGE = 60011;

    /**
     * "errcode":60111,"errmsg":"invalid string value `woOhr1DQAAT1zD6RszIhFyLvjnNaeRSw`. userid not found"
     */
    private static final int WX_ERROR_INVALID_USER = 60111;

    private static final String WX_MESSAGE_TO_ALL = "@all";

    private static final String WX_JSAPI_TICKET_SIGNATURE_SOURCE = "jsapi_ticket=%s&noncestr=%s&timestamp=%d&url=%s";

    @Resource
    private ConstProperties constProperties;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private IAppInstanceService appInstanceService;

    @Resource
    private IMemberService memberService;

    @Resource
    private INodeService nodeService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialWecomPermitDelayService socialWecomPermitDelayService;

    @Resource
    private ISocialCpTenantUserService socialCpTenantUserService;

    @Resource
    private ISocialCpUserBindService socialCpUserBindService;

    @Resource
    private ISocialEditionChangelogWeComService socialEditionChangelogWeComService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISpaceService spaceService;

    @Resource
    private ITemplateService templateService;

    @Resource
    private ITeamService teamService;

    @Resource
    private ITeamMemberRelService teamMemberRelService;

    @Resource
    private IUnitService unitService;

    @Resource
    private IUserService userService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ISpaceService iSpaceService;

    @Override
    public void refreshAccessToken(String suiteId, String authCorpId, String permanentCode) {
        refreshAccessToken(suiteId, authCorpId, permanentCode, false);
    }

    @Override
    public void refreshAccessToken(String suiteId, String authCorpId, String permanentCode, boolean forceRefresh) {
        WxCpTpService wxCpTpService = weComTemplate.isvService(suiteId);
        @SuppressWarnings("deprecation") // Need to use this object to refresh access_ token
        WxCpTpConfigStorage wxCpTpConfigStorage = wxCpTpService.getWxCpTpConfigStorage();

        boolean isRefresh = false;
        if (!forceRefresh) {
            isRefresh = wxCpTpConfigStorage.isAccessTokenExpired(authCorpId);
        }

        if (isRefresh || forceRefresh) {
            String lockKey = String.format(KEY_REFRESH_ACCESS_TOKEN, authCorpId);
            Lock lock = redisLockRegistry.obtain(lockKey);
            try {
                if (lock.tryLock(1000L, TimeUnit.MILLISECONDS)) {
                    try {
                        WxAccessToken wxAccessToken = wxCpTpService.getCorpToken(authCorpId, permanentCode);
                        wxCpTpConfigStorage.updateAccessToken(authCorpId, wxAccessToken.getAccessToken(), wxAccessToken.getExpiresIn() / 2);

                        log.info(String.format("Enterprise【%s】access_token has been updated, the updated value is：%s",
                                authCorpId, wxAccessToken.getAccessToken()));
                    }
                    finally {
                        lock.unlock();
                    }
                }
            }
            catch (InterruptedException ex) {
                Thread.currentThread().interrupt();

                log.error("[" + authCorpId + "]Tenant access_token operation is too frequent", ex);

                throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
            }
            catch (Exception ex) {
                log.error(String.format("Tenant [%s] get access_ token failed solve it quickly", authCorpId), ex);

                throw new BusinessException(ex);
            }
        }
    }

    @Override
    public WeComIsvJsSdkConfigVo getJsSdkConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException {
        String suiteId = socialTenantEntity.getAppId();
        String authCorpId = socialTenantEntity.getTenantId();

        // If necessary, refresh access first_ token
        refreshAccessToken(suiteId, authCorpId, socialTenantEntity.getPermanentCode());
        // 1 Get the jsapi of the authorized enterprise_ ticket
        String jsApiTicket = weComTemplate.isvService(suiteId).getAuthCorpJsApiTicket(authCorpId);
        // 2 String of spliced signatures
        long timestamp = Instant.now().toEpochMilli();
        String random = UUID.fastUUID().toString(true);
        String source = String.format(WX_JSAPI_TICKET_SIGNATURE_SOURCE, jsApiTicket, random, timestamp, url);
        // 3 Autograph
        String signature = DigestUtil.sha1Hex(source);

        return WeComIsvJsSdkConfigVo.builder()
                .authCorpId(authCorpId)
                .timestamp(timestamp)
                .random(random)
                .signature(signature)
                .build();
    }

    @Override
    public WeComIsvJsSdkAgentConfigVo getJsSdkAgentConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException {
        String suiteId = socialTenantEntity.getAppId();
        String authCorpId = socialTenantEntity.getTenantId();
        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);

        // If necessary, refresh access_token
        refreshAccessToken(suiteId, authCorpId, socialTenantEntity.getPermanentCode());
        // 1 Acquire the authorized enterprise's jsapi_ticket
        String jsApiTicket = weComTemplate.isvService(suiteId).getSuiteJsApiTicket(authCorpId);
        // 2 String of spliced signatures
        long timestamp = Instant.now().toEpochMilli();
        String random = UUID.fastUUID().toString(true);
        String source = String.format(WX_JSAPI_TICKET_SIGNATURE_SOURCE, jsApiTicket, random, timestamp, url);
        // 3 Autograph
        String signature = DigestUtil.sha1Hex(source);

        return WeComIsvJsSdkAgentConfigVo.builder()
                .authCorpId(authCorpId)
                .agentId(agent.getAgentId().toString())
                .timestamp(timestamp)
                .random(random)
                .signature(signature)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createAuthFromPermanentInfo(String suiteId, String authCorpId, WxCpIsvPermanentCodeInfo permanentCodeInfo)
            throws WxErrorException {
        AuthCorpInfo authCorpInfo = permanentCodeInfo.getAuthCorpInfo();
        AuthUserInfo authUserInfo = permanentCodeInfo.getAuthUserInfo();
        WxCpTpPermanentCodeInfo.Agent agent = Optional.ofNullable(permanentCodeInfo.getAuthInfo())
                .map(AuthInfo::getAgents)
                .filter(agents -> !agents.isEmpty())
                .map(agents -> agents.get(0))
                .orElse(null);
        Objects.requireNonNull(authCorpInfo, "AuthCorpInfo cannot be null.");
        Objects.requireNonNull(authUserInfo, "AuthUserInfo cannot be null.");
        Objects.requireNonNull(agent, "Agent cannot be null.");

        // Authorized installation, refresh access_token
        refreshAccessToken(suiteId, authCorpId, permanentCodeInfo.getPermanentCode(), true);
        // 1 Save or update the authorization information of the enterprise
        SocialTenantEntity tenantEntity = SocialTenantEntity.builder()
                .appId(suiteId)
                .appType(SocialAppType.ISV.getType())
                .tenantId(authCorpInfo.getCorpId())
                .contactAuthScope(JSONUtil.toJsonStr(agent))
                .authMode(SocialTenantAuthMode.fromWeCom(agent.getAuthMode()).getValue())
                .permanentCode(permanentCodeInfo.getPermanentCode())
                .authInfo(JSONUtil.toJsonStr(permanentCodeInfo))
                .platform(SocialPlatformType.WECOM.getValue())
                .status(true)
                .build();
        iSocialTenantService.createOrUpdateByTenantAndApp(tenantEntity);
        // 2 Create an enterprise space station
        boolean isNewSpace = false;
        String spaceId = socialTenantBindService.getTenantBindSpaceId(tenantEntity.getTenantId(), tenantEntity.getAppId());
        String rootNodeId = null;
        // At present, each enterprise can only create one third-party service space station and cannot delete it
        if (CharSequenceUtil.isBlank(spaceId)) {
            // 2.1 There is no bound space. Create a new space station
            //TIPS Space default name internationalization configuration
            SpaceEntity spaceEntity = spaceService.createWeComIsvSpaceWithoutUser(authCorpInfo.getCorpName() + SPACE_NAME_DEFAULT_SUFFIX);
            isNewSpace = true;
            spaceId = spaceEntity.getSpaceId();
            // 2.2 Bind the newly created space
            socialTenantBindService.addTenantBind(tenantEntity.getAppId(), tenantEntity.getTenantId(), spaceId);
            // 2.3 Create the root node of the space
            // Creator is empty
            rootNodeId = nodeService.createChildNode(-1L, CreateNodeDto.builder()
                    .spaceId(spaceId)
                    .newNodeId(IdUtil.createNodeId())
                    .type(NodeType.ROOT.getNodeType())
                    .build());
        }
        // 3 Set app market binding status
        appInstanceService.createInstanceByAppType(spaceId, AppType.WECOM_STORE.name());
        // 4 Set the space to synchronizing
        spaceService.setContactSyncing(spaceId, authCorpInfo.getCorpId());
        // 5 Synchronize contacts
        Privilege privilege = agent.getPrivilege();
        List<String> allowUsers = privilege.getAllowUsers();
        List<Integer> allowParties = privilege.getAllowParties();
        List<Integer> allowTags = privilege.getAllowTags();
        syncViewableUsers(suiteId, authCorpInfo.getCorpId(), spaceId,
                allowUsers, allowParties, allowTags);
        // 6 Binding space administrator
        List<MemberEntity> adminMembers = memberService.getAdminListBySpaceId(spaceId);
        if (CollUtil.isEmpty(adminMembers)) {
            // If there is no administrator before, set the administrator
            bindSpaceAdmin(authCorpInfo, authUserInfo, agent, spaceId, suiteId);
        }
        else if (adminMembers.size() > 1) {
            // This method is used to repair the bug of the administrator set before. Normally, there is only one master administrator
            Long ownerMemberId = Optional.ofNullable(spaceService.getBySpaceId(spaceId))
                    .map(SpaceEntity::getOwner)
                    .orElse(null);
            adminMembers.forEach(adminMember -> {
                // Set a non real administrator to false
                if (!adminMember.getId().equals(ownerMemberId)) {
                    memberService.updateById(MemberEntity.builder()
                            .id(adminMember.getId())
                            .isAdmin(false)
                            .build());
                }
            });
        }
        // 7 Set the creator of the space station
        if (isNewSpace) {
            MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, authUserInfo.getUserId());
            if (Objects.nonNull(memberEntity)) {
                SpaceEntity spaceEntity = spaceService.getBySpaceId(spaceId);
                spaceService.updateById(SpaceEntity.builder()
                        .id(spaceEntity.getId())
                        .creator(memberEntity.getId())
                        .build());
            }
        }
        // 8 Release the synchronizing status of the space station
        spaceService.contactFinished(spaceId);
        // 9 Configure billing information
        // Subscription information needs to be processed here only when new tenants are authorized to install
        EditionInfo.Agent editionInfo = SocialFactory.filterWecomEditionAgent(permanentCodeInfo.getEditionInfo());
        if (Objects.nonNull(editionInfo)) {
            String editionId = editionInfo.getEditionId();
            if (WeComPlanConfigManager.isWeComTrialEdition(editionId)) {
                WeComOrderPaidEvent event = SocialFactory.formatWecomTailEditionOrderPaidEvent(suiteId, authCorpId,
                        ClockManager.me().getLocalDateTimeNow(), editionInfo);
                handleTenantPaidSubscribe(suiteId, authCorpId, spaceId, event);
            }
            // Save subscription version information at the same time
            socialEditionChangelogWeComService.createChangelog(suiteId, authCorpId, editionInfo);
        }
        // 9 Send Start Using Message
        WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
        sendWelcomeMessage(tenantEntity, spaceId, wxCpMessage, allowUsers, allowParties, allowTags);
        // 10 Empty temporary cache
        clearCache(authCorpInfo.getCorpId());
        // 11 Clear the space cache
        userSpaceService.delete(spaceId);

        if (rootNodeId == null) {
            return;
        }
        // The new space randomly references the template method, including GRPC calls, and places the last
        String templateNodeId = templateService.getDefaultTemplateNodeId();
        if (CharSequenceUtil.isNotBlank(templateNodeId)) {
            nodeService.copyNodeToSpace(-1L, spaceId, rootNodeId, templateNodeId, NodeCopyOptions.create());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createNewSpace(String suiteId, String authCorpId) {
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getByTenantIdAndAppId(authCorpId, suiteId);
        if (Objects.isNull(tenantBindEntity)) {
            // The tenant needs to have bound space
            throw new BusinessException(SocialException.TENANT_NOT_BIND_SPACE);
        }
        SpaceEntity deletedSpace = spaceService.getBySpaceIdIgnoreDeleted(tenantBindEntity.getSpaceId());
        if (Objects.isNull(deletedSpace)) {
            // The space deleted by the tenant must exist
            throw new BusinessException(SpaceException.SPACE_NOT_EXIST);
        }
        if (Boolean.FALSE.equals(deletedSpace.getIsDeleted())) {
            // Only when the space is deleted can a new space station be created for the tenant
            throw new BusinessException(SpaceException.CREATE_SPACE_ERROR);
        }

        // 1 Remove all members of the old space
        memberService.removeAllMembersBySpaceId(deletedSpace.getSpaceId());
        // 2 Create a new space
        SpaceEntity newSpace = spaceService.createWeComIsvSpaceWithoutUser(deletedSpace.getName());
        // 2.1 Bind the newly created space
        tenantBindEntity.setSpaceId(newSpace.getSpaceId());
        socialTenantBindService.updateById(tenantBindEntity);
        // 2.2 Create the root node of the space
        // Creator is empty
        String rootNodeId = nodeService.createChildNode(-1L, CreateNodeDto.builder()
                .spaceId(newSpace.getSpaceId())
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType())
                .build());
        // 3 Inherit the administrator of the old space station and create member information for it
        Long deletedAdminMemberId = deletedSpace.getOwner();
        MemberEntity deletedAdminMember = Optional.ofNullable(deletedAdminMemberId)
                .map(memberId -> memberService.getByIdIgnoreDelete(memberId))
                .orElse(null);
        if (Objects.nonNull(deletedAdminMember)) {
            syncSingleUser(authCorpId, deletedAdminMember.getOpenId(), suiteId, newSpace.getSpaceId(), true);
        }
        // 5 Empty temporary cache
        clearCache(authCorpId);

        // The new space randomly references the template method, including GRPC calls, and places the last
        String templateNodeId = templateService.getDefaultTemplateNodeId();
        if (CharSequenceUtil.isNotBlank(templateNodeId)) {
            nodeService.copyNodeToSpace(-1L, newSpace.getSpaceId(), rootNodeId, templateNodeId, NodeCopyOptions.create());
        }
    }

    @Override
    public boolean judgeViewable(String corpId, String cpUserId, String suiteId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();

        // 1 Whether it is within the visible range of personnel
        if (CollUtil.contains(allowUsers, cpUserId)) {
            return true;
        }
        // 2 Whether it is within the visible range of the department
        WxCpTpUserService wxCpTpUserService = weComTemplate.isvService(suiteId)
                .getWxCpTpUserService();
        // Use cache to prevent frequent calls to the interface during mass operation of the address book
        String userGetKey = RedisConstants.getWecomIsvContactUserGetKey(corpId);
        WxCpUser wxCpUser = Optional.ofNullable(hashOperations.get(userGetKey, cpUserId))
                .map(string -> JSONUtil.toBean(string, WxCpUser.class))
                .orElse(null);
        if (Objects.isNull(wxCpUser)) {
            try {
                wxCpUser = wxCpTpUserService.getById(cpUserId, corpId);
            }
            catch (WxErrorException ex) {
                int errorCode = Optional.ofNullable(ex.getError())
                        .map(WxError::getErrorCode)
                        .orElse(0);
                if (errorCode == WX_ERROR_NO_PRIVILEGE || errorCode == WX_ERROR_INVALID_USER) {
                    // Error code: 60011, error message：The specified member/department/label parameter has no permission
                    // Error code: 60111, error message: the user does not exist in the address book
                    // It indicates that the user is not in the visible range
                    return false;
                }

                throw ex;
            }
            hashOperations.put(userGetKey, cpUserId, JSONUtil.toJsonStr(wxCpUser));
        }
        // 2.1 Judge whether it belongs to a visible department or a sub department of a visible department
        List<Integer> departmentIds = Optional.ofNullable(wxCpUser.getDepartIds())
                .map(array -> Arrays.stream(array)
                        .map(Long::intValue)
                        .collect(Collectors.toList()))
                .orElse(null);
        if (judgeDepartViewable(suiteId, corpId, allowParties, departmentIds)) {
            return true;
        }
        // 3 Is it within the visible range of the label
        if (CollUtil.isNotEmpty(allowTags)) {
            WxCpIsvTagServiceImpl wxCpTpTagService = (WxCpIsvTagServiceImpl) weComTemplate.isvTagService(suiteId);
            // 3.1 Traverse labels in all visible ranges
            for (Integer allowTag : allowTags) {
                // Use cache to prevent frequent calls to the interface during mass operation of the address book
                String tagGetKey = RedisConstants.getWecomIsvContactTagGetKey(corpId);
                String tagGetHashKey = allowTag.toString();
                WxCpTpTagGetResult tagGetResult = Optional.ofNullable(hashOperations.get(tagGetKey, tagGetHashKey))
                        .map(string -> JSONUtil.toBean(string, WxCpTpTagGetResult.class))
                        .orElse(null);
                if (Objects.isNull(tagGetResult)) {
                    tagGetResult = wxCpTpTagService.get(tagGetHashKey, corpId);
                    hashOperations.put(tagGetKey, tagGetHashKey, JSONUtil.toJsonStr(tagGetResult));
                }
                // 3.1.1 Whether it is in the personnel included in the visible label
                List<String> tagCpUserIds = Optional.ofNullable(tagGetResult.getUserlist())
                        .map(list -> list.stream()
                                .map(WxCpUser::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(null);
                if (CollUtil.contains(tagCpUserIds, cpUserId)) {
                    return true;
                }
                // 3.1.2 Whether it is in the department included in the visible label
                if (judgeDepartViewable(suiteId, corpId, tagGetResult.getPartylist(), departmentIds)) {
                    return true;
                }
            }
        }

        return false;
    }

    @Override
    public void bindSpaceAdmin(String suiteId, String authCorpId, String authCpUserId,
            Integer agentId, Integer authMode, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException {
        SocialTenantAuthMode tenantAuthMode = SocialTenantAuthMode.fromWeCom(authMode);
        if (tenantAuthMode == SocialTenantAuthMode.ADMIN) {
            // 1 The current authorization mode is enterprise administrator authorization
            boolean viewable = judgeViewable(authCorpId, authCpUserId, suiteId,
                    allowUsers, allowParties, allowTags);
            if (viewable) {
                // 1.1 If the currently authorized administrator is within the visible range of the application suite,
                // the administrator will be directly set as the primary administrator of the space station
                syncSingleUser(authCorpId, authCpUserId, suiteId, spaceId, true);
            }
            else {
                // 1.2 If the currently authorized administrator is not within the visible range of the application suite,
                // then judge whether there is anyone in the application administrator list within the visible range
                WxCpTpAdmin admin = weComTemplate.isvService(suiteId).getAdminList(authCorpId, agentId);
                List<String> adminUserIds = Optional.ofNullable(admin.getAdmin())
                        .map(admins -> admins.stream()
                                // Only the application administrator with management permission can be set as the primary administrator of the space station
                                .filter(item -> item.getAuthType() == 1)
                                .map(WxCpTpAdmin.Admin::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());
                for (String adminUserId : adminUserIds) {
                    boolean adminViewable = judgeViewable(authCorpId, adminUserId, suiteId,
                            allowUsers, allowParties, allowTags);
                    if (adminViewable) {
                        // 1.2.1 Set the first person in the administrator list within the visible range as the primary administrator of the space station
                        syncSingleUser(authCorpId, adminUserId, suiteId, spaceId, true);

                        break;
                    }
                }
                // 1.2.2 There is no administrator in the visible range, and the primary administrator is not set at this time.
                // Later, the first member entering the application is set as the primary administrator of the space station
            }
        }
        else if (tenantAuthMode == SocialTenantAuthMode.MEMBER) {
            // 2 If the current authorization mode is member authorization, the first authorized member will be directly set as the master administrator of the space station
            syncSingleUser(authCorpId, authCpUserId, suiteId, spaceId, true);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncViewableUsers(String suiteId, String authCorpId, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException {
        // 1 The existing members need to be removed if they are not in the visible range
        List<Long> deleteMemberIds = Lists.newArrayList();
        boolean isAdminRemoved = false;
        int offset = 0;
        int limit = 100;
        List<MemberEntity> members = memberService.getSocialMemberBySpaceId(spaceId, offset, limit);
        while (CollUtil.isNotEmpty(members)) {
            for (MemberEntity member : members) {
                String cpUserId = member.getOpenId();
                if (CharSequenceUtil.isBlank(cpUserId)) {
                    continue;
                }

                boolean viewable = judgeViewable(authCorpId, cpUserId, suiteId, allowUsers, allowParties, allowTags);
                if (!viewable) {
                    // 1.1 If the member is no longer visible, it needs to be removed
                    deleteMemberIds.add(member.getId());
                    // 1.2 Cancel if it is an administrator
                    if (Boolean.TRUE.equals(member.getIsAdmin())) {
                        isAdminRemoved = true;
                    }
                }
            }

            offset += limit;
            members = memberService.getSocialMemberBySpaceId(spaceId, offset, limit);
        }
        // 1.3 Remove member information in batch
        if (CollUtil.isNotEmpty(deleteMemberIds)) {
            memberService.batchDeleteMemberFromSpace(spaceId, deleteMemberIds, false);
        }
        // 1.4 Remove the administrator on the space station
        if (isAdminRemoved) {
            spaceService.removeMainAdmin(spaceId);
        }
        // 2 Synchronize members in the visible range
        fetchAndBindAllViewableUsers(suiteId, authCorpId, spaceId, allowUsers, allowParties, allowTags);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncSingleUser(String corpId, String cpUserId, String suiteId, String spaceId, boolean isAdmin) {
        // 1 Add space station member information
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            // 1.1 If the user is not a member of the current space station, add
            UserEntity userEntity = Optional.ofNullable(socialCpUserBindService.getUserIdByTenantIdAndAppIdAndCpUserId(corpId, suiteId, cpUserId))
                    .map(userId -> userService.getById(userId))
                    .orElse(null);
            // The number of third-party service providers' space is not limited
            memberEntity = MemberEntity.builder()
                    .spaceId(spaceId)
                    .userId(Objects.isNull(userEntity) ? null : userEntity.getId())
                    // The third-party service provider cannot obtain the user's name, and the openId is used by default
                    .memberName(Objects.isNull(userEntity) ? cpUserId : userEntity.getNickName())
                    .mobile(Objects.isNull(userEntity) ? null : userEntity.getMobilePhone())
                    .email(Objects.isNull(userEntity) ? null : userEntity.getEmail())
                    .openId(cpUserId)
                    .status(UserSpaceStatus.INACTIVE.getStatus())
                    .nameModified(false)
                    .isSocialNameModified(Objects.isNull(userEntity) || !isSocialNameModified(userEntity.getIsSocialNameModified()) ?
                            SocialNameModified.NO.getValue() : SocialNameModified.YES.getValue())
                    .isPoint(true)
                    .position(null)
                    // No matter whether the user has logged in before or not, it will be set to inactive status as long as the user joins again
                    .isActive(false)
                    .isAdmin(isAdmin)
                    .build();
            boolean isMemberSaved = memberService.save(memberEntity);
            ExceptionUtil.isTrue(isMemberSaved, CREATE_MEMBER_ERROR);
            // 1.2 Create member organization unit
            unitService.create(spaceId, UnitType.MEMBER, memberEntity.getId());
            // 1.3 Create root department and member binding
            // When a third-party service provider applies synchronization users, it defaults to the root portal
            Long rootTeamId = teamService.getRootTeamId(spaceId);
            teamMemberRelService.addMemberTeams(Collections.singletonList(memberEntity.getId()), Collections.singletonList(rootTeamId));
            // 1.4 Add to the new member cache list
            String memberNewListKey = RedisConstants.getWecomIsvMemberNewListKey(corpId);
            ListOperations<String, String> listOperations = stringRedisTemplate.opsForList();
            listOperations.rightPush(memberNewListKey, memberEntity.getOpenId());
        }
        // 2 Set this member as the primary administrator of the space
        if (isAdmin) {
            SpaceEntity spaceEntity = spaceService.getBySpaceId(spaceId);
            spaceEntity.setOwner(memberEntity.getId());
            spaceService.updateById(spaceEntity);

            if (Boolean.FALSE.equals(memberEntity.getIsAdmin())) {
                memberService.updateById(MemberEntity.builder()
                        .id(memberEntity.getId())
                        .isAdmin(true)
                        .build());
            }
        }
    }

    @Override
    public void clearCache(String authCorpId) {
        List<String> keys = Arrays.asList(
                RedisConstants.getWecomIsvContactUserGetKey(authCorpId),
                RedisConstants.getWecomIsvContactDepartListKey(authCorpId),
                RedisConstants.getWecomIsvContactTagGetKey(authCorpId),
                RedisConstants.getWecomIsvContactUserSimpleListKey(authCorpId),
                RedisConstants.getWecomIsvMemberNewListKey(authCorpId)
        );
        stringRedisTemplate.delete(keys);
    }

    @Override
    public void sendWelcomeMessage(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers, List<Integer> toParties, List<Integer> toTags)
            throws WxErrorException {
        if (ObjectUtil.hasNull(socialTenantEntity, spaceId)) {
            throw new IllegalArgumentException("Parameter cannot be empty");
        }
        if (Objects.isNull(wxCpMessage)) {
            throw new IllegalArgumentException("The sent message body cannot be empty");
        }

        // If necessary, refresh access_token
        refreshAccessToken(socialTenantEntity.getAppId(), socialTenantEntity.getTenantId(), socialTenantEntity.getPermanentCode());
        // 1 Set the user to send the message
        String users = CollUtil.isEmpty(toUsers) ? null : CollUtil.join(toUsers, "|");
        String parties = CollUtil.isEmpty(toParties) ? null : CollUtil.join(toParties, "|");
        String tags = CollUtil.isEmpty(toTags) ? null : CollUtil.join(toTags, "|");
        if (CharSequenceUtil.isAllBlank(users, parties, tags)) {
            users = WX_MESSAGE_TO_ALL;
        }
        wxCpMessage.setToUser(users);
        wxCpMessage.setToParty(parties);
        wxCpMessage.setToTag(tags);
        // 2 Fill domain name parameter variable
        Dict variable = Dict.create()
                .set("suiteId", socialTenantEntity.getAppId())
                .set("https_enp_domain", constProperties.getServerDomain());
        // 3 Fill domain name
        if (KefuMsgType.NEWS.equals(wxCpMessage.getMsgType())) {
            for (NewArticle article : wxCpMessage.getArticles()) {
                article.setUrl(fillingSendWeComMsgUrl(article.getUrl(), variable));
            }
        }
        else if (KefuMsgType.MPNEWS.equals(wxCpMessage.getMsgType())) {
            for (MpnewsArticle mpnewsArticle : wxCpMessage.getMpnewsArticles()) {
                mpnewsArticle.setContentSourceUrl(fillingSendWeComMsgUrl(mpnewsArticle.getContentSourceUrl(), variable));
            }
        }
        else {
            wxCpMessage.setUrl(fillingSendWeComMsgUrl(wxCpMessage.getUrl(), variable));
        }
        // 4 Send message asynchronously
        TaskManager.me().execute(() -> {
            WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(socialTenantEntity.getAppId());
            try {
                WxCpMessageSendResult sendResult = wxCpTpService.sendMessage(socialTenantEntity.getTenantId(), wxCpMessage);
                log.info("WeCom third-party service provider sends message, parameter{}, Result:{}", wxCpMessage.toJson(), sendResult.toString());
            }
            catch (WxErrorException e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    public void sendWelcomeMessage(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage)
            throws WxErrorException {
        String memberNewListKey = RedisConstants.getWecomIsvMemberNewListKey(socialTenantEntity.getTenantId());
        ListOperations<String, String> listOperations = stringRedisTemplate.opsForList();
        int offset = 0;
        // WeCom can send messages to 1000 users at most at a time
        int size = 1000;
        List<String> cpUserIds = listOperations.range(memberNewListKey, offset, size);
        while (CollUtil.isNotEmpty(cpUserIds)) {
            sendWelcomeMessage(socialTenantEntity, spaceId, wxCpMessage, cpUserIds, null, null);

            offset += cpUserIds.size();
            cpUserIds = listOperations.range(memberNewListKey, offset, size);
        }
    }

    @Override
    public void sendMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers) throws WxErrorException {
        if (ObjectUtil.hasNull(socialTenantEntity, spaceId)) {
            throw new IllegalArgumentException("Parameter cannot be empty");
        }
        if (Objects.isNull(wxCpMessage)) {
            throw new IllegalArgumentException("The sent message body cannot be empty");
        }

        // If necessary, refresh access_token
        refreshAccessToken(socialTenantEntity.getAppId(), socialTenantEntity.getTenantId(), socialTenantEntity.getPermanentCode());
        // 1 Set the user to send the message
        String users = CollUtil.isEmpty(toUsers) ? null : CollUtil.join(toUsers, "|");
        if (CharSequenceUtil.isBlank(users)) {
            users = WX_MESSAGE_TO_ALL;
        }
        wxCpMessage.setToUser(users);
        // 2 Fill domain name parameter variable
        Dict variable = Dict.create()
                .set("suiteId", socialTenantEntity.getAppId())
                .set("https_enp_domain", constProperties.getServerDomain());
        // 3 Fill domain name
        if (KefuMsgType.NEWS.equals(wxCpMessage.getMsgType())) {
            for (NewArticle article : wxCpMessage.getArticles()) {
                article.setUrl(fillingSendWeComMsgUrl(article.getUrl(), variable));
            }
        }
        else if (KefuMsgType.MPNEWS.equals(wxCpMessage.getMsgType())) {
            for (MpnewsArticle mpnewsArticle : wxCpMessage.getMpnewsArticles()) {
                mpnewsArticle.setContentSourceUrl(fillingSendWeComMsgUrl(mpnewsArticle.getContentSourceUrl(), variable));
            }
        }
        else {
            wxCpMessage.setUrl(fillingSendWeComMsgUrl(wxCpMessage.getUrl(), variable));
        }
        // 4 Send message
        WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(socialTenantEntity.getAppId());
        WxCpMessageSendResult sendResult = wxCpTpService.sendMessage(socialTenantEntity.getTenantId(), wxCpMessage);
        log.info("WeCom third-party service provider sends message, parameter{}, Result:{}", wxCpMessage.toJson(), sendResult.toString());
    }

    @Override
    public void sendTemplateMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage, List<String> toUsers) throws WxErrorException {
        if (ObjectUtil.hasNull(socialTenantEntity, spaceId)) {
            throw new IllegalArgumentException("Parameter cannot be empty");
        }
        if (Objects.isNull(wxCpMessage)) {
            throw new IllegalArgumentException("The sent message body cannot be empty");
        }

        // If necessary, refresh access_token
        refreshAccessToken(socialTenantEntity.getAppId(), socialTenantEntity.getTenantId(), socialTenantEntity.getPermanentCode());
        // 1 Set the user to send the message
        String users = CollUtil.isEmpty(toUsers) ? null : CollUtil.join(toUsers, "|");
        wxCpMessage.setToUser(users);
        // 2 Fill domain name parameter variable
        Dict variable = Dict.create()
                .set("suiteId", socialTenantEntity.getAppId())
                .set("https_enp_domain", constProperties.getServerDomain());
        // 3 Fill domain name
        wxCpMessage.setUrl(fillingSendWeComMsgUrl(wxCpMessage.getUrl(), variable));
        // 4 Send message
        WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(socialTenantEntity.getAppId());
        WxCpMessageSendResult sendResult = wxCpTpService.sendMessage(socialTenantEntity.getTenantId(), wxCpMessage);
        log.info("We Com third-party service provider sends message, parameter {}, result:{}", wxCpMessage.toJson(), sendResult.toString());
    }

    @Override
    public QueryResult search(String suiteId, String authCorpId, Integer agentId, String keyword, Integer type) throws WxErrorException {
        WxCpTpContactService wxCpTpContactService = weComTemplate.isvService(suiteId)
                .getWxCpTpContactService();

        WxCpTpContactSearch wxCpTpContactSearch = new WxCpTpContactSearch();
        wxCpTpContactSearch.setAuthCorpId(authCorpId);
        wxCpTpContactSearch.setQueryWord(keyword);
        wxCpTpContactSearch.setType(type);
        wxCpTpContactSearch.setAgentId(agentId);
        wxCpTpContactSearch.setOffset(0);
        wxCpTpContactSearch.setLimit(200);
        QueryResult result = new QueryResult();
        QueryResult.User resultUser = new QueryResult.User();
        resultUser.setUserid(Lists.newArrayListWithCapacity(16));
        resultUser.setOpenUserId(Lists.newArrayListWithCapacity(16));
        result.setUser(resultUser);
        QueryResult.Party resultParty = new QueryResult.Party();
        resultParty.setDepartmentId(Lists.newArrayListWithCapacity(2));
        result.setParty(resultParty);
        boolean hasMore = true;
        while (hasMore) {
            WxCpTpContactSearchResp searchResp = wxCpTpContactService.contactSearch(wxCpTpContactSearch);
            QueryResult queryResult = searchResp.getQueryResult();
            if (Objects.nonNull(queryResult)) {
                QueryResult.User queryResultUser = queryResult.getUser();
                if (Objects.nonNull(queryResultUser)) {
                    result.getUser().getUserid().addAll(queryResultUser.getUserid());
                    result.getUser().getOpenUserId().addAll(queryResultUser.getOpenUserId());
                }
                QueryResult.Party queryResultParty = queryResult.getParty();
                if (Objects.nonNull(queryResultParty)) {
                    result.getParty().getDepartmentId().addAll(queryResultParty.getDepartmentId());
                }
            }

            hasMore = !searchResp.getIsLast();
            wxCpTpContactSearch.setOffset(wxCpTpContactSearch.getOffset() + wxCpTpContactSearch.getLimit());
        }

        return result;
    }

    @Override
    public void handleTenantPaidSubscribe(String suiteId, String authCorpId, String spaceId, WeComOrderPaidEvent paidEvent) {
        // handle wecom paid subscription
        String orderId = SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
        if (orderId != null) {
            SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
        }
        // handle wecom api permit
        // trail order: save api permit trail delay notification
        if (SubscriptionPhase.TRIAL.equals(WeComPlanConfigManager.getSubscriptionPhase(paidEvent.getEditionId()))) {
            socialWecomPermitDelayService.addAuthCorp(suiteId, authCorpId, ClockManager.me().getLocalDateTimeNow(),
                    SocialCpIsvPermitDelayType.NOTIFY_BEFORE_TRIAL_EXPIRED.getValue(),
                    SocialCpIsvPermitDelayProcessStatus.PENDING.getValue());
        }
        else {
            // auto buy api permit
            try {
                socialCpIsvPermitService.autoProcessPermitOrder(suiteId, authCorpId, spaceId);
            }
            catch (Exception ex) {
                log.error("Failed to handle wecom api permit automatically.", ex);
            }
        }
        // send subscription notification
        TaskManager.me().execute(() -> {
            String goodChTitle;
            if (SubscriptionPhase.TRIAL.equals(WeComPlanConfigManager.getSubscriptionPhase(paidEvent.getEditionId()))) {
                Plan plan = WeComPlanConfigManager.getPaidPlanFromWeComTrial();
                goodChTitle = BillingConfigManager.getProductByName(plan.getProduct()).getChName();
            }
            else {
                goodChTitle = Objects.requireNonNull(WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(paidEvent.getEditionId(),
                        paidEvent.getUserCount(), SocialFactory.getWeComOrderMonth(paidEvent.getOrderPeriod()))).getGoodChTitle();
            }
            Long toUserId = iSpaceService.getSpaceOwnerUserId(spaceId);
            NotificationManager.me().sendSocialSubscribeNotify(spaceId, toUserId,
                    ClockUtil.secondToLocalDateTime(paidEvent.getEndTime(), DEFAULT_TIME_ZONE).toLocalDate(),
                    goodChTitle, paidEvent.getPrice().longValue());
        });
    }

    @Override
    public EditionInfo.Agent getCorpEditionInfo(String authCorpId, String suiteId) {
        String permanentCode = iSocialTenantService.getPermanentCodeByAppIdAndTenantId(suiteId, authCorpId);
        if (null == permanentCode) {
            return null;
        }
        // Get and populate app version information
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        try {
            WxCpIsvAuthInfo authInfo = wxCpIsvService.getAuthInfo(authCorpId, permanentCode);
            if (null != authInfo && null != authInfo.getEditionInfo()) {
                return SocialFactory.filterWecomEditionAgent(authInfo.getEditionInfo());
            }
        }
        catch (WxErrorException e) {
            log.warn("get wx auth info error", e);
        }
        return null;
    }

    @Override
    public List<WxCpIsvGetOrder> getOrderList(String suiteId, LocalDateTime startTime) {
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        try {
            WxCpIsvGetOrderList result = wxCpIsvService.getOrderList(startTime.toEpochSecond(DEFAULT_TIME_ZONE),
                    LocalDateTime.now().toEpochSecond(DEFAULT_TIME_ZONE), 0);
            return result.getOrderList().stream().filter(i -> 1 == i.getOrderStatus() || 5 == i.getOrderStatus()).collect(Collectors.toList());
        }
        catch (WxErrorException e) {
            log.warn("get wx order error", e);
            return new ArrayList<>();
        }
    }

    @Override
    public WeComOrderPaidEvent fetchPaidEvent(String suiteId, String orderId) throws WxErrorException {
        // Get the original order information of WeCom
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvGetOrder wxCpIsvGetOrder = wxCpIsvService.getOrder(orderId);
        // Copy Data
        return SocialFactory.formatOrderPaidEventFromWecomOrder(wxCpIsvGetOrder);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateOrderEvent(List<WxCpIsvGetOrder> orders) {
        orders.forEach(i -> {
            if (i.getOrderStatus() == 5) {
                // refund
                WeComOrderRefundEvent refundEvent = new WeComOrderRefundEvent();
                refundEvent.setSuiteId(i.getSuiteId());
                refundEvent.setPaidCorpId(i.getPaidCorpId());
                refundEvent.setOrderId(i.getOrderId());
                SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderRefundEvent(refundEvent);
            }
            // paid
            else if (i.getOrderStatus() == 1) {
                WeComOrderPaidEvent paidEvent = SocialFactory.formatOrderPaidEventFromWecomOrder(i);
                SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(paidEvent);
            }
        });
    }

    /**
     * Synchronize and bind all visible members
     *
     * <p>
     * Need to clear temporary cache
     * </p>
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param spaceId Space ID
     * @param allowUsers WeCom Visible Users
     * @param allowParties Visible department of WeCom
     * @param allowTags WeCom visible label
     * @throws WxErrorException WeCom interface exception
     */
    private void fetchAndBindAllViewableUsers(String suiteId, String authCorpId, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags) throws WxErrorException {
        // 1 Get all members in the visible range first
        List<String> allCpUserIds = Lists.newArrayList();
        // 1.1 Visible Users
        if (CollUtil.isNotEmpty(allowUsers)) {
            allCpUserIds.addAll(allowUsers);
        }
        // 1.2 Visible department
        List<WxCpUser> partyCpUsers = fetchViewableCpUserIdsFromParties(suiteId, authCorpId, allowParties);
        List<String> partyCpUserIds = partyCpUsers.stream()
                .map(WxCpUser::getUserId)
                .collect(Collectors.toList());
        partyCpUsers.clear();
        allCpUserIds.addAll(partyCpUserIds);
        partyCpUserIds.clear();
        // 1.3 Visible label
        if (CollUtil.isNotEmpty(allowTags)) {
            WxCpIsvTagServiceImpl wxCpTpTagService = (WxCpIsvTagServiceImpl) weComTemplate.isvTagService(suiteId);
            for (Integer allowTag : allowTags) {
                WxCpTpTagGetResult tagGetResult = wxCpTpTagService.get(allowTag.toString(), authCorpId);
                // 1.3.1 People included in the visible label
                List<String> tagCpUserIds = Optional.ofNullable(tagGetResult.getUserlist())
                        .map(list -> list.stream()
                                .map(WxCpUser::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());
                allCpUserIds.addAll(tagCpUserIds);
                // 4.2 Departments included in visible labels
                List<Integer> tagParties = tagGetResult.getPartylist();
                List<WxCpUser> tagPartyCpUsers = fetchViewableCpUserIdsFromParties(suiteId, authCorpId, tagParties);
                List<String> tagPartyCpUserIds = tagPartyCpUsers.stream()
                        .map(WxCpUser::getUserId)
                        .collect(Collectors.toList());
                tagPartyCpUsers.clear();
                allCpUserIds.addAll(tagPartyCpUserIds);
                tagPartyCpUserIds.clear();
            }
        }
        if (CollUtil.isEmpty(allCpUserIds)) {
            return;
        }
        // 1.4 Members, departments and labels may be duplicate and need to be removed
        allCpUserIds = allCpUserIds.stream()
                .distinct()
                .collect(Collectors.toList());

        // 2 Process all visible members and extract the members to be added
        List<String> toAddCpUserIds = Lists.newArrayList();
        // 2.1 Batch processing to prevent mass data operation
        List<List<String>> splitCpUserIds = CollUtil.split(allCpUserIds, 500);
        allCpUserIds.clear();
        for (List<String> cpUserIds : splitCpUserIds) {
            // 2.2 Query existing members
            List<MemberEntity> memberEntities = memberService.getBySpaceIdAndOpenIds(spaceId, cpUserIds);
            if (CollUtil.isEmpty(memberEntities)) {
                continue;
            }

            // 2.3 Record the members that do not exist before, and prepare to add
            List<String> existedCpUserIds = memberEntities.stream()
                    .map(MemberEntity::getOpenId)
                    .collect(Collectors.toList());
            List<String> addCpUserIds = cpUserIds.stream()
                    .filter(cpUserId -> !existedCpUserIds.contains(cpUserId))
                    .collect(Collectors.toList());
            toAddCpUserIds.addAll(addCpUserIds);
        }
        if (CollUtil.isEmpty(toAddCpUserIds)) {
            return;
        }

        // 3 New information
        // When a third-party service provider applies synchronization users, it defaults to the root portal
        Long rootTeamId = teamService.getRootTeamId(spaceId);
        // 3.1 Batch processing to prevent mass data operation
        List<List<String>> splitAddCpUserIds = CollUtil.split(toAddCpUserIds, 500);
        toAddCpUserIds.clear();
        for (List<String> addCpUserIds : splitAddCpUserIds) {
            Map<String, UserEntity> cpUserMap = socialCpTenantUserService.getUserByCpUserIds(authCorpId, suiteId, addCpUserIds);
            List<MemberEntity> addMemberEntities = addCpUserIds.stream()
                    .map(addCpUserId -> {
                        UserEntity userEntity = cpUserMap.get(addCpUserId);

                        return MemberEntity.builder()
                                .spaceId(spaceId)
                                .userId(Objects.isNull(userEntity) ? null : userEntity.getId())
                                // The third-party service provider cannot obtain the user name, and the openId is used by default
                                .memberName(Objects.isNull(userEntity) ? addCpUserId : userEntity.getNickName())
                                .mobile(Objects.isNull(userEntity) ? null : userEntity.getMobilePhone())
                                .email(Objects.isNull(userEntity) ? null : userEntity.getEmail())
                                .openId(addCpUserId)
                                .status(UserSpaceStatus.INACTIVE.getStatus())
                                .nameModified(false)
                                .isSocialNameModified(Objects.isNull(userEntity) || !isSocialNameModified(userEntity.getIsSocialNameModified()) ?
                                        SocialNameModified.NO.getValue() : SocialNameModified.YES.getValue())
                                .isPoint(true)
                                .position(null)
                                // No matter whether the user has logged in before or not, it will be set to inactive status as long as the user joins again
                                .isActive(false)
                                .isAdmin(false)
                                .build();
                    }).collect(Collectors.toList());

            // 3.2 Batch save members and create organizational units
            memberService.batchCreate(spaceId, addMemberEntities);
            // 3.3 Create root department and member binding
            List<Long> addMemberIds = addMemberEntities.stream()
                    .map(MemberEntity::getId)
                    .collect(Collectors.toList());
            teamMemberRelService.addMemberTeams(addMemberIds, Collections.singletonList(rootTeamId));
        }
    }

    /**
     * Get all members under the department
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param partyIds Department ID List
     * @return Member List
     */
    private List<WxCpUser> fetchViewableCpUserIdsFromParties(String suiteId, String authCorpId, List<Integer> partyIds) {
        if (CollUtil.isEmpty(partyIds)) {
            return Collections.emptyList();
        }

        WxCpIsvUserServiceImpl wxCpTpUserService = (WxCpIsvUserServiceImpl) weComTemplate.isvService(suiteId)
                .getWxCpTpUserService();
        // Use cache to prevent frequent calls to the interface during mass operation of the address book
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        String userSimpleListKey = RedisConstants.getWecomIsvContactUserSimpleListKey(authCorpId);

        return partyIds.stream()
                .flatMap(partyId -> {
                    String userSimpleListHashKey = partyId.toString();
                    List<WxCpUser> cpUsers = Optional.ofNullable(hashOperations.get(userSimpleListKey, userSimpleListHashKey))
                            .map(string -> JSONUtil.toList(string, WxCpUser.class))
                            .orElse(null);
                    if (CollUtil.isEmpty(cpUsers)) {
                        try {
                            cpUsers = wxCpTpUserService.listSimpleByDepartment(partyId.longValue(), true, WeComUserStatus.ACTIVE.getCode(), authCorpId);
                            hashOperations.put(userSimpleListKey, userSimpleListHashKey, JSONUtil.toJsonStr(cpUsers));
                        }
                        catch (WxErrorException ex) {
                            log.error("Failed to list users by department.", ex);
                        }
                    }
                    if (CollUtil.isEmpty(cpUsers)) {
                        return Stream.empty();
                    }

                    return cpUsers.stream();
                }).collect(Collectors.toList());
    }

    /**
     * Bind the authorized enterprise with the space station
     *
     * @param authCorpInfo Authorized enterprise information
     * @param authUserInfo Authorized user information
     * @param agent Application information
     * @param spaceId Bound space
     * @param appId App Suite ID
     */
    private void bindSpaceAdmin(AuthCorpInfo authCorpInfo, AuthUserInfo authUserInfo, WxCpTpPermanentCodeInfo.Agent agent,
            String spaceId, String appId) throws WxErrorException {
        String corpId = authCorpInfo.getCorpId();
        String authUserId = authUserInfo.getUserId();
        Integer agentId = agent.getAgentId();
        SocialTenantAuthMode authMode = SocialTenantAuthMode.fromWeCom(agent.getAuthMode());
        if (authMode == SocialTenantAuthMode.ADMIN) {
            // 1 The current authorization mode is enterprise administrator authorization
            Privilege privilege = agent.getPrivilege();
            List<String> allowUsers = privilege.getAllowUsers();
            List<Integer> allowParties = privilege.getAllowParties();
            List<Integer> allowTags = privilege.getAllowTags();
            boolean viewable = judgeViewable(corpId, authUserId, appId,
                    allowUsers, allowParties, allowTags);
            if (viewable) {
                // 1.1 If the currently authorized administrator is within the visible range of the application suite,
                // the administrator will be directly set as the primary administrator of the space station
                syncSingleUser(corpId, authUserId, appId, spaceId, true);
            }
            else {
                // 1.2 If the currently authorized administrator is not within the visible range of the application suite,
                // then judge whether there is anyone in the application administrator list within the visible range
                WxCpTpAdmin admin = weComTemplate.isvService(appId).getAdminList(corpId, agentId);
                List<String> adminUserIds = Optional.ofNullable(admin.getAdmin())
                        .map(admins -> admins.stream()
                                // Only the application administrator with management permission can be set as the primary administrator of the space station
                                .filter(item -> item.getAuthType() == 1)
                                .map(WxCpTpAdmin.Admin::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());
                for (String adminUserId : adminUserIds) {
                    boolean adminViewable = judgeViewable(corpId, adminUserId, appId,
                            allowUsers, allowParties, allowTags);
                    if (adminViewable) {
                        // 1.2.1 Set the first person in the administrator list within the visible range as the primary administrator of the space station
                        syncSingleUser(corpId, adminUserId, appId, spaceId, true);

                        break;
                    }
                }
                // 1.2.2 There is no administrator in the visible range, and the primary administrator is not set at this time. Later,
                // the first member entering the application is set as the primary administrator of the space station
            }
        }
        else if (authMode == SocialTenantAuthMode.MEMBER) {
            // 2 If the current authorization mode is member authorization, the first authorized member will be directly set as the master administrator of the space station
            syncSingleUser(corpId, authUserId, appId, spaceId, true);
        }
    }

    /**
     * Judge whether it belongs to a visible department or a sub department of a visible department
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param allowDepartIds Visible department list
     * @param cpDepartIds List of departments to which the user belongs
     * @return Whether it belongs to a visible department or a sub department of a visible department
     */
    private boolean judgeDepartViewable(String suiteId, String authCorpId, List<Integer> allowDepartIds, List<Integer> cpDepartIds)
            throws WxErrorException {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();

        // 1 If the visible department is blank, or the user's department is blank, it will not be visible directly
        if (CollUtil.isEmpty(allowDepartIds) || CollUtil.isEmpty(cpDepartIds)) {
            return false;
        }
        // 2 Judge whether the user's department is directly visible
        if (CollUtil.containsAny(allowDepartIds, cpDepartIds)) {
            return true;
        }
        // 3 Judge whether the user's department is in the sub department of the visible department
        WxCpTpDepartmentService wxCpTpDepartmentService = weComTemplate.isvService(suiteId)
                .getWxCpTpDepartmentService();
        // Use cache to prevent frequent calls to the interface during mass operation of the address book
        String departListKey = RedisConstants.getWecomIsvContactDepartListKey(authCorpId);
        for (Integer allowDepartId : allowDepartIds) {
            // 3.1 Get all the sub departments of the visible department
            String departListHashKey = allowDepartId.toString();
            List<WxCpTpDepart> wxCpTpDeparts = Optional.ofNullable(hashOperations.get(departListKey, departListHashKey))
                    .map(string -> JSONUtil.toList(string, WxCpTpDepart.class))
                    .orElse(null);
            if (Objects.isNull(wxCpTpDeparts)) {
                wxCpTpDeparts = wxCpTpDepartmentService.list(allowDepartId.longValue(), authCorpId);
                hashOperations.put(departListKey, departListHashKey, JSONUtil.toJsonStr(wxCpTpDeparts));
            }

            if (CollUtil.isEmpty(wxCpTpDeparts)) {
                continue;
            }

            List<Integer> allowChildPartIds = wxCpTpDeparts.stream()
                    .map(WxCpTpDepart::getId)
                    .collect(Collectors.toList());
            if (CollUtil.containsAny(allowChildPartIds, cpDepartIds)) {
                // 3.2 Judge whether it is in the sub department of the visible department
                return true;
            }
        }

        return false;
    }

    private String fillingSendWeComMsgUrl(String messageUrl, Dict variable) {
        if (CharSequenceUtil.isBlank(messageUrl)) {
            messageUrl = variable.getStr("https_enp_domain");
        }
        else {
            messageUrl = StrUtil.format(messageUrl, variable);
        }

        return messageUrl;
    }

    /**
     * Change the modified name of the third-party IM to boolean
     *
     * @param isSocialNameModified Original value
     * @return boolean. true：The name has been changed, and component rendering is not required; false； Not renamed, component rendering required
     */
    private boolean isSocialNameModified(Integer isSocialNameModified) {
        return Objects.isNull(isSocialNameModified) || isSocialNameModified != 0;
    }

    /**
     * Send subscription/payment success notification
     *
     * @param spaceId Space ID
     * @param expireAt Expiration time, ms
     * @param productName Product name
     * @param amount Payment amount, in cents
     */
    private void sendSubscribeNotify(String spaceId, Long expireAt, String productName, Long amount) {
        Long toUserId = spaceService.getSpaceOwnerUserId(spaceId);
        if (toUserId != null && amount > 0) {
            // Send payment success notification
            Dict paidExtra = Dict.create().set(PLAN_NAME, productName)
                    .set(EXPIRE_AT, expireAt.toString())
                    .set(PAY_FEE, String.format("¥%.2f", amount.doubleValue() / 100));
            NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_PAID_NOTIFY,
                    Collections.singletonList(toUserId), 0L, spaceId, paidExtra);
        }
        // Send subscription success notification
        Dict subscriptionExtra = Dict.create().set(PLAN_NAME, productName)
                .set(EXPIRE_AT, expireAt.toString());
        NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_SUBSCRIPTION_NOTIFY,
                null, 0L, spaceId, subscriptionExtra);
    }

}
