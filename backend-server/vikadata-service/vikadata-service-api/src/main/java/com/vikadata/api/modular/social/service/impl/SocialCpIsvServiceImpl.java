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
import com.vikadata.api.context.ClockManager;
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
 * 第三方平台集成 - 企业微信第三方服务商
 * </p>
 *
 * @author 刘斌华
 * @date 2022-01-12 11:40:25
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
        @SuppressWarnings("deprecation") // 需要用该对象来刷新 access_token
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

                        log.info(String.format("企业【%s】的 access_token 已更新，更新后的值为：%s",
                                authCorpId, wxAccessToken.getAccessToken()));
                    }
                    finally {
                        lock.unlock();
                    }
                }
            }
            catch (InterruptedException ex) {
                Thread.currentThread().interrupt();

                log.error("[" + authCorpId + "]租户获取 access_token 操作太频繁", ex);

                throw new BusinessException(BillingException.ACCOUNT_CREDIT_ALTER_FREQUENTLY);
            }
            catch (Exception ex) {
                log.error(String.format("租户[%s]获取 access_token 失败,火速解决", authCorpId), ex);

                throw new BusinessException(ex);
            }
        }
    }

    @Override
    public WeComIsvJsSdkConfigVo getJsSdkConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException {
        String suiteId = socialTenantEntity.getAppId();
        String authCorpId = socialTenantEntity.getTenantId();

        // 如果需要，先刷新 access_token
        refreshAccessToken(suiteId, authCorpId, socialTenantEntity.getPermanentCode());
        // 1 获取授权企业的 jsapi_ticket
        String jsApiTicket = weComTemplate.isvService(suiteId).getAuthCorpJsApiTicket(authCorpId);
        // 2 拼接签名的字符串
        long timestamp = Instant.now().toEpochMilli();
        String random = UUID.fastUUID().toString(true);
        String source = String.format(WX_JSAPI_TICKET_SIGNATURE_SOURCE, jsApiTicket, random, timestamp, url);
        // 3 签名
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

        // 如果需要，先刷新 access_token
        refreshAccessToken(suiteId, authCorpId, socialTenantEntity.getPermanentCode());
        // 1 获取授权企业的 jsapi_ticket
        String jsApiTicket = weComTemplate.isvService(suiteId).getSuiteJsApiTicket(authCorpId);
        // 2 拼接签名的字符串
        long timestamp = Instant.now().toEpochMilli();
        String random = UUID.fastUUID().toString(true);
        String source = String.format(WX_JSAPI_TICKET_SIGNATURE_SOURCE, jsApiTicket, random, timestamp, url);
        // 3 签名
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

        // 授权安装，先刷新 access_token
        refreshAccessToken(suiteId, authCorpId, permanentCodeInfo.getPermanentCode(), true);
        // 1 保存企业或者更新企业的授权信息
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
        // 2 创建企业的空间站
        boolean isNewSpace = false;
        String spaceId = socialTenantBindService.getTenantBindSpaceId(tenantEntity.getTenantId(), tenantEntity.getAppId());
        String rootNodeId = null;
        // 目前每个企业只能创建一个第三方服务空间站，也无法删除
        if (CharSequenceUtil.isBlank(spaceId)) {
            // 2.1 没有已绑定的空间站，创建一个新的空间站
            //TIPS 空间站默认名称国际化配置？
            SpaceEntity spaceEntity = spaceService.createWeComIsvSpaceWithoutUser(authCorpInfo.getCorpName() + SPACE_NAME_DEFAULT_SUFFIX);
            isNewSpace = true;
            spaceId = spaceEntity.getSpaceId();
            // 2.2 绑定新创建的空间站
            socialTenantBindService.addTenantBind(tenantEntity.getAppId(), tenantEntity.getTenantId(), spaceId);
            // 2.3 创建空间站的根节点
            // 创建人为空
            rootNodeId = nodeService.createChildNode(-1L, CreateNodeDto.builder()
                    .spaceId(spaceId)
                    .newNodeId(IdUtil.createNodeId())
                    .type(NodeType.ROOT.getNodeType())
                    .build());
        }
        // 3 设置应用市场绑定状态
        appInstanceService.createInstanceByAppType(spaceId, AppType.WECOM_STORE.name());
        // 4 将空间站设置为正在同步状态
        spaceService.setContactSyncing(spaceId, authCorpInfo.getCorpId());
        // 5 同步通讯录
        Privilege privilege = agent.getPrivilege();
        List<String> allowUsers = privilege.getAllowUsers();
        List<Integer> allowParties = privilege.getAllowParties();
        List<Integer> allowTags = privilege.getAllowTags();
        syncViewableUsers(suiteId, authCorpInfo.getCorpId(), spaceId,
                allowUsers, allowParties, allowTags);
        // 6 绑定空间站管理员
        List<MemberEntity> adminMembers = memberService.getAdminListBySpaceId(spaceId);
        if (CollUtil.isEmpty(adminMembers)) {
            // 之前不存在管理员，则设置管理员
            bindSpaceAdmin(authCorpInfo, authUserInfo, agent, spaceId, suiteId);
        }
        else if (adminMembers.size() > 1) {
            // 该方法用于修复之前设置管理员的 BUG，正常只有一个主管理员
            Long ownerMemberId = Optional.ofNullable(spaceService.getBySpaceId(spaceId))
                    .map(SpaceEntity::getOwner)
                    .orElse(null);
            adminMembers.forEach(adminMember -> {
                // 将不是真正的管理员设置为 false
                if (!adminMember.getId().equals(ownerMemberId)) {
                    memberService.updateById(MemberEntity.builder()
                            .id(adminMember.getId())
                            .isAdmin(false)
                            .build());
                }
            });
        }
        // 7 设置空间站创建人
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
        // 8 解除空间站的正在同步状态
        spaceService.contactFinished(spaceId);
        // 9 配置订阅信息
        // 仅新租户授权安装时需要在此处理订阅信息
        EditionInfo.Agent editionInfo = SocialFactory.filterWecomEditionAgent(permanentCodeInfo.getEditionInfo());
        if (Objects.nonNull(editionInfo)) {
            String editionId = editionInfo.getEditionId();
            if (WeComPlanConfigManager.isWeComTrialEdition(editionId)) {
                WeComOrderPaidEvent event = SocialFactory.formatWecomTailEditionOrderPaidEvent(suiteId, authCorpId,
                        ClockManager.me().getLocalDateTimeNow(), editionInfo);
                handleTenantPaidSubscribe(suiteId, authCorpId, spaceId, event);
            }
            // 同时保存订阅版本信息
            socialEditionChangelogWeComService.createChangelog(suiteId, authCorpId, editionInfo);
        }
        // 9 发送开始使用消息
        WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
        sendWelcomeMessage(tenantEntity, spaceId, wxCpMessage, allowUsers, allowParties, allowTags);
        // 10 清空临时缓存
        clearCache(authCorpInfo.getCorpId());
        // 11 清空空间站缓存
        userSpaceService.delete(spaceId);

        if (rootNodeId == null) {
            return;
        }
        // 新空间随机引用模板方法，包含GRPC调用，放置最后
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
            // 租户需要已经绑定了空间
            throw new BusinessException(SocialException.TENANT_NOT_BIND_SPACE);
        }
        SpaceEntity deletedSpace = spaceService.getBySpaceIdIgnoreDeleted(tenantBindEntity.getSpaceId());
        if (Objects.isNull(deletedSpace)) {
            // 租户已删除的空间站需存在
            throw new BusinessException(SpaceException.SPACE_NOT_EXIST);
        }
        if (Boolean.FALSE.equals(deletedSpace.getIsDeleted())) {
            // 空间站已删除才会为租户创建新的空间站
            throw new BusinessException(SpaceException.CREATE_SPACE_ERROR);
        }

        // 1 移除旧空间站的所有成员
        memberService.removeAllMembersBySpaceId(deletedSpace.getSpaceId());
        // 2 创建一个新的空间站
        SpaceEntity newSpace = spaceService.createWeComIsvSpaceWithoutUser(deletedSpace.getName());
        // 2.1 绑定新创建的空间站
        tenantBindEntity.setSpaceId(newSpace.getSpaceId());
        socialTenantBindService.updateById(tenantBindEntity);
        // 2.2 创建空间站的根节点
        // 创建人为空
        String rootNodeId = nodeService.createChildNode(-1L, CreateNodeDto.builder()
                .spaceId(newSpace.getSpaceId())
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType())
                .build());
        // 3 继承旧空间站的管理员，并为其创建成员信息
        Long deletedAdminMemberId = deletedSpace.getOwner();
        MemberEntity deletedAdminMember = Optional.ofNullable(deletedAdminMemberId)
                .map(memberId -> memberService.getByIdIgnoreDelete(memberId))
                .orElse(null);
        if (Objects.nonNull(deletedAdminMember)) {
            syncSingleUser(authCorpId, deletedAdminMember.getOpenId(), suiteId, newSpace.getSpaceId(), true);
        }
        // 5 清空临时缓存
        clearCache(authCorpId);

        // 新空间随机引用模板方法，包含GRPC调用，放置最后
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

        // 1 是否在人员可见范围内
        if (CollUtil.contains(allowUsers, cpUserId)) {
            return true;
        }
        // 2 是否在部门可见范围内
        WxCpTpUserService wxCpTpUserService = weComTemplate.isvService(suiteId)
                .getWxCpTpUserService();
        // 使用缓存，防止通讯录大批量操作时频繁调用接口
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
                    // 错误代码：60011，错误信息：指定的成员/部门/标签参数无权限
                    // 错误代码：60111，错误信息：用户不存在通讯录中
                    // 说明该用户不在可见范围
                    return false;
                }

                throw ex;
            }
            hashOperations.put(userGetKey, cpUserId, JSONUtil.toJsonStr(wxCpUser));
        }
        // 2.1 判断是否属于可见部门或者可见部门的子部门
        List<Integer> departmentIds = Optional.ofNullable(wxCpUser.getDepartIds())
                .map(array -> Arrays.stream(array)
                        .map(Long::intValue)
                        .collect(Collectors.toList()))
                .orElse(null);
        if (judgeDepartViewable(suiteId, corpId, allowParties, departmentIds)) {
            return true;
        }
        // 3 是否在标签可见范围内
        if (CollUtil.isNotEmpty(allowTags)) {
            WxCpIsvTagServiceImpl wxCpTpTagService = (WxCpIsvTagServiceImpl) weComTemplate.isvTagService(suiteId);
            // 3.1 遍历所有可见范围的标签
            for (Integer allowTag : allowTags) {
                // 使用缓存，防止通讯录大批量操作时频繁调用接口
                String tagGetKey = RedisConstants.getWecomIsvContactTagGetKey(corpId);
                String tagGetHashKey = allowTag.toString();
                WxCpTpTagGetResult tagGetResult = Optional.ofNullable(hashOperations.get(tagGetKey, tagGetHashKey))
                        .map(string -> JSONUtil.toBean(string, WxCpTpTagGetResult.class))
                        .orElse(null);
                if (Objects.isNull(tagGetResult)) {
                    tagGetResult = wxCpTpTagService.get(tagGetHashKey, corpId);
                    hashOperations.put(tagGetKey, tagGetHashKey, JSONUtil.toJsonStr(tagGetResult));
                }
                // 3.1.1 是否在可见标签包含的人员中
                List<String> tagCpUserIds = Optional.ofNullable(tagGetResult.getUserlist())
                        .map(list -> list.stream()
                                .map(WxCpUser::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(null);
                if (CollUtil.contains(tagCpUserIds, cpUserId)) {
                    return true;
                }
                // 3.1.2 是否在可见标签包含的部门中
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
            // 1 当前授权模式为企业管理员授权
            boolean viewable = judgeViewable(authCorpId, authCpUserId, suiteId,
                    allowUsers, allowParties, allowTags);
            if (viewable) {
                // 1.1 当前授权的管理员在应用套件的可见范围内，则直接将该管理员设置为空间站的主管理员
                syncSingleUser(authCorpId, authCpUserId, suiteId, spaceId, true);
            }
            else {
                // 1.2 当前授权的管理员不在应用套件的可见范围内，则判断应用管理员列表中是否有人在可见范围内
                WxCpTpAdmin admin = weComTemplate.isvService(suiteId).getAdminList(authCorpId, agentId);
                List<String> adminUserIds = Optional.ofNullable(admin.getAdmin())
                        .map(admins -> admins.stream()
                                // 拥有管理权限的应用管理员才可以设置为空间站主管理员
                                .filter(item -> item.getAuthType() == 1)
                                .map(WxCpTpAdmin.Admin::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());
                for (String adminUserId : adminUserIds) {
                    boolean adminViewable = judgeViewable(authCorpId, adminUserId, suiteId,
                            allowUsers, allowParties, allowTags);
                    if (adminViewable) {
                        // 1.2.1 将可见范围内管理员列表中的第一个人设置为空间站主管理员
                        syncSingleUser(authCorpId, adminUserId, suiteId, spaceId, true);

                        break;
                    }
                }
                // 1.2.2 可见范围内没有管理员，此时不设置主管理员，后续将第一个进入应用的成员设置为空间站主管理员
            }
        }
        else if (tenantAuthMode == SocialTenantAuthMode.MEMBER) {
            // 2 当前授权模式为成员授权，则直接将该第一个授权成员设置为空间站主管理员
            syncSingleUser(authCorpId, authCpUserId, suiteId, spaceId, true);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncViewableUsers(String suiteId, String authCorpId, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException {
        // 1 已存在的成员如果不在可见范围内则需要移除
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
                    // 1.1 成员若已不在可见范围，则需要移除
                    deleteMemberIds.add(member.getId());
                    // 1.2 如果是管理员则取消
                    if (Boolean.TRUE.equals(member.getIsAdmin())) {
                        isAdminRemoved = true;
                    }
                }
            }

            offset += limit;
            members = memberService.getSocialMemberBySpaceId(spaceId, offset, limit);
        }
        // 1.3 批量移除成员信息
        if (CollUtil.isNotEmpty(deleteMemberIds)) {
            memberService.batchDeleteMemberFromSpace(spaceId, deleteMemberIds, false);
        }
        // 1.4 移除空间站上的管理员
        if (isAdminRemoved) {
            spaceService.removeMainAdmin(spaceId);
        }
        // 2 同步可见范围内的成员
        fetchAndBindAllViewableUsers(suiteId, authCorpId, spaceId, allowUsers, allowParties, allowTags);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void syncSingleUser(String corpId, String cpUserId, String suiteId, String spaceId, boolean isAdmin) {
        // 1 添加空间站成员信息
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            // 1.1 该用户不是当前空间站的成员，则新增
            UserEntity userEntity = Optional.ofNullable(socialCpUserBindService.getUserIdByTenantIdAndAppIdAndCpUserId(corpId, suiteId, cpUserId))
                    .map(userId -> userService.getById(userId))
                    .orElse(null);
            // 第三方服务商空间站不受数量限制
            memberEntity = MemberEntity.builder()
                    .spaceId(spaceId)
                    .userId(Objects.isNull(userEntity) ? null : userEntity.getId())
                    // 第三方服务商无法获取用户名称，默认使用 openId 替代
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
                    // 无论用户之前是否登录过，只要重新加入就设置为未激活状态
                    .isActive(false)
                    .isAdmin(isAdmin)
                    .build();
            boolean isMemberSaved = memberService.save(memberEntity);
            ExceptionUtil.isTrue(isMemberSaved, CREATE_MEMBER_ERROR);
            // 1.2 创建成员组织单元
            unitService.create(spaceId, UnitType.MEMBER, memberEntity.getId());
            // 1.3 创建根部门与成员绑定
            // 第三方服务商应用同步用户时默认在根部门下
            Long rootTeamId = teamService.getRootTeamId(spaceId);
            teamMemberRelService.addMemberTeams(Collections.singletonList(memberEntity.getId()), Collections.singletonList(rootTeamId));
            // 1.4 添加到新增成员缓存列表
            String memberNewListKey = RedisConstants.getWecomIsvMemberNewListKey(corpId);
            ListOperations<String, String> listOperations = stringRedisTemplate.opsForList();
            listOperations.rightPush(memberNewListKey, memberEntity.getOpenId());
        }
        // 2 将该成员设置为空间站的主管理员
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
            throw new IllegalArgumentException("参数不能为空");
        }
        if (Objects.isNull(wxCpMessage)) {
            throw new IllegalArgumentException("发送的消息体不能为空");
        }

        // 如果需要，先刷新 access_token
        refreshAccessToken(socialTenantEntity.getAppId(), socialTenantEntity.getTenantId(), socialTenantEntity.getPermanentCode());
        // 1 设置消息要发送的用户
        String users = CollUtil.isEmpty(toUsers) ? null : CollUtil.join(toUsers, "|");
        String parties = CollUtil.isEmpty(toParties) ? null : CollUtil.join(toParties, "|");
        String tags = CollUtil.isEmpty(toTags) ? null : CollUtil.join(toTags, "|");
        if (CharSequenceUtil.isAllBlank(users, parties, tags)) {
            users = WX_MESSAGE_TO_ALL;
        }
        wxCpMessage.setToUser(users);
        wxCpMessage.setToParty(parties);
        wxCpMessage.setToTag(tags);
        // 2 填充域名参数变量
        Dict variable = Dict.create()
                .set("suiteId", socialTenantEntity.getAppId())
                .set("https_enp_domain", constProperties.getServerDomain());
        // 3 填充域名
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
        // 4 发送消息，异步发送
        TaskManager.me().execute(() -> {
            WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(socialTenantEntity.getAppId());
            try {
                WxCpMessageSendResult sendResult = wxCpTpService.sendMessage(socialTenantEntity.getTenantId(), wxCpMessage);
                log.info("企业微信第三方服务商发送消息，参数{}，结果：{}", wxCpMessage.toJson(), sendResult.toString());
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
        // 企业微信发送消息，单次最多可以给 1000 个用户发送消息
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
            throw new IllegalArgumentException("参数不能为空");
        }
        if (Objects.isNull(wxCpMessage)) {
            throw new IllegalArgumentException("发送的消息体不能为空");
        }

        // 如果需要，先刷新 access_token
        refreshAccessToken(socialTenantEntity.getAppId(), socialTenantEntity.getTenantId(), socialTenantEntity.getPermanentCode());
        // 1 设置消息要发送的用户
        String users = CollUtil.isEmpty(toUsers) ? null : CollUtil.join(toUsers, "|");
        if (CharSequenceUtil.isBlank(users)) {
            users = WX_MESSAGE_TO_ALL;
        }
        wxCpMessage.setToUser(users);
        // 2 填充域名参数变量
        Dict variable = Dict.create()
                .set("suiteId", socialTenantEntity.getAppId())
                .set("https_enp_domain", constProperties.getServerDomain());
        // 3 填充域名
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
        // 4 发送消息
        WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(socialTenantEntity.getAppId());
        WxCpMessageSendResult sendResult = wxCpTpService.sendMessage(socialTenantEntity.getTenantId(), wxCpMessage);
        log.info("企业微信第三方服务商发送消息，参数{}，结果：{}", wxCpMessage.toJson(), sendResult.toString());
    }

    @Override
    public void sendTemplateMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage, List<String> toUsers) throws WxErrorException {
        if (ObjectUtil.hasNull(socialTenantEntity, spaceId)) {
            throw new IllegalArgumentException("参数不能为空");
        }
        if (Objects.isNull(wxCpMessage)) {
            throw new IllegalArgumentException("发送的消息体不能为空");
        }

        // 如果需要，先刷新 access_token
        refreshAccessToken(socialTenantEntity.getAppId(), socialTenantEntity.getTenantId(), socialTenantEntity.getPermanentCode());
        // 1 设置消息要发送的用户
        String users = CollUtil.isEmpty(toUsers) ? null : CollUtil.join(toUsers, "|");
        wxCpMessage.setToUser(users);
        // 2 填充域名参数变量
        Dict variable = Dict.create()
                .set("suiteId", socialTenantEntity.getAppId())
                .set("https_enp_domain", constProperties.getServerDomain());
        // 3 填充域名
        wxCpMessage.setUrl(fillingSendWeComMsgUrl(wxCpMessage.getUrl(), variable));
        // 4 发送消息
        WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(socialTenantEntity.getAppId());
        WxCpMessageSendResult sendResult = wxCpTpService.sendMessage(socialTenantEntity.getTenantId(), wxCpMessage);
        log.info("企业微信第三方服务商发送消息，参数{}，结果：{}", wxCpMessage.toJson(), sendResult.toString());
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
        // 获取企业微信的原始订单信息
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvGetOrder wxCpIsvGetOrder = wxCpIsvService.getOrder(orderId);
        // 复制数据
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
     * 同步并绑定所有可见成员
     *
     * <p>
     * 需要清空临时缓存
     * </p>
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID
     * @param allowUsers 企业微信可见用户
     * @param allowParties 企业微信可见部门
     * @param allowTags 企业微信可见标签
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-04-13 17:36:12
     */
    private void fetchAndBindAllViewableUsers(String suiteId, String authCorpId, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags) throws WxErrorException {
        // 1 先获取可见范围下的所有成员
        List<String> allCpUserIds = Lists.newArrayList();
        // 1.1 可见用户
        if (CollUtil.isNotEmpty(allowUsers)) {
            allCpUserIds.addAll(allowUsers);
        }
        // 1.2 可见部门
        List<WxCpUser> partyCpUsers = fetchViewableCpUserIdsFromParties(suiteId, authCorpId, allowParties);
        List<String> partyCpUserIds = partyCpUsers.stream()
                .map(WxCpUser::getUserId)
                .collect(Collectors.toList());
        partyCpUsers.clear();
        allCpUserIds.addAll(partyCpUserIds);
        partyCpUserIds.clear();
        // 1.3 可见标签
        if (CollUtil.isNotEmpty(allowTags)) {
            WxCpIsvTagServiceImpl wxCpTpTagService = (WxCpIsvTagServiceImpl) weComTemplate.isvTagService(suiteId);
            for (Integer allowTag : allowTags) {
                WxCpTpTagGetResult tagGetResult = wxCpTpTagService.get(allowTag.toString(), authCorpId);
                // 1.3.1 可见标签包含的人员
                List<String> tagCpUserIds = Optional.ofNullable(tagGetResult.getUserlist())
                        .map(list -> list.stream()
                                .map(WxCpUser::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());
                allCpUserIds.addAll(tagCpUserIds);
                // 4.2 可见标签包含的部门
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
        // 1.4 成员、部门、标签中可能重复，需要去重
        allCpUserIds = allCpUserIds.stream()
                .distinct()
                .collect(Collectors.toList());

        // 2 处理所有可见成员，提取出需要新增的成员
        List<String> toAddCpUserIds = Lists.newArrayList();
        // 2.1 分批处理，防止大批量数据操作
        List<List<String>> splitCpUserIds = CollUtil.split(allCpUserIds, 500);
        allCpUserIds.clear();
        for (List<String> cpUserIds : splitCpUserIds) {
            // 2.2 查询已存在的成员
            List<MemberEntity> memberEntities = memberService.getBySpaceIdAndOpenIds(spaceId, cpUserIds);
            if (CollUtil.isEmpty(memberEntities)) {
                continue;
            }

            // 2.3 记录之前不存在的成员，准备新增
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

        // 3 新增信息
        // 第三方服务商应用同步用户时默认在根部门下
        Long rootTeamId = teamService.getRootTeamId(spaceId);
        // 3.1 分批处理，防止大批量数据操作
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
                                // 第三方服务商无法获取用户名称，默认使用 openId 替代
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
                                // 无论用户之前是否登录过，只要重新加入就设置为未激活状态
                                .isActive(false)
                                .isAdmin(false)
                                .build();
                    }).collect(Collectors.toList());

            // 3.2 批量保存成员，并创建组织单元
            memberService.batchCreate(spaceId, addMemberEntities);
            // 3.3 创建根部门与成员绑定
            List<Long> addMemberIds = addMemberEntities.stream()
                    .map(MemberEntity::getId)
                    .collect(Collectors.toList());
            teamMemberRelService.addMemberTeams(addMemberIds, Collections.singletonList(rootTeamId));
        }
    }

    /**
     * 获取部门下的所有成员
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param partyIds 部门 ID 列表
     * @return 成员列表
     * @author 刘斌华
     * @date 2022-04-13 16:21:34
     */
    private List<WxCpUser> fetchViewableCpUserIdsFromParties(String suiteId, String authCorpId, List<Integer> partyIds) {
        if (CollUtil.isEmpty(partyIds)) {
            return Collections.emptyList();
        }

        WxCpIsvUserServiceImpl wxCpTpUserService = (WxCpIsvUserServiceImpl) weComTemplate.isvService(suiteId)
                .getWxCpTpUserService();
        // 使用缓存，防止通讯录大批量操作时频繁调用接口
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
     * 将授权企业与空间站绑定
     *
     * @param authCorpInfo 授权的企业信息
     * @param authUserInfo 授权的用户信息
     * @param agent 应用信息
     * @param spaceId 绑定的空间站
     * @param appId 应用套件 ID
     * @author 刘斌华
     * @date 2022-01-07 14:48:09
     */
    private void bindSpaceAdmin(AuthCorpInfo authCorpInfo, AuthUserInfo authUserInfo, WxCpTpPermanentCodeInfo.Agent agent,
            String spaceId, String appId) throws WxErrorException {
        String corpId = authCorpInfo.getCorpId();
        String authUserId = authUserInfo.getUserId();
        Integer agentId = agent.getAgentId();
        SocialTenantAuthMode authMode = SocialTenantAuthMode.fromWeCom(agent.getAuthMode());
        if (authMode == SocialTenantAuthMode.ADMIN) {
            // 1 当前授权模式为企业管理员授权
            Privilege privilege = agent.getPrivilege();
            List<String> allowUsers = privilege.getAllowUsers();
            List<Integer> allowParties = privilege.getAllowParties();
            List<Integer> allowTags = privilege.getAllowTags();
            boolean viewable = judgeViewable(corpId, authUserId, appId,
                    allowUsers, allowParties, allowTags);
            if (viewable) {
                // 1.1 当前授权的管理员在应用套件的可见范围内，则直接将该管理员设置为空间站的主管理员
                syncSingleUser(corpId, authUserId, appId, spaceId, true);
            }
            else {
                // 1.2 当前授权的管理员不在应用套件的可见范围内，则判断应用管理员列表中是否有人在可见范围内
                WxCpTpAdmin admin = weComTemplate.isvService(appId).getAdminList(corpId, agentId);
                List<String> adminUserIds = Optional.ofNullable(admin.getAdmin())
                        .map(admins -> admins.stream()
                                // 拥有管理权限的应用管理员才可以设置为空间站主管理员
                                .filter(item -> item.getAuthType() == 1)
                                .map(WxCpTpAdmin.Admin::getUserId)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());
                for (String adminUserId : adminUserIds) {
                    boolean adminViewable = judgeViewable(corpId, adminUserId, appId,
                            allowUsers, allowParties, allowTags);
                    if (adminViewable) {
                        // 1.2.1 将可见范围内管理员列表中的第一个人设置为空间站主管理员
                        syncSingleUser(corpId, adminUserId, appId, spaceId, true);

                        break;
                    }
                }
                // 1.2.2 可见范围内没有管理员，此时不设置主管理员，后续将第一个进入应用的成员设置为空间站主管理员
            }
        }
        else if (authMode == SocialTenantAuthMode.MEMBER) {
            // 2 当前授权模式为成员授权，则直接将该第一个授权成员设置为空间站主管理员
            syncSingleUser(corpId, authUserId, appId, spaceId, true);
        }
    }

    /**
     * 判断是否属于可见部门或者可见部门的子部门
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param allowDepartIds 可见的部门列表
     * @param cpDepartIds 用户所属的部门列表
     * @return 是否属于可见部门或者可见部门的子部门
     * @author 刘斌华
     * @date 2022-01-18 18:17:36
     */
    private boolean judgeDepartViewable(String suiteId, String authCorpId, List<Integer> allowDepartIds, List<Integer> cpDepartIds)
            throws WxErrorException {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();

        // 1 可见部门为空，或者用户所属的部门为空，则直接不可见
        if (CollUtil.isEmpty(allowDepartIds) || CollUtil.isEmpty(cpDepartIds)) {
            return false;
        }
        // 2 判断用户所属的部门是否直接可见
        if (CollUtil.containsAny(allowDepartIds, cpDepartIds)) {
            return true;
        }
        // 3 判断用户所属的部门是否在可见部门的子部门中
        WxCpTpDepartmentService wxCpTpDepartmentService = weComTemplate.isvService(suiteId)
                .getWxCpTpDepartmentService();
        // 使用缓存，防止通讯录大批量操作时频繁调用接口
        String departListKey = RedisConstants.getWecomIsvContactDepartListKey(authCorpId);
        for (Integer allowDepartId : allowDepartIds) {
            // 3.1 获取可见部门的所有子部门
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
                // 3.2 判断是否在可见部门的子部门中
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
     * 将第三方 IM 修改名称转为 boolean
     *
     * @param isSocialNameModified 原值
     * @return boolean。true：已改名，不需要组件渲染；false；未改名，需要组件渲染
     */
    private boolean isSocialNameModified(Integer isSocialNameModified) {
        return Objects.isNull(isSocialNameModified) || isSocialNameModified != 0;
    }

    /**
     * 发送订阅/支付成功通知
     *
     * @param spaceId 空间ID
     * @param expireAt 过期时间，毫秒
     * @param productName 产品名称
     * @param amount 支付金额，单位分
     * @author zoe zheng
     * @date 2022/3/1 15:13
     */
    private void sendSubscribeNotify(String spaceId, Long expireAt, String productName, Long amount) {
        Long toUserId = spaceService.getSpaceOwnerUserId(spaceId);
        if (toUserId != null && amount > 0) {
            // 发送支付成功通知
            Dict paidExtra = Dict.create().set(PLAN_NAME, productName)
                    .set(EXPIRE_AT, expireAt.toString())
                    .set(PAY_FEE, String.format("¥%.2f", amount.doubleValue() / 100));
            NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_PAID_NOTIFY,
                    Collections.singletonList(toUserId), 0L, spaceId, paidExtra);
        }
        // 发送订阅成功通知
        Dict subscriptionExtra = Dict.create().set(PLAN_NAME, productName)
                .set(EXPIRE_AT, expireAt.toString());
        NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_SUBSCRIPTION_NOTIFY,
                null, 0L, spaceId, subscriptionExtra);
    }

}
