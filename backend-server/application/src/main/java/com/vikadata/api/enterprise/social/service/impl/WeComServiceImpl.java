package com.vikadata.api.enterprise.social.service.impl;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.map.CaseInsensitiveMap;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts.KefuMsgType;
import me.chanjar.weixin.common.bean.menu.WxMenu;
import me.chanjar.weixin.common.bean.menu.WxMenuButton;
import me.chanjar.weixin.common.error.WxError;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpDepartmentService;
import me.chanjar.weixin.cp.api.WxCpOAuth2Service;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.WxCpUserService;
import me.chanjar.weixin.cp.bean.WxCpAgent;
import me.chanjar.weixin.cp.bean.WxCpAgent.User;
import me.chanjar.weixin.cp.bean.WxCpDepart;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.article.MpnewsArticle;
import me.chanjar.weixin.cp.bean.article.NewArticle;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpMessageSendResult;

import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.enterprise.social.factory.SocialFactory;
import com.vikadata.api.enterprise.social.mapper.SocialTenantDomainMapper;
import com.vikadata.api.enterprise.social.mapper.SocialTenantMapper;
import com.vikadata.api.enterprise.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.enterprise.social.model.TenantBindDTO;
import com.vikadata.api.enterprise.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.enterprise.social.model.TenantMemberDto;
import com.vikadata.api.enterprise.social.model.WeComCreateTempConfigResult;
import com.vikadata.api.enterprise.social.model.WeComDepartTree;
import com.vikadata.api.workspace.enums.PermissionException;
import com.vikadata.api.space.enums.SpaceException;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.space.model.SpaceGlobalFeature;
import com.vikadata.api.enterprise.social.vo.SocialTenantEnvVo;
import com.vikadata.api.enterprise.social.vo.SocialTenantEnvVo.WeComEnv;
import com.vikadata.api.enterprise.social.vo.WeComBindConfigVo;
import com.vikadata.api.enterprise.appstore.enums.AppType;
import com.vikadata.api.enterprise.appstore.service.IAppInstanceService;
import com.vikadata.api.organization.factory.OrganizationFactory;
import com.vikadata.api.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.ITeamMemberRelService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.event.wecom.WeComCardFactory;
import com.vikadata.api.enterprise.social.service.ISocialCpTenantUserService;
import com.vikadata.api.enterprise.social.service.ISocialCpUserBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDomainService;
import com.vikadata.api.enterprise.social.service.IWeComService;
import com.vikadata.api.enterprise.social.service.impl.WeComServiceImpl.CahceWeComTeamLinkVikaTeam.SyncOperation;
import com.vikadata.api.space.service.ISpaceRoleService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.tree.v2.NotRelyTryTreeBuildFactory;
import com.vikadata.core.support.tree.v2.TreeUtil;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantDomainEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.social.wecom.WeComConfig;
import com.vikadata.social.wecom.WeComConfig.InitMenu;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.constants.WeComConstants;
import com.vikadata.social.wecom.constants.WeComUserStatus;
import com.vikadata.social.wecom.model.CheckEnpApiResponse;
import com.vikadata.social.wecom.model.WeComAppVisibleScope;
import com.vikadata.social.wecom.model.WeComAuthInfo;
import com.vikadata.social.wecom.model.WeComAuthInfo.AgentInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enterprise.social.enums.SocialException.AGENT_CONFIG_DISABLE;
import static com.vikadata.api.enterprise.social.enums.SocialException.GET_AGENT_CONFIG_ERROR;
import static com.vikadata.api.enterprise.social.enums.SocialException.TENANT_APP_BIND_INFO_NOT_EXISTS;
import static com.vikadata.api.enterprise.social.enums.SocialException.UNBOUND_WECOM;
import static com.vikadata.api.enterprise.social.enums.SocialException.USER_NOT_EXIST;

/**
 * <p>
 * WeCom service interface implementation
 * </p>
 */
@Slf4j
@Service
public class WeComServiceImpl implements IWeComService {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private SocialTenantMapper socialTenantMapper;

    @Resource
    private SocialTenantDomainMapper socialTenantDomainMapper;

    @Resource
    private ISocialTenantDomainService iSocialTenantDomainService;

    @Resource
    private ISocialCpTenantUserService iSocialCpTenantUserService;

    @Resource
    private ISocialTenantDepartmentService iSocialTenantDepartmentService;

    @Resource
    private ISocialTenantDepartmentBindService iSocialTenantDepartmentBindService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialCpUserBindService iSocialCpUserBindService;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private ObjectMapper objectMapper;

    private static final int TIMEOUT = 2;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WeComCreateTempConfigResult createTempAgentAuthConfig(String corpId, Integer agentId, String agentSecret, String spaceId, boolean isAutoCreateTempDomain) {
        log.info("Create WeCom binding temporary authorization configuration");
        Duration timeout = Duration.ofHours(TIMEOUT).plusSeconds(RandomUtil.randomLong(60, 360));
        WxCpAgent corpAgent = this.getCorpAgentByTempAuth(corpId, agentId, agentSecret, timeout);
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("WeCom application「%s」not enabled", corpAgent.getName()));
        }
        WeComCreateTempConfigResult result = new WeComCreateTempConfigResult();
        WeComAuthInfo weComAuthInfo = new WeComAuthInfo()
                .setCorpId(corpId)
                .setAgentId(agentId)
                .setAgentSecret(agentSecret)
                .setClose(corpAgent.getClose());
        // Assign application authorization information
        AgentInfo agentInfo = new AgentInfo();
        BeanUtil.copyProperties(corpAgent, agentInfo, CopyOptions.create().ignoreError());
        weComAuthInfo.setAgentInfo(agentInfo);

        // Generate the unique identifier of temporary configuration sha for subsequent process identification
        String configSha = SecureUtil.sha1(String.format("%s-%s", corpId, agentId));
        String domainName = null;
        // Whether to automatically apply for the exclusive domain name of We Com
        if (isAutoCreateTempDomain) {
            // Apply for enterprise domain name
            ApplyEnpDomainResult applyResult = this.applyEnpDomain(spaceId);
            domainName = applyResult.getApplyFullDomainName();
        }
        // Save to cache
        String key = weComTemplate.getCacheConfigKeyPrefix(true).concat(configSha);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(key);
        ops.set(weComAuthInfo, timeout);
        return result.setConfigSha(configSha).setDomainName(domainName);
    }

    @Override
    public WeComAuthInfo getConfigSha(String configSha) {
        log.info("Get temporary configuration of We Com and configure SHA:{}", configSha);
        if (StrUtil.isBlank(configSha)) {
            return null;
        }
        String key = weComTemplate.getCacheConfigKeyPrefix(true).concat(configSha);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(key);
        Object config = ops.get();
        if (Objects.isNull(config)) {
            return null;
        }
        return (WeComAuthInfo) ops.get();
    }

    @Override
    public void removeTempConfig(String configSha) {
        log.info("Remove the temporary configuration of We Com and configure SHA:{}", configSha);
        String key = weComTemplate.getCacheConfigKeyPrefix(true).concat(configSha);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(key);
        Object config = ops.get();
        if (Objects.isNull(config)) {
            return;
        }
        String corpId = ((WeComAuthInfo) config).getCorpId();
        Integer agentId = ((WeComAuthInfo) config).getAgentId();
        redisTemplate.delete(key);
        weComTemplate.removeCpServicesByTempAuth(weComTemplate.mergeKey(corpId, agentId));
    }

    @Override
    public WeComBindConfigVo getTenantBindWeComConfig(String spaceId) {
        log.info("Get the space「{}」bind WeCom configuration", spaceId);
        // Query binding information according to the space
        SpaceBindTenantInfoDTO spaceBindTenantInfo = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, SocialPlatformType.WECOM, WeComAuthInfo.class);
        ExceptionUtil.isNotNull(spaceBindTenantInfo, UNBOUND_WECOM);
        ExceptionUtil.isNotNull(spaceBindTenantInfo.getAuthInfo(), GET_AGENT_CONFIG_ERROR);
        ExceptionUtil.isTrue(spaceBindTenantInfo.getStatus(), AGENT_CONFIG_DISABLE);
        // Bind the domain name according to the space
        String domainNameBySpace = iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, false);
        WeComAuthInfo authInfo = (WeComAuthInfo) spaceBindTenantInfo.getAuthInfo();

        WeComBindConfigVo result = new WeComBindConfigVo();
        result.setCorpId(spaceBindTenantInfo.getTenantId());
        result.setAgentId(Integer.valueOf(spaceBindTenantInfo.getAppId()));
        result.setAgentSecret(authInfo.getAgentSecret());
        result.setDomainName(domainNameBySpace);
        result.setAgentStatu(authInfo.getClose());
        return result;
    }

    @Override
    public WxCpUser getWeComUserByOAuth2Code(String corpId, Integer agentId, String code, boolean isTempAuth) {
        log.info("OAuth2 get We Com member information, apply「corpId:{} / agentId:{}」，TempAuth pattern:{}", corpId, agentId, isTempAuth);
        // Toggle Context
        this.switchoverWeComTemplate(corpId, agentId, isTempAuth);
        WxCpOAuth2Service oAuth2Service = weComTemplate.oAuth2Service();
        try {
            String userId = oAuth2Service.getUserInfo(code).getUserId();
            return this.getWeComUserByWeComUserId(corpId, agentId, userId, isTempAuth);
        }
        catch (WxErrorException e) {
            WxError error = e.getError();
            if (null != error) {
                if (error.getErrorCode() == 40029) {
                    throw new BusinessException("Invalid CODE code");
                }
            }
            throw new RuntimeException("Exception in obtaining user information of WeCom application: ", e);
        }
        finally {
            // Close Service
            weComTemplate.closeService();
        }
    }

    @Override
    public WxCpUser getWeComUserByWeComUserId(String corpId, Integer agentId, String weComUserId, boolean isTempAuth) {
        log.info("Get apps「corpId:{} / agentId:{}」Member「{}」information,TempAuth pattern:{}", corpId, agentId, weComUserId, isTempAuth);
        // Toggle Context
        this.switchoverWeComTemplate(corpId, agentId, isTempAuth);
        WxCpUserService userService = weComTemplate.userService();
        try {
            return userService.getById(weComUserId);
        }
        catch (WxErrorException e) {
            WxError error = e.getError();
            if (null != error) {
                int errorCode = error.getErrorCode();
                if (errorCode == 60011 || errorCode == 60111) {
                    throw new BusinessException(USER_NOT_EXIST);
                }
            }
            throw new RuntimeException("Exception in obtaining user information of WeCom application:", e);
        }
        finally {
            // Close Service
            weComTemplate.closeService();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Set<String> weComAppBindSpace(String corpId, Integer agentId, String spaceId, WeComAuthInfo agentConfig) {
        if (weComTemplate == null) {
            throw new BusinessException("WeCom is not enabled");
        }
        // The vika user ID of the binding operation
        Long bindUserId = agentConfig.getOperatingBindUserId();
        log.info("Space「{}」bind WeCom, operating user:{}", spaceId, bindUserId);
        // WeCom user's id of the binding operation (WeCom user's id of the main administrator)
        String mainAdminWeComUserId = agentConfig.getOperatingBindWeComUserId();
        // WeCom user information of binding operation
        WxCpUser bindWeComUser = agentConfig.getOperatingBindWeComUser();
        ExceptionUtil.isTrue(Objects.nonNull(bindWeComUser) && StrUtil.isNotBlank(bindWeComUser.getUserId()), USER_NOT_EXIST);
        // Primary administrator user ID of the space
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        // Check whether the space master administrator
        ExceptionUtil.isTrue(mainAdminUserId.equals(bindUserId), SpaceException.NOT_SPACE_MAIN_ADMIN);
        // Root organization ID of the binding space
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // Primary administrator member ID of the space (old)
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);

        // Application visible range
        WeComAppVisibleScope visibleScopes = this.getAppVisibleScopes(corpId, agentId, true);
        // Switch service context
        this.switchoverWeComTemplate(corpId, agentId, true);

        ContactMeta currentSyncContactMeta = new ContactMeta(spaceId, corpId, String.valueOf(agentId), rootTeamId, mainAdminMemberId);
        // Since binding will not create a member, here we simulate adding an association
        CahceWeComUserLinkVikaMember mainAdminWeComLinkVikaMember = CahceWeComUserLinkVikaMember.builder().memberId(mainAdminMemberId)
                .memberName("").openId(mainAdminWeComUserId)
                .oldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(mainAdminMemberId)))
                .isNew(true).isCurrentSync(true).build();
        currentSyncContactMeta.weComUserToVikaMemberMap.put(mainAdminWeComUserId, mainAdminWeComLinkVikaMember);

        // Sync WeCom Contacts
        currentSyncContactMeta = this.incrementSyncWeComContact(currentSyncContactMeta, visibleScopes);
        // Delete all sub administrators
        iSpaceRoleService.deleteBySpaceId(spaceId);

        // Get a new master administrator of the space(new)
        Long bindCpTenantUserId = currentSyncContactMeta.syncedWeComUserIdsByTenant.get(mainAdminWeComUserId);
        ExceptionUtil.isNotNull(bindCpTenantUserId, PermissionException.SET_MAIN_ADMIN_FAIL);
        // Bind the space member to WeCom User
        this.bindSpaceMemberToSocialTenantUser(mainAdminMemberId, bindUserId, bindCpTenantUserId, mainAdminWeComUserId);

        // When the space is bound for the first time, increase the binding
        iSocialTenantBindService.addTenantBind(String.valueOf(agentId), corpId, spaceId);
        // There is no enterprise application information, it needs to be created. If it has been deactivated, it needs to be updated
        this.createOrUpdateTenant(corpId, String.valueOf(agentId), true, visibleScopes, agentConfig);
        // Change the global status of the space (application and invitation are prohibited)
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().joinable(false).invitable(false).build();
        iSpaceService.switchSpacePros(bindUserId, spaceId, feature);
        // Update app market status
        iAppInstanceService.createInstanceByAppType(spaceId, AppType.WECOM.name());
        // Effective domain name
        iSocialTenantDomainService.enabledDomain(spaceId);
        // Delete temporary binding configuration
        String configSha = SecureUtil.sha1(String.format("%s-%s", corpId, agentId));
        this.removeTempConfig(configSha);
        return currentSyncContactMeta.currentSyncWeComUserIds;
    }

    @Override
    public Set<String> weComRefreshContact(String corpId, Integer agentId, String spaceId, Long operatingUserId) {
        if (weComTemplate == null) {
            throw new BusinessException("WeCom is not enabled");
        }
        log.info("Space「{}」refresh address book, operating user:{}", spaceId, operatingUserId);
        // Primary administrator user ID of the space
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        // Check whether the space master administrator
        ExceptionUtil.isTrue(mainAdminUserId.equals(operatingUserId), SpaceException.NOT_SPACE_MAIN_ADMIN);
        // Primary administrator member ID of the space (old)
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        // The administrator of the space corresponds to the OPEN ID (old)
        String mainAdminOpenId = iMemberService.getOpenIdByMemberId(mainAdminMemberId);
        // Check whether there is a visible area for the main administrator to bind WeChat members
        getWeComUserByWeComUserId(corpId, agentId, mainAdminOpenId);
        // Root organization ID of the binding space
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // Application visible range
        WeComAppVisibleScope visibleScopes = this.getAppVisibleScopes(corpId, agentId, false);
        // Switch service context
        this.switchoverWeComTemplate(corpId, agentId, false);

        ContactMeta currentSyncContactMeta = new ContactMeta(spaceId, corpId, String.valueOf(agentId), rootTeamId, mainAdminMemberId);
        // Initialize master administrator information
        CahceWeComUserLinkVikaMember mainAdminWeComLinkVikaMember = CahceWeComUserLinkVikaMember.builder().memberId(mainAdminMemberId)
                .memberName("").openId(mainAdminOpenId)
                .oldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(mainAdminMemberId)))
                .isNew(false).isCurrentSync(true).build();
        currentSyncContactMeta.weComUserToVikaMemberMap.put(mainAdminOpenId, mainAdminWeComLinkVikaMember);

        // Sync WeCom Contacts
        currentSyncContactMeta = this.incrementSyncWeComContact(currentSyncContactMeta, visibleScopes);

        // Limit on number of inspectors
        // long defaultMaxMemberCount = iSubscriptionService.getPlanSeats(spaceId);
        // ExceptionUtil.isTrue(currentSyncContactMeta.syncedWeComUserIdsByTenant.size() <= defaultMaxMemberCount, SubscribeFunctionException.MEMBER_LIMIT);
        // Update enterprise application information
        this.createOrUpdateTenant(corpId, String.valueOf(agentId), true, visibleScopes, null);
        return currentSyncContactMeta.currentSyncWeComUserIds;
    }

    @Override
    public void sendMessageToUserPrivate(String corpId, Integer agentId, String spaceId, List<String> toUsers, WxCpMessage message) {
        log.info("Send WeCom message push");
        if (ObjectUtil.hasNull(corpId, agentId, spaceId)) {
            log.warn("WeCom message push「{}」incomplete parameters", message.getMsgType());
            return;
        }
        String touser = CollUtil.isEmpty(toUsers) ? "@all" : CollUtil.join(toUsers, "|");
        try {
            if (null != message) {
                this.switchoverWeComTemplate(corpId, agentId, false);
                String domainNameCarryHttps = iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, true);
                message.setToUser(touser);
                // Fill domain name parameter variable
                Dict variable = Dict.create()
                        .set("corpId", corpId)
                        .set("agentId", agentId)
                        .set("https_enp_domain", domainNameCarryHttps);
                // Fill domain name
                if (KefuMsgType.NEWS.equals(message.getMsgType())) {
                    for (NewArticle article : message.getArticles()) {
                        article.setUrl(this.fillingSendWeComMsgUrl(article.getUrl(), variable));
                    }
                }
                else if (KefuMsgType.MPNEWS.equals(message.getMsgType())) {
                    for (MpnewsArticle mpnewsArticle : message.getMpnewsArticles()) {
                        mpnewsArticle.setContentSourceUrl(this.fillingSendWeComMsgUrl(mpnewsArticle.getContentSourceUrl(), variable));
                    }
                }
                else {
                    message.setUrl(this.fillingSendWeComMsgUrl(message.getUrl(), variable));
                }
                WxCpMessageSendResult sendResult = weComTemplate.messageService().send(message);
                if (log.isDebugEnabled()) {
                    log.debug("WeCom sends application message results:{}", sendResult);
                }
            }
        }
        catch (WxErrorException e) {
            log.error("WeCom failed to send the application message:", e);
        }
        finally {
            // Close Service
            weComTemplate.closeService();
        }
    }

    @Override
    public void createFixedMenu(String corpId, Integer agentId, String spaceId) {
        log.info("Space「{}」complete the integration of We Com and create a fixed menu", spaceId);
        this.switchoverWeComTemplate(corpId, agentId, false);
        try {
            weComTemplate.menuService().create(agentId, this.createWeComMenu(corpId, agentId, spaceId));
        }
        catch (WxErrorException e) {
            log.error("WeCom「{}-{}-{}」Failed to create menu:", corpId, agentId, spaceId, e);
        }
        finally {
            weComTemplate.closeService();
        }
    }

    @Override
    public WxCpAgent getCorpAgent(String corpId, Integer agentId, boolean isTempAuth) {
        log.info("Get apps「corpId:{} / agentId:{}」information,TempAuth pattern:{}", corpId, agentId, isTempAuth);
        // Toggle Context
        this.switchoverWeComTemplate(corpId, agentId, isTempAuth);
        return this.getCorpAgentByCpService(weComTemplate.openService());
    }

    @Override
    public SocialTenantEnvVo getWeComTenantEnv(String requestHost) {
        log.info("Exclusive domain name「{}」get environment configuration", requestHost);
        SocialTenantEnvVo result = null;
        // Query the space ID corresponding to the domain name
        String spaceId = socialTenantDomainMapper.selectSpaceIdByDomainName(requestHost);
        if (StrUtil.isNotBlank(spaceId)) {
            result = new SocialTenantEnvVo();
            // At present, the query environment can only be used by integrating WeCom. Here, we only query WeCom
            SpaceBindTenantInfoDTO dto = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, SocialPlatformType.WECOM, null);
            if (null != dto) {
                Dict envs = Dict.create()
                        .set(StrUtil.lowerFirst(WeComEnv.class.getSimpleName()), WeComEnv.builder().corpId(dto.getTenantId()).agentId(dto.getAppId()).enabled(dto.getStatus()).build());

                result.setEnvs(envs);
            }
            result.setDomainName(requestHost);
        }
        return result;
    }

    @Override
    public String getVikaWeComAppId() {
        if (null == weComTemplate || null == weComTemplate.getConfig()) {
            return "";
        }
        return weComTemplate.getConfig().getVikaWeComAppId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void stopWeComApp(String spaceId) {
        log.info("Space「{}」Stop WeCom integration", spaceId);
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        ExceptionUtil.isNotNull(bindInfo, TENANT_APP_BIND_INFO_NOT_EXISTS);
        String tenantId = bindInfo.getTenantId();
        String appId = bindInfo.getAppId();

        // Delete the tenant's department records and bindings to prevent multiple applications from being deleted by mistake
        iSocialTenantDepartmentService.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // Delete the user record of the tenant and delete the association
        iSocialCpTenantUserService.batchDeleteByCorpAgent(tenantId, appId);
        // Delete space binding
        iSocialTenantBindService.removeBySpaceId(spaceId);
        // Deactivate app
        socialTenantMapper.setTenantStop(appId, tenantId);
        // Invitable status of all members of the recovery space (synchronize the default configuration of the startup space)
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
    }

    /**
     * Switch switchoverToTempAuth
     * Only responsible for switching contexts, not creating contexts
     *
     * @param corpId                Enterprise Id
     * @param agentId               Enterprise Application Id
     * @param switchoverToTempAuth  Whether to switch to temporary authorization
     */
    private void switchoverWeComTemplate(String corpId, Integer agentId, boolean switchoverToTempAuth) {
        if (null == weComTemplate) {
            throw new BusinessException("WeCom is not enabled");
        }
        if (log.isDebugEnabled()) {
            log.debug("Switch WeCom service context, application「corpId:{} / agentId:{}」，TempAuth pattern:{}", corpId, agentId, switchoverToTempAuth);
        }
        if (switchoverToTempAuth) {
            weComTemplate.switchoverTo(corpId, agentId, true);
        }
        else {
            weComTemplate.switchoverTo(corpId, agentId);
        }
    }

    /**
     * Use the temporary authorization service Api to obtain the application information of WeCom
     *
     * @param corpId            Enterprise Id
     * @param agentId           Enterprise Application Id
     * @param agentSecret       Enterprise Application Key
     * @param authEffectiveTime Valid time of authorization
     * @return Enterprise application information
     */
    private WxCpAgent getCorpAgentByTempAuth(String corpId, Integer agentId, String agentSecret, Duration authEffectiveTime) {
        if (weComTemplate == null) {
            throw new BusinessException("WeCom is not enabled");
        }
        WxCpService tempAuthService = weComTemplate.addService(corpId, agentId, agentSecret, true, authEffectiveTime.toMillis());
        return this.getCorpAgentByCpService(tempAuthService);
    }

    /**
     * Obtain the application information of WeCom according to Api service
     *
     * @param wxCpService   WeCom api Service
     * @return Enterprise application information
     */
    private WxCpAgent getCorpAgentByCpService(WxCpService wxCpService) {
        if (weComTemplate == null) {
            throw new BusinessException("WeCom is not enabled");
        }
        String corpId = wxCpService.getWxCpConfigStorage().getCorpId();
        Integer agentId = wxCpService.getWxCpConfigStorage().getAgentId();
        try {
            WxCpAgent wxAgent = wxCpService.getAgentService().get(agentId);
            if (null == wxAgent || wxAgent.getErrCode() != 0) {
                throw new BusinessException("WeCom application configuration is abnormal, please check the configuration");
            }
            else {
                return wxAgent;
            }
        }
        catch (WxErrorException e) {
            // An error occurred removing the temporary authorization cache
            weComTemplate.removeCpServicesByTempAuth(weComTemplate.mergeKey(corpId, agentId));
            WxError error = e.getError();
            if (null != error) {
                switch (error.getErrorCode()) {
                    case 40001:
                        throw new BusinessException(error.getErrorCode(), "Illegal secret parameter");
                    case 40013:
                        throw new BusinessException(error.getErrorCode(), "Illegal Corp ID");
                    case 301002:
                        throw new BusinessException(error.getErrorCode(), "No permission to operate the specified application");
                    default:
                        throw new BusinessException("WeCom application configuration is abnormal, please check the configuration");
                }
            }
            throw new RuntimeException("WeCom abnormal certificate matching:", e);
        }
        finally {
            // Close Service
            weComTemplate.closeService();
        }
    }

    /**
     * Apply for enterprise exclusive domain name
     *
     * @param spaceId   Space ID
     * @return Exclusive enterprise domain name
     */
    private ApplyEnpDomainResult applyEnpDomain(String spaceId) {
        SocialTenantDomainEntity tenantDomain = socialTenantDomainMapper.selectBySpaceId(spaceId);
        try {
            // Apply for full domain name
            String applyFullDomainName;
            // Apply for domain name prefix
            String applyDomainPrefix;
            // Apply for enterprise domain name template
            String applyEnpDomainTemplate = weComTemplate.getConfig().getOperateEnpDdns().getApplyEnpDomainTemplate();

            if (null == tenantDomain || StrUtil.isBlank(tenantDomain.getDomainName())) {
                // There is no authorized domain name in history. The domain name is automatically created and verified to be duplicate
                String toLC = spaceId.toLowerCase();
                applyDomainPrefix = String.format(applyEnpDomainTemplate, toLC);
                int num = socialTenantDomainMapper.countTenantDomainName(toLC);
                if (num > 0) {
                    // Duplicate domain names are automatically added with 1 for differentiation
                    applyDomainPrefix = String.format(applyEnpDomainTemplate, toLC.concat(String.valueOf(num)));
                }
            }
            else {
                // Historical authorized domain name obtains domain name prefix and verifies again
                applyDomainPrefix = tenantDomain.getDomainPrefix();
            }
            // Verify whether the domain name already exists
            CheckEnpApiResponse.Data checkResult = weComTemplate.checkEnpDomainName(applyDomainPrefix);
            if (null == checkResult) {
                // No record of adding domain name resolution exists
                applyFullDomainName = weComTemplate.addEnpDomainName(applyDomainPrefix);
                // Save enterprise domain name association record
                iSocialTenantDomainService.createDomain(spaceId, applyDomainPrefix, applyFullDomainName);
            }
            else {
                // There are resolution records for direct use
                applyFullDomainName = checkResult.getDomainName();
            }
            return new ApplyEnpDomainResult(applyDomainPrefix, applyFullDomainName);
        }
        catch (Exception e) {
            log.error("Failed to apply for enterprise domain name:", e);
            throw new BusinessException("Failed to apply for enterprise domain name");
        }
    }

    /**
     * Fill in WeCom message push Url
     *
     * @param messageUrl    Message push Url (only path without domain name)
     * @param variable      Url variable parameter
     */
    private String fillingSendWeComMsgUrl(String messageUrl, Dict variable) {
        if (StrUtil.isBlank(messageUrl)) {
            messageUrl = variable.getStr("https_enp_domain");
        }
        else {
            messageUrl = StrUtil.format(messageUrl, variable);
        }
        return messageUrl;
    }

    /**
     * Get the visible range information of the application
     *
     * @param corpId                Enterprise Id
     * @param agentId               Enterprise Application Id
     * @param switchoverToTempAuth  Whether to switch to temporary authorization
     * @return Apply visible area
     */
    private WeComAppVisibleScope getAppVisibleScopes(String corpId, Integer agentId, boolean switchoverToTempAuth) {
        WxCpAgent corpAgent = this.getCorpAgent(corpId, agentId, switchoverToTempAuth);
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("WeCom application「%s」not enabled", corpAgent.getName()));
        }
        // Judge whether all visible areas are empty
        if (ObjectUtil.isAllEmpty(corpAgent.getAllowParties().getPartyIds(), corpAgent.getAllowUserInfos())) {
            throw new BusinessException(String.format("WeCom application「%s」visible area is empty. Please adjust it and try again", corpAgent.getName()));
        }
        return new WeComAppVisibleScope()
                .setClose(corpAgent.getClose())
                .setAllowUserInfos(corpAgent.getAllowUserInfos())
                .setAllowParties(corpAgent.getAllowParties())
                .setAllowTags(corpAgent.getAllowTags());
    }

    /**
     * Incremental synchronization of WeCom address book
     * You need to switch the WeCom Service Api context in the pre method
     *
     * @param contactMeta   Synchronize address book metadata
     * @param visibleScope  Apply visible area
     * @return WeCom user ID of this synchronization
     */
    @Transactional(rollbackFor = Exception.class)
    public ContactMeta incrementSyncWeComContact(ContactMeta contactMeta, WeComAppVisibleScope visibleScope) {
        String spaceId = contactMeta.spaceId;
        String corpId = contactMeta.tenantId;
        String agentId = contactMeta.appId;
        Long rootTeamId = contactMeta.rootTeamId;
        Long mainAdminMemberId = contactMeta.mainAdminMemberId;

        WxCpDepartmentService departmentService = weComTemplate.departmentService();
        WxCpUserService userService = weComTemplate.userService();
        try {
            // Authorized top-level visible area - department
            List<Long> partyIds = visibleScope.getAllowParties().getPartyIds();
            // Authorize Top Level Visible Area - People
            List<String> userIds = Optional.of(visibleScope.getAllowUserInfos().getUsers()).orElseGet(ArrayList::new)
                    .stream()
                    .map(User::getUserId)
                    .collect(Collectors.toList());

            /* Pull synchronous historical data start */
            // Pull the synchronized member openId ->CahceWeComLinkMember
            List<TenantMemberDto> memberList = iMemberService.getMemberOpenIdListBySpaceId(spaceId);
            Map<String, CahceWeComUserLinkVikaMember> memberListByOpendIdToMap = memberList.stream()
                    // Since the master management is initialized manually above, filtering is required here
                    .filter(dto -> !dto.getMemberId().equals(mainAdminMemberId))
                    .collect(Collectors.toMap(TenantMemberDto::getOpenId, dto -> {
                        CahceWeComUserLinkVikaMember cahceData = CahceWeComUserLinkVikaMember.builder().openId(dto.getOpenId()).memberId(dto.getMemberId()).memberName(dto.getMemberName()).build();
                        // Query Associated Organization Ids
                        cahceData.setOldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(cahceData.getMemberId())));
                        return cahceData;
                    }));
            contactMeta.weComUserToVikaMemberMap.putAll(memberListByOpendIdToMap);
            // Pull synchronized WeCom members
            Map<String, Long> openIdToMemberIdMap = iSocialCpTenantUserService.getOpenIdsByTenantId(corpId, agentId);
            if (MapUtil.isNotEmpty(openIdToMemberIdMap)) {
                contactMeta.syncedWeComUserIdsByTenant.putAll(openIdToMemberIdMap);
            }
            // Pull synchronized department information
            List<TenantDepartmentBindDTO> teamList = iSocialTenantDepartmentService.getTenantBindTeamListBySpaceId(spaceId);
            Map<String, CahceWeComTeamLinkVikaTeam> teamListByDepartmentIdToMap = teamList.stream().collect(Collectors.toMap(TenantDepartmentBindDTO::getDepartmentId, dto -> CahceWeComTeamLinkVikaTeam.builder()
                    .id(dto.getId()).departmentName(dto.getDepartmentName())
                    .departmentId(dto.getDepartmentId()).openDepartmentId(dto.getOpenDepartmentId())
                    .parentDepartmentId(dto.getParentDepartmentId()).parentOpenDepartmentId(dto.getParentOpenDepartmentId())
                    .teamId(dto.getTeamId()).parentTeamId(dto.getParentTeamId())
                    .internalSequence(dto.getInternalSequence())
                    .build()));
            contactMeta.weComTeamToVikaTeamMap.putAll(teamListByDepartmentIdToMap);
            /* Pull synchronous historical data end */
            // Member states that allow synchronization
            Integer[] allowUserStatus = { WeComUserStatus.ACTIVE.getCode(), WeComUserStatus.NOT_ACTIVE.getCode() };
            // Pull visible area authorization - address book
            List<WxCpDepart> wxCpDepartList = departmentService.list(null);
            // Currently, all department IDs of the WeCom address book are retrieved
            List<String> currentPullWeComDepartIds = wxCpDepartList.stream().map(wxCpDepart -> wxCpDepart.getId().toString()).collect(Collectors.toList());
            List<WxCpUser> wxCpUserLisr = new ArrayList<>();
            // Pull Visible Area Authorization - Member
            for (String userId : userIds) {
                WxCpUser wxCpUser = userService.getById(userId);
                if (!ArrayUtil.contains(allowUserStatus, wxCpUser.getStatus())) {
                    // Pull is not allowed to skip directly
                    continue;
                }
                Long[] cpUserRelDepartIds = wxCpUser.getDepartIds();
                // If there is no department set authorized by the visible area in the personnel department, it is directly linked to the top-level department
                if (!CollUtil.containsAny(currentPullWeComDepartIds, Convert.toList(String.class, cpUserRelDepartIds))) {
                    // Incremental creation
                    this.createMemberAndBindTeamRel(wxCpUser, rootTeamId, contactMeta);
                }
            }
            // Try to build the address book tree structure
            Comparator<WxCpDepart> comparing = Comparator.comparing(o -> {
                final int index = partyIds.indexOf(o.getId());
                boolean isExist = currentPullWeComDepartIds.contains(o.getParentId().toString());
                return (index == -1 || isExist) ? Integer.MAX_VALUE : index;
            });
            // Enforce prioritization based on visible regional departments
            wxCpDepartList = wxCpDepartList.stream().sorted(comparing.thenComparing(Comparator.comparing(WxCpDepart::getOrder).reversed())).collect(Collectors.toList());
            List<WeComDepartTree> nodeList = CollUtil.newArrayList();
            for (WxCpDepart depart : wxCpDepartList) {
                // Add Support Tree Structure Data
                nodeList.add(new WeComDepartTree(depart.getId().toString(), depart.getName(), depart.getEnName(), depart.getParentId().toString(), depart.getOrder()));
            }
            List<WeComDepartTree> tryBulidTree = TreeUtil.build(nodeList, null, new NotRelyTryTreeBuildFactory<>());
            // Create a department circular tree structure, and tryBulidTree represents: top-level data
            for (WeComDepartTree departTree : tryBulidTree) {
                // treeToList representation: All data under the top level, top level+subset data
                List<WeComDepartTree> departDatas = TreeUtil.treeToList(departTree);
                // Pull the user from the department - just pull simple information
                List<WxCpUser> wxCpUsers = userService.listByDepartment(Long.valueOf(departTree.getId()), true, null);
                if (CollUtil.isNotEmpty(wxCpUsers)) {
                    wxCpUserLisr.addAll(wxCpUsers);
                }
                int i = 0, multiple = 2000;
                for (WeComDepartTree depart : departDatas) {
                    if (depart.getId().equals(WeComConstants.ROOT_DEPART_ID)) {
                        // Out of sync with the third party root department
                        continue;
                    }
                    String departId = depart.getId();
                    Long teamId = IdWorker.getId();

                    // Invert the tree structure into a set. All data are ordered
                    CahceWeComTeamLinkVikaTeam cahceTeam = contactMeta.getCahceTeam(departId);
                    // Parent Id
                    Long teamPid = contactMeta.getCahceTeamId(depart.getParentId());
                    boolean isExist = true;
                    if (null != cahceTeam && !(isExist = currentPullWeComDepartIds.contains(cahceTeam.getParentOpenDepartmentId()))) {
                        // The parent node does not exist in the current visible area and is directly divided into the root department
                        teamPid = rootTeamId;
                    }
                    // Third party root node
                    String tenantTeamPid = rootTeamId.equals(teamPid) ? WeComConstants.ROOT_DEPART_PARENT_ID : depart.getParentId();
                    // Sort
                    int departSequence = depart.getOrder() > Integer.MAX_VALUE ? Integer.MAX_VALUE : depart.getOrder().intValue();
                    int internalSequence = (depart.getLevel() + 1) * multiple + i;
                    if (null == cahceTeam) {
                        // Create department structure
                        TeamEntity team = OrganizationFactory.createTeam(spaceId, teamId, teamPid, depart.getName(), internalSequence);
                        team.setTeamLevel(depart.getLevel() + 2);
                        contactMeta.teamEntities.add(team);
                        SocialTenantDepartmentEntity weComTenantDepartment = SocialFactory.createWeComTenantDepartment(spaceId, corpId, depart)
                                .setParentId(tenantTeamPid)
                                .setDepartmentOrder(departSequence);
                        contactMeta.tenantDepartmentEntities.add(weComTenantDepartment);
                        SocialTenantDepartmentBindEntity tenantDepartmentBind = SocialFactory.createTenantDepartmentBind(spaceId, team.getId(), corpId, departId);
                        contactMeta.tenantDepartmentBindEntities.add(tenantDepartmentBind);
                        // Synchronous relation
                        cahceTeam = CahceWeComTeamLinkVikaTeam.builder()
                                .departmentName(team.getTeamName())
                                .departmentId(weComTenantDepartment.getDepartmentId()).openDepartmentId(weComTenantDepartment.getOpenDepartmentId())
                                .parentDepartmentId(weComTenantDepartment.getParentId()).parentOpenDepartmentId(weComTenantDepartment.getParentOpenDepartmentId())
                                .teamId(team.getId()).parentTeamId(team.getParentId())
                                .internalSequence(team.getSequence())
                                .isNew(true)
                                .op(SyncOperation.ADD)
                                .build();
                    }
                    else {
                        SocialTenantDepartmentEntity updateTenantDepartment = null;
                        TeamEntity updateTeam = null;

                        if (!cahceTeam.getParentDepartmentId().equals(depart.getParentId()) || !isExist) {
                            // Change the department level, or remove the visible range of the parent node
                            updateTenantDepartment = SocialTenantDepartmentEntity.builder()
                                    .id(cahceTeam.getId())
                                    .parentId(tenantTeamPid).parentOpenDepartmentId(depart.getParentId())
                                    .build();
                            updateTeam = TeamEntity.builder().id(cahceTeam.getTeamId()).parentId(teamPid).build();
                            // Update Cache
                            cahceTeam.setParentDepartmentId(updateTenantDepartment.getParentId());
                            cahceTeam.setParentOpenDepartmentId(updateTenantDepartment.getParentOpenDepartmentId());
                            cahceTeam.setParentTeamId(updateTeam.getParentId());
                        }
                        if (!cahceTeam.getDepartmentName().equals(depart.getName())) {
                            // Change of department name
                            updateTenantDepartment = Optional.ofNullable(updateTenantDepartment)
                                    .orElse(SocialTenantDepartmentEntity.builder().id(cahceTeam.getId()).build())
                                    .setDepartmentName(depart.getName());
                            updateTeam = Optional.ofNullable(updateTeam).orElse(TeamEntity.builder().id(cahceTeam.getTeamId()).build())
                                    .setTeamName(depart.getName());
                            // Update Cache
                            cahceTeam.setDepartmentName(updateTeam.getTeamName());
                        }
                        if (cahceTeam.getInternalSequence() != internalSequence) {
                            // Change of department order
                            updateTenantDepartment = Optional.ofNullable(updateTenantDepartment)
                                    .orElse(SocialTenantDepartmentEntity.builder().id(cahceTeam.getId()).build())
                                    .setDepartmentOrder(departSequence);
                            updateTeam = Optional.ofNullable(updateTeam).orElse(TeamEntity.builder().id(cahceTeam.getTeamId()).build())
                                    .setSequence(internalSequence);
                            // Update Cache
                            cahceTeam.setInternalSequence(updateTeam.getSequence());
                        }

                        if (!ObjectUtil.hasNull(updateTenantDepartment, updateTeam)) {
                            // Add to Modify Collection
                            cahceTeam.setOp(SyncOperation.UPDATE);
                            contactMeta.updateTenantDepartmentEntities.add(updateTenantDepartment);
                            contactMeta.updateTeamEntities.add(updateTeam);
                        }
                        else {
                            // No modification
                            cahceTeam.setOp(SyncOperation.KEEP);
                        }
                    }
                    // Add WeCom to vika corresponding department
                    cahceTeam.setIsCurrentSync(true); // Mark the department for this synchronization
                    contactMeta.weComTeamToVikaTeamMap.put(departId, cahceTeam);
                    i++;
                }
            }
            // Transform the structure. Members can be divided according to departments. Members can exist in multiple departments
            Map<Long, List<WxCpUser>> groupCpUser = new LinkedHashMap<>();
            for (WxCpUser user : wxCpUserLisr) {
                for (Long departId : user.getDepartIds()) {
                    List<WxCpUser> addUp = groupCpUser.get(departId);
                    if (null == addUp) {
                        addUp = CollUtil.newArrayList(user);
                        groupCpUser.put(departId, addUp);
                    }
                    else {
                        addUp.add(user);
                    }
                }
            }
            // Create Member - Members can exist in multiple departments, but all of them are the same memberId
            for (Entry<Long, List<WxCpUser>> entry : groupCpUser.entrySet()) {
                Long departId = entry.getKey();
                List<WxCpUser> wxCpUserList = entry.getValue();
                for (WxCpUser wxCpUser : wxCpUserList) {
                    if (!ArrayUtil.contains(allowUserStatus, wxCpUser.getStatus())) {
                        // Pull is not allowed to skip directly
                        continue;
                    }
                    // Incremental creation
                    this.createMemberAndBindTeamRel(wxCpUser, departId, contactMeta);
                }
            }
        }
        catch (Exception e) {
            log.error("Error synchronizing WeCom address book:", e);
            String errorMsg = "Synchronization of WeCom address book failed:%s";
            int errorCode = -1;
            if (e instanceof WxErrorException) {
                errorCode = ((WxErrorException) e).getError().getErrorCode();
            }
            else if (e instanceof NullPointerException) {
                errorCode = -10;
            }
            else if (e instanceof IllegalStateException) {
                if ("Duplicate key null".contains(e.getMessage())) {
                    errorCode = -11;
                }
            }
            errorMsg = String.format(errorMsg, errorCode);
            throw new BusinessException(errorMsg);
        }
        finally {
            // Close Service
            weComTemplate.closeService();
        }

        // Delete Department
        contactMeta.doDeleteTeams();
        // Delete Member
        contactMeta.doDeleteMembers();
        // Delete member association
        contactMeta.doDeleteMemberRels();
        // Store to DB
        contactMeta.doSaveOrUpdate();
        // Clean up the vika User cache
        userSpaceService.delete(spaceId);

        return contactMeta;
    }

    /**
     * Members of the space bind to members of We Com tenants
     *
     * @param memberId          vika memberId
     * @param userId            vika User Id
     * @param cpTenantUserId    WeCom Tenant User Id
     * @param weComUserId       WeCom Member Id
     */
    private void bindSpaceMemberToSocialTenantUser(Long memberId, Long userId, Long cpTenantUserId, String weComUserId) {
        boolean isBind = iSocialCpUserBindService.isCpTenantUserIdBind(userId, cpTenantUserId);
        if (!isBind) {
            iSocialCpUserBindService.create(userId, cpTenantUserId);
        }
        // Modify the open ID associated with a Member
        iMemberService.updateById(MemberEntity.builder().id(memberId).openId(weComUserId).build());
    }

    /**
     * Create member and bind organization association
     * If the created user will not be re created
     *
     * @param wxCpUser      WeCom User
     * @param departId      WeCom Department Id
     * @param contactMeta   Metadata
     */
    private void createMemberAndBindTeamRel(WxCpUser wxCpUser, Long departId, ContactMeta contactMeta) {
        String wecomUserId = wxCpUser.getUserId();
        CahceWeComUserLinkVikaMember cahceMember = contactMeta.weComUserToVikaMemberMap.get(wecomUserId);
        Long cahceCpTenantUserId = contactMeta.syncedWeComUserIdsByTenant.get(wecomUserId);
        // Judge whether the operation is synchronized
        if (!contactMeta.currentSyncWeComUserIds.contains(wecomUserId)) {
            // If the Member does not exist, create a
            if (null == cahceMember) {
                MemberEntity member = SocialFactory.createWeComMemberAndBindSpace(contactMeta.spaceId, wxCpUser);
                contactMeta.memberEntities.add(member);
                cahceMember = CahceWeComUserLinkVikaMember.builder().memberId(member.getId()).memberName(member.getMemberName()).openId(wecomUserId).isNew(true).build();
            }
            else {
                // ExistCheck whether key information needs to be modified
                if (!cahceMember.getMemberName().equals(wxCpUser.getName())) {
                    MemberEntity updateMember = MemberEntity.builder().id(cahceMember.getMemberId()).memberName(wxCpUser.getName()).build();
                    contactMeta.updateMemberEntities.add(updateMember);
                }
            }
            // Mark users for this synchronization
            cahceMember.setIsCurrentSync(true);
            // If WeCom member does not exist, create a
            if (null == cahceCpTenantUserId) {
                SocialCpTenantUserEntity weComTenantUser = SocialFactory.createWeComTenantUser(contactMeta.tenantId, String.valueOf(contactMeta.appId), wecomUserId);
                contactMeta.tenantCpUserEntities.add(weComTenantUser);
                // Add WeCom member key: cpUserId value: cpTenantUserId
                contactMeta.syncedWeComUserIdsByTenant.put(wecomUserId, weComTenantUser.getId());
            }
        }
        // Bind departments. If there is no corresponding department relationship in the cache, directly link to the root department
        Long cahceTeamId = contactMeta.getCahceTeamId(String.valueOf(departId));
        cahceMember.getNewUnitTeamIds().add(cahceTeamId);
        if (CollUtil.isEmpty(cahceMember.getOldUnitTeamIds()) || (CollUtil.isNotEmpty(cahceMember.getOldUnitTeamIds()) && !cahceMember.getOldUnitTeamIds().contains(cahceTeamId))) {
            // Member history does not exist under department, add member and department association records
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(cahceTeamId, cahceMember.getMemberId()));
        }
        // Add operation synchronization WeCom user record
        contactMeta.currentSyncWeComUserIds.add(wecomUserId);
        // Add user corresponding to WeCom TO vika
        contactMeta.weComUserToVikaMemberMap.put(wecomUserId, cahceMember);
    }

    /**
     * Create and modify tenant authorization information
     *
     * @param tenantId      Enterprise Id
     * @param appId         Enterprise Application Id
     * @param status        Enable Status
     * @param visibleScope  Enterprise application visible area information
     * @param authInfo      Enterprise application authorization information
     * @return New tenant information
     */
    private SocialTenantEntity createOrUpdateTenant(String tenantId, String appId, Boolean status, WeComAppVisibleScope visibleScope, WeComAuthInfo authInfo) {
        SocialTenantEntity tenant = socialTenantMapper.selectByAppIdAndTenantId(appId, tenantId);
        try {
            boolean flag;
            String authInfoJsonStr = null == authInfo ? null : objectMapper.writeValueAsString(authInfo);
            String contactAuthScopeJsonStr = objectMapper.writeValueAsString(visibleScope);

            if (null == tenant) {
                tenant = new SocialTenantEntity()
                        .setAppId(appId)
                        .setAppType(SocialAppType.INTERNAL.getType())
                        .setPlatform(SocialPlatformType.WECOM.getValue())
                        .setTenantId(tenantId)
                        .setContactAuthScope(contactAuthScopeJsonStr)
                        .setAuthInfo(authInfoJsonStr)
                        .setStatus(status);
                flag = SqlHelper.retBool(socialTenantMapper.insert(tenant));
            }
            else {
                if (null == authInfoJsonStr) {
                    WeComAuthInfo weComAuthInfo = objectMapper.readValue(tenant.getAuthInfo(), WeComAuthInfo.class);
                    weComAuthInfo.setClose(visibleScope.getClose());

                    authInfoJsonStr = objectMapper.writeValueAsString(weComAuthInfo);
                }

                tenant.setStatus(status)
                        .setContactAuthScope(contactAuthScopeJsonStr)
                        .setAuthInfo(authInfoJsonStr);
                flag = SqlHelper.retBool(socialTenantMapper.updateById(tenant));
            }
            if (!flag) {
                throw new RuntimeException("Failed to add tenant");
            }
            return tenant;
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to add tenant");
        }
    }

    /**
     * Create WeCom Application Menu
     *
     * @param corpId    Enterprise Id
     * @param agentId   Enterprise Application Id
     * @param spaceId   Space Id
     */
    private WxMenu createWeComMenu(String corpId, Integer agentId, String spaceId) {
        WxMenu menu = new WxMenu();
        List<WxMenuButton> wxMenuButtonList = new ArrayList<>();

        String domainNameCarryHttps = iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, true);
        // Fill domain name parameter variable
        Dict variable = Dict.create()
                .set("corpId", corpId)
                .set("agentId", agentId)
                .set("https_enp_domain", domainNameCarryHttps);

        WeComConfig config = weComTemplate.getConfig();
        if (CollUtil.isNotEmpty(config.getInitMenus())) {
            for (InitMenu initMenu : config.getInitMenus()) {
                // Primary menu
                WxMenuButton wxMenu = this.fillWxMenuButton(initMenu, domainNameCarryHttps, variable);

                if (CollUtil.isNotEmpty(initMenu.getSubButtons())) {
                    // Secondary menu
                    List<WxMenuButton> wxMenutSubButtonsList = new ArrayList<>();
                    for (InitMenu subButton : initMenu.getSubButtons()) {
                        WxMenuButton wxSubMenu = this.fillWxMenuButton(subButton, domainNameCarryHttps, variable);
                        wxMenutSubButtonsList.add(wxSubMenu);
                    }
                    wxMenu.setSubButtons(wxMenutSubButtonsList);
                }
                wxMenuButtonList.add(wxMenu);
            }
        }
        menu.setButtons(wxMenuButtonList);
        return menu;
    }

    /**
     * Fill menu parameters
     */
    private WxMenuButton fillWxMenuButton(InitMenu initMenu, String domainNameCarryHttps, Dict variable) {
        WxMenuButton wxMenu = new WxMenuButton();
        String url = initMenu.getUrl();
        if ("/".equals(url)) {
            // Homepage
            String wecomCallbackPath = WeComCardFactory.getWecomCallbackPath();
            url = this.fillingSendWeComMsgUrl(wecomCallbackPath, variable);
        }
        else if (!ReUtil.contains("http://|https://", url)) {
            // Auto fill Url, domain name
            url = domainNameCarryHttps + StrUtil.prependIfMissingIgnoreCase(url, "/");
        }
        wxMenu.setName(initMenu.getName());
        wxMenu.setType(initMenu.getType());
        wxMenu.setUrl(url);
        return wxMenu;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    protected static class ApplyEnpDomainResult {

        private String applyDomainPrefix;

        private String applyFullDomainName;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder(toBuilder = true)
    protected static class CahceWeComUserLinkVikaMember {

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

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder(toBuilder = true)
    protected static class CahceWeComTeamLinkVikaTeam {
        enum SyncOperation {
            ADD, UPDATE, KEEP
        }

        private Long id;

        private String departmentName;

        private String departmentId;

        private String parentDepartmentId;

        private String openDepartmentId;

        private String parentOpenDepartmentId;

        private Long teamId;

        private Long parentTeamId;

        private Integer internalSequence;

        @Builder.Default
        private Boolean isNew = false;

        @Builder.Default
        private Boolean isCurrentSync = false;

        private SyncOperation op;

    }

    class ContactMeta {
        // Space Id
        String spaceId;

        // Third party enterprise ID
        String tenantId;

        // Third party enterprise application ID
        String appId;

        // The root organization ID of the space
        Long rootTeamId;

        // Space Master Administrator Member Id
        Long mainAdminMemberId;

        // Save the vika Member relationship corresponding to the WeCom user WeCom (UserId) => vika (CahceWeComUserLinkVikaMember)
        Map<String, CahceWeComUserLinkVikaMember> weComUserToVikaMemberMap = new CaseInsensitiveMap<>();

        // Save the vika Team relationship corresponding to the WeCom department WeCom (DepartmentId)=>vika (CahceWeComTeamLinkVikaTeam)
        Map<String, CahceWeComTeamLinkVikaTeam> weComTeamToVikaTeamMap = MapUtil.newHashMap(true);

        // Get: cache, synchronized WeCom user, pull key: WeComUserId value: cpTenantUserId according to enterprise application
        Map<String, Long> syncedWeComUserIdsByTenant = new CaseInsensitiveMap<>();

        // Record the current (current) synchronized We Com user ID
        Set<String> currentSyncWeComUserIds = Collections.synchronizedSet(new HashSet<>());

        public ContactMeta(String spaceId, String tenantId, String appId, Long rootTeamId, Long mainAdminMemberId) {
            this.spaceId = spaceId;
            this.tenantId = tenantId;
            this.appId = appId;
            this.rootTeamId = rootTeamId;
            this.mainAdminMemberId = mainAdminMemberId;
        }

        List<SocialTenantDepartmentEntity> tenantDepartmentEntities = new ArrayList<>();

        List<SocialTenantDepartmentEntity> updateTenantDepartmentEntities = new ArrayList<>();

        List<SocialTenantDepartmentBindEntity> tenantDepartmentBindEntities = new ArrayList<>();

        List<SocialCpTenantUserEntity> tenantCpUserEntities = new ArrayList<>();

        List<TeamEntity> teamEntities = new ArrayList<>();

        List<TeamEntity> updateTeamEntities = new ArrayList<>();

        List<MemberEntity> memberEntities = new ArrayList<>();

        List<MemberEntity> updateMemberEntities = new ArrayList<>();

        List<TeamMemberRelEntity> teamMemberRelEntities = new ArrayList<>();

        // Get the cached Team Id. No data. Default: root Team Id
        Long getCahceTeamId(String weComDepartId) {
            return Optional.ofNullable(this.weComTeamToVikaTeamMap.get(weComDepartId))
                    .map(CahceWeComTeamLinkVikaTeam::getTeamId)
                    .orElse(rootTeamId);
        }

        // Get Cache Team
        CahceWeComTeamLinkVikaTeam getCahceTeam(String weComDepartId) {
            return this.weComTeamToVikaTeamMap.get(weComDepartId);
        }

        // Get WeCom Tenant User's id according to vika Member's id
        List<Long> getCpTenantUserIdByMemberId(List<Long> memberIds) {
            if (CollUtil.isEmpty(memberIds)) {
                return Collections.emptyList();
            }
            List<String> deleteOpenId = this.weComUserToVikaMemberMap.values().stream().collect(Collectors.toMap(CahceWeComUserLinkVikaMember::getMemberId, v -> v.getOpenId().toLowerCase()))
                    .entrySet()
                    .stream()
                    .filter(entry -> memberIds.contains(entry.getKey()))
                    .map(Entry::getValue)
                    .collect(Collectors.toList());
            return this.syncedWeComUserIdsByTenant.entrySet().stream()
                    .filter(entry -> deleteOpenId.contains(entry.getKey()))
                    .map(Entry::getValue)
                    .collect(Collectors.toList());
        }

        void doDeleteTeams() {
            // Calculate the groups to be deleted
            List<Long> oldTeamIds = iTeamService.getTeamIdsBySpaceId(spaceId);
            Map<Long, String> newTeams = this.weComTeamToVikaTeamMap.values().stream()
                    .filter(CahceWeComTeamLinkVikaTeam::getIsCurrentSync)
                    .collect(Collectors.toMap(CahceWeComTeamLinkVikaTeam::getTeamId, CahceWeComTeamLinkVikaTeam::getDepartmentId));

            Set<Long> newTeamIds = new HashSet<>(newTeams.keySet());
            newTeamIds.add(rootTeamId);

            // Calculate intersection, department without change
            newTeamIds.retainAll(oldTeamIds);
            if (!newTeamIds.isEmpty()) {
                // Calculate the difference set and the department to be deleted
                oldTeamIds.removeAll(newTeamIds);
            }

            if (CollUtil.isNotEmpty(oldTeamIds)) {
                List<Long> currentSyncMemberUsers = this.weComUserToVikaMemberMap.values().stream()
                        .filter(CahceWeComUserLinkVikaMember::getIsCurrentSync)
                        .map(CahceWeComUserLinkVikaMember::getMemberId).collect(Collectors.toList());

                Map<Long, String> teamToWecomTeamMap = this.weComTeamToVikaTeamMap.values().stream()
                        .collect(Collectors.toMap(CahceWeComTeamLinkVikaTeam::getTeamId, CahceWeComTeamLinkVikaTeam::getDepartmentId));

                for (Long deleteTeamId : oldTeamIds) {
                    // Delete the member under the vika department. There are multiple departments for the personnel. It is necessary to judge whether the synchronized personnel are in the list.
                    // If they exist, they will not be deleted. Otherwise, they will be deleted
                    List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(deleteTeamId);
                    memberIds.removeAll(currentSyncMemberUsers);

                    String deleteWeComTeamId = teamToWecomTeamMap.get(deleteTeamId);
                    if (StrUtil.isNotBlank(deleteWeComTeamId)) {
                        // Remove department - delete the third-party department, delete the binding relationship, and delete the vika department
                        iSocialTenantDepartmentService.deleteSpaceTenantDepartment(spaceId, tenantId, deleteWeComTeamId);
                    }
                    else {
                        // It means that there is no binding, and vika department is deleted directly
                        iTeamService.deleteTeam(deleteTeamId);
                    }
                    // Remove Members
                    iMemberService.batchDeleteMemberFromSpace(spaceId, memberIds, false);
                    List<Long> deleteCpTenantUserId = this.getCpTenantUserIdByMemberId(memberIds);
                    // Remove vika member history binding WeCom membership
                    iSocialCpUserBindService.batchDeleteByCpTenantUserIds(deleteCpTenantUserId);
                }
            }
        }

        void doDeleteMembers() {
            List<Long> oldMemberIds = iMemberService.getMemberIdsBySpaceId(spaceId);
            Map<Long, String> newMemberUsers = this.weComUserToVikaMemberMap.values().stream()
                    .filter(CahceWeComUserLinkVikaMember::getIsCurrentSync)
                    .collect(Collectors.toMap(CahceWeComUserLinkVikaMember::getMemberId, CahceWeComUserLinkVikaMember::getOpenId));

            Set<Long> newMemberIds = newMemberUsers.keySet();

            // Calculate intersection, users without changes
            newMemberIds.retainAll(oldMemberIds);
            if (!newMemberIds.isEmpty()) {
                // Users to be deleted when calculating difference sets
                oldMemberIds.removeAll(newMemberIds);
            }

            Set<String> newWeComUserIds = this.weComUserToVikaMemberMap.values().stream()
                    .filter(CahceWeComUserLinkVikaMember::getIsNew)
                    .map(CahceWeComUserLinkVikaMember::getOpenId)
                    .collect(Collectors.toSet());
            // Recalculate the new users
            currentSyncWeComUserIds.retainAll(newWeComUserIds);

            // Remove Members
            iMemberService.batchDeleteMemberFromSpace(spaceId, oldMemberIds, false);
            List<Long> deleteCpTenantUserId = this.getCpTenantUserIdByMemberId(oldMemberIds);
            // Remove vika Member History Binding WeCom Membership
            iSocialCpUserBindService.batchDeleteByCpTenantUserIds(deleteCpTenantUserId);
        }

        void doDeleteMemberRels() {
            this.weComUserToVikaMemberMap.values().forEach(cahceData -> {
                Set<Long> oldUnitTeamIds = cahceData.getOldUnitTeamIds();
                if (CollUtil.isNotEmpty(oldUnitTeamIds)) {
                    oldUnitTeamIds.removeAll(cahceData.getNewUnitTeamIds());
                    if (CollUtil.isNotEmpty(oldUnitTeamIds)) {
                        teamMemberRelMapper.deleteByTeamIdsAndMemberId(cahceData.getMemberId(), new ArrayList<>(oldUnitTeamIds));
                    }
                }
            });
        }

        void doSaveOrUpdate() {
            iSocialCpTenantUserService.createBatch(tenantCpUserEntities);

            iSocialTenantDepartmentService.createBatch(tenantDepartmentEntities);
            iSocialTenantDepartmentService.updateBatchById(updateTenantDepartmentEntities);

            iSocialTenantDepartmentBindService.createBatch(tenantDepartmentBindEntities);

            iMemberService.batchCreate(spaceId, memberEntities);
            iMemberService.updateBatchById(updateMemberEntities);

            iTeamService.batchCreateTeam(spaceId, teamEntities);
            iTeamService.updateBatchById(updateTeamEntities);
            iTeamMemberRelService.createBatch(teamMemberRelEntities);
        }
    }

}
