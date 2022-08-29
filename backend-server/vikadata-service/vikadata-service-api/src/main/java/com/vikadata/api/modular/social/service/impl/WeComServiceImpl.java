package com.vikadata.api.modular.social.service.impl;

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

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.enums.exception.SpaceException;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.vo.social.SocialTenantEnvVo;
import com.vikadata.api.model.vo.social.SocialTenantEnvVo.WeComEnv;
import com.vikadata.api.model.vo.social.WeComBindConfigVo;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.organization.factory.OrganizationFactory;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.event.wecom.WeComCardFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.mapper.SocialTenantDomainMapper;
import com.vikadata.api.modular.social.mapper.SocialTenantMapper;
import com.vikadata.api.modular.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.modular.social.model.TenantMemberDto;
import com.vikadata.api.modular.social.model.WeComCreateTempConfigResult;
import com.vikadata.api.modular.social.model.WeComDepartTree;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.modular.social.service.ISocialTenantDomainService;
import com.vikadata.api.modular.social.service.IWeComService;
import com.vikadata.api.modular.social.service.impl.WeComServiceImpl.CahceWeComTeamLinkVikaTeam.SyncOperation;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
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

import static com.vikadata.api.enums.exception.SocialException.AGENT_CONFIG_DISABLE;
import static com.vikadata.api.enums.exception.SocialException.GET_AGENT_CONFIG_ERROR;
import static com.vikadata.api.enums.exception.SocialException.TENANT_APP_BIND_INFO_NOT_EXISTS;
import static com.vikadata.api.enums.exception.SocialException.UNBOUND_WECOM;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST;

/**
 * <p>
 * 企业微信服务 接口实现
 * </p>
 *
 * @author Pengap
 * @date 2021/7/31 16:31:10
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
        log.info("创建企业微信绑定临时授权配置");
        Duration timeout = Duration.ofHours(TIMEOUT).plusSeconds(RandomUtil.randomLong(60, 360));
        WxCpAgent corpAgent = this.getCorpAgentByTempAuth(corpId, agentId, agentSecret, timeout);
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("企业微信应用「%s」未启用", corpAgent.getName()));
        }
        WeComCreateTempConfigResult result = new WeComCreateTempConfigResult();
        WeComAuthInfo weComAuthInfo = new WeComAuthInfo()
                .setCorpId(corpId)
                .setAgentId(agentId)
                .setAgentSecret(agentSecret)
                .setClose(corpAgent.getClose());
        // 赋值应用授权信息
        AgentInfo agentInfo = new AgentInfo();
        BeanUtil.copyProperties(corpAgent, agentInfo, CopyOptions.create().ignoreError());
        weComAuthInfo.setAgentInfo(agentInfo);

        // 生成临时配置sha用于后续流程识别的唯一标识
        String configSha = SecureUtil.sha1(String.format("%s-%s", corpId, agentId));
        String domainName = null;
        // 是否自动申请企业微信专属域名
        if (isAutoCreateTempDomain) {
            // 申请企业域名
            ApplyEnpDomainResult applyResult = this.applyEnpDomain(spaceId);
            domainName = applyResult.getApplyFullDomainName();
        }
        // 保存到缓存中
        String key = weComTemplate.getCacheConfigKeyPrefix(true).concat(configSha);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(key);
        ops.set(weComAuthInfo, timeout);
        return result.setConfigSha(configSha).setDomainName(domainName);
    }

    @Override
    public WeComAuthInfo getConfigSha(String configSha) {
        log.info("获取企业微信临时配置，配置SHA：{}", configSha);
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
        log.info("移除企业微信临时配置，配置SHA：{}", configSha);
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
        log.info("获取空间站「{}」绑定企业微信配置", spaceId);
        // 根据空间站查询绑定信息
        SpaceBindTenantInfoDTO spaceBindTenantInfo = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, SocialPlatformType.WECOM, WeComAuthInfo.class);
        ExceptionUtil.isNotNull(spaceBindTenantInfo, UNBOUND_WECOM);
        ExceptionUtil.isNotNull(spaceBindTenantInfo.getAuthInfo(), GET_AGENT_CONFIG_ERROR);
        ExceptionUtil.isTrue(spaceBindTenantInfo.getStatus(), AGENT_CONFIG_DISABLE);
        // 根据空间站绑定域名
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
        log.info("OAuth2获取企业微信成员信息，应用「corpId:{} / agentId:{}」，TempAuth模式：{}", corpId, agentId, isTempAuth);
        // 切换上下文
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
                    throw new BusinessException("无效的CODE编码");
                }
            }
            throw new RuntimeException("获取企业微信应用用户信息异常：", e);
        }
        finally {
            // 关闭服务
            weComTemplate.closeService();
        }
    }

    @Override
    public WxCpUser getWeComUserByWeComUserId(String corpId, Integer agentId, String weComUserId, boolean isTempAuth) {
        log.info("获取应用「corpId:{} / agentId:{}」成员「{}」信息，TempAuth模式：{}", corpId, agentId, weComUserId, isTempAuth);
        // 切换上下文
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
            throw new RuntimeException("获取企业微信应用用户信息异常：", e);
        }
        finally {
            // 关闭服务
            weComTemplate.closeService();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Set<String> weComAppBindSpace(String corpId, Integer agentId, String spaceId, WeComAuthInfo agentConfig) {
        if (weComTemplate == null) {
            throw new BusinessException("企业微信未启用");
        }
        // 绑定操作的vika用户Id
        Long bindUserId = agentConfig.getOperatingBindUserId();
        log.info("空间站「{}」绑定企业微信，操作用户：{}", spaceId, bindUserId);
        // 绑定操作的企业微信用户Id（主管理员wecomUserId）
        String mainAdminWeComUserId = agentConfig.getOperatingBindWeComUserId();
        // 绑定操作的企业微信用户信息
        WxCpUser bindWeComUser = agentConfig.getOperatingBindWeComUser();
        ExceptionUtil.isTrue(Objects.nonNull(bindWeComUser) && StrUtil.isNotBlank(bindWeComUser.getUserId()), USER_NOT_EXIST);
        // 空间的主管理员用户ID
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        // 检查是否空间主管理员
        ExceptionUtil.isTrue(mainAdminUserId.equals(bindUserId), SpaceException.NOT_SPACE_MAIN_ADMIN);
        // 绑定空间的根组织ID
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // 空间的主管理员成员ID（旧）
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);

        // 应用可见范围
        WeComAppVisibleScope visibleScopes = this.getAppVisibleScopes(corpId, agentId, true);
        // 切换service上下文
        this.switchoverWeComTemplate(corpId, agentId, true);

        ContactMeta currentSyncContactMeta = new ContactMeta(spaceId, corpId, String.valueOf(agentId), rootTeamId, mainAdminMemberId);
        // 由于绑定不会创建一个member成员，这里模拟添加一条关联关系
        CahceWeComUserLinkVikaMember mainAdminWeComLinkVikaMember = CahceWeComUserLinkVikaMember.builder().memberId(mainAdminMemberId)
                .memberName("").openId(mainAdminWeComUserId)
                .oldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(mainAdminMemberId)))
                .isNew(true).isCurrentSync(true).build();
        currentSyncContactMeta.weComUserToVikaMemberMap.put(mainAdminWeComUserId, mainAdminWeComLinkVikaMember);

        // 同步企业微信通讯录
        currentSyncContactMeta = this.incrementSyncWeComContact(currentSyncContactMeta, visibleScopes);
        // 删除所有子管理员
        iSpaceRoleService.deleteBySpaceId(spaceId);

        // 获取新的空间站主管理员（新）
        Long bindCpTenantUserId = currentSyncContactMeta.syncedWeComUserIdsByTenant.get(mainAdminWeComUserId);
        ExceptionUtil.isNotNull(bindCpTenantUserId, PermissionException.SET_MAIN_ADMIN_FAIL);
        // 绑定空间站Member到WeComUser
        this.bindSpaceMemberToSocialTenantUser(mainAdminMemberId, bindUserId, bindCpTenantUserId, mainAdminWeComUserId);

        // 空间初次绑定时，增加绑定
        iSocialTenantBindService.addTenantBind(String.valueOf(agentId), corpId, spaceId);
        // 没有企业应用信息，需要新建，如果已经停用需要更新
        this.createOrUpdateTenant(corpId, String.valueOf(agentId), true, visibleScopes, agentConfig);
        // 更改空间的全局状态(禁止申请加入, 禁止邀请)
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().joinable(false).invitable(false).build();
        iSpaceService.switchSpacePros(bindUserId, spaceId, feature);
        // 更新应用市场状态
        iAppInstanceService.createInstanceByAppType(spaceId, AppType.WECOM.name());
        // 生效域名
        iSocialTenantDomainService.enabledDomain(spaceId);
        // 删除临时绑定配置
        String configSha = SecureUtil.sha1(String.format("%s-%s", corpId, agentId));
        this.removeTempConfig(configSha);
        return currentSyncContactMeta.currentSyncWeComUserIds;
    }

    @Override
    public Set<String> weComRefreshContact(String corpId, Integer agentId, String spaceId, Long operatingUserId) {
        if (weComTemplate == null) {
            throw new BusinessException("企业微信未启用");
        }
        log.info("空间站「{}」刷新通讯录，操作用户：{}", spaceId, operatingUserId);
        // 空间的主管理员用户ID
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        // 检查是否空间主管理员
        ExceptionUtil.isTrue(mainAdminUserId.equals(operatingUserId), SpaceException.NOT_SPACE_MAIN_ADMIN);
        // 空间的主管理员成员ID（旧）
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        // 空间的管理员对应OPEN_ID（旧）
        String mainAdminOpenId = iMemberService.getOpenIdByMemberId(mainAdminMemberId);
        // 检查主管理员绑定微信成员是否存在可见区域
        getWeComUserByWeComUserId(corpId, agentId, mainAdminOpenId);
        // 绑定空间的根组织ID
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // 应用可见范围
        WeComAppVisibleScope visibleScopes = this.getAppVisibleScopes(corpId, agentId, false);
        // 切换service上下文
        this.switchoverWeComTemplate(corpId, agentId, false);

        ContactMeta currentSyncContactMeta = new ContactMeta(spaceId, corpId, String.valueOf(agentId), rootTeamId, mainAdminMemberId);
        // 初始化主管理员信息
        CahceWeComUserLinkVikaMember mainAdminWeComLinkVikaMember = CahceWeComUserLinkVikaMember.builder().memberId(mainAdminMemberId)
                .memberName("").openId(mainAdminOpenId)
                .oldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(mainAdminMemberId)))
                .isNew(false).isCurrentSync(true).build();
        currentSyncContactMeta.weComUserToVikaMemberMap.put(mainAdminOpenId, mainAdminWeComLinkVikaMember);

        // 同步企业微信通讯录
        currentSyncContactMeta = this.incrementSyncWeComContact(currentSyncContactMeta, visibleScopes);

        // 检查人数限制
        // long defaultMaxMemberCount = iSubscriptionService.getPlanSeats(spaceId);
        // ExceptionUtil.isTrue(currentSyncContactMeta.syncedWeComUserIdsByTenant.size() <= defaultMaxMemberCount, SubscribeFunctionException.MEMBER_LIMIT);
        // 更新企业应用信息
        this.createOrUpdateTenant(corpId, String.valueOf(agentId), true, visibleScopes, null);
        return currentSyncContactMeta.currentSyncWeComUserIds;
    }

    @Override
    public void sendMessageToUserPrivate(String corpId, Integer agentId, String spaceId, List<String> toUsers, WxCpMessage message) {
        log.info("发送企业微信消息推送");
        if (ObjectUtil.hasNull(corpId, agentId, spaceId)) {
            log.warn("企业微信消息推送「{}」参数不完整", message.getMsgType());
            return;
        }
        String touser = CollUtil.isEmpty(toUsers) ? "@all" : CollUtil.join(toUsers, "|");
        try {
            if (null != message) {
                this.switchoverWeComTemplate(corpId, agentId, false);
                String domainNameCarryHttps = iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, true);
                message.setToUser(touser);
                // 填充域名参数变量
                Dict variable = Dict.create()
                        .set("corpId", corpId)
                        .set("agentId", agentId)
                        .set("https_enp_domain", domainNameCarryHttps);
                // 填充域名
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
                    log.debug("企业微信发送应用消息结果：{}", sendResult);
                }
            }
        }
        catch (WxErrorException e) {
            log.error("企业微信发送应用消息失败：", e);
        }
        finally {
            // 关闭服务
            weComTemplate.closeService();
        }
    }

    @Override
    public void createFixedMenu(String corpId, Integer agentId, String spaceId) {
        log.info("空间站「{}」完成集成企业微信，创建固定菜单", spaceId);
        this.switchoverWeComTemplate(corpId, agentId, false);
        try {
            weComTemplate.menuService().create(agentId, this.createWeComMenu(corpId, agentId, spaceId));
        }
        catch (WxErrorException e) {
            log.error("企业微信「{}-{}-{}」创建菜单失败：", corpId, agentId, spaceId, e);
        }
        finally {
            weComTemplate.closeService();
        }
    }

    @Override
    public WxCpAgent getCorpAgent(String corpId, Integer agentId, boolean isTempAuth) {
        log.info("获取应用「corpId:{} / agentId:{}」信息，TempAuth模式：{}", corpId, agentId, isTempAuth);
        // 切换上下文
        this.switchoverWeComTemplate(corpId, agentId, isTempAuth);
        return this.getCorpAgentByCpService(weComTemplate.openService());
    }

    @Override
    public SocialTenantEnvVo getWeComTenantEnv(String requestHost) {
        log.info("专属域名「{}」获取环境配置", requestHost);
        SocialTenantEnvVo result = null;
        // 查询域名对应的空间站Id
        String spaceId = socialTenantDomainMapper.selectSpaceIdByDomainName(requestHost);
        if (StrUtil.isNotBlank(spaceId)) {
            result = new SocialTenantEnvVo();
            // 目前查询环境只有集成企业微信使用的到，这里只查询企业微信
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
        log.info("空间站「{}」停止企业微信集成", spaceId);
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        ExceptionUtil.isNotNull(bindInfo, TENANT_APP_BIND_INFO_NOT_EXISTS);
        String tenantId = bindInfo.getTenantId();
        String appId = bindInfo.getAppId();

        // 删除租户的部门记录以及绑定,防止多应用误删
        iSocialTenantDepartmentService.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // 删除租户的用户记录并且删除关联关系
        iSocialCpTenantUserService.batchDeleteByCorpAgent(tenantId, appId);
        // 删除空间的绑定
        iSocialTenantBindService.removeBySpaceId(spaceId);
        // 停用应用
        socialTenantMapper.setTenantStop(appId, tenantId);
        // 恢复空间的全员可邀请状态（同步初创空间的默认配置）
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
    }

    /**
     * 切换switchoverToTempAuth
     * 只负责切换上下文不负责创建上下文
     *
     * @param corpId                企业Id
     * @param agentId               企业应用Id
     * @param switchoverToTempAuth  是否切换到临时授权
     * @author Pengap
     * @date 2021/8/13 18:45:35
     */
    private void switchoverWeComTemplate(String corpId, Integer agentId, boolean switchoverToTempAuth) {
        if (null == weComTemplate) {
            throw new BusinessException("企业微信未启用");
        }
        if (log.isDebugEnabled()) {
            log.debug("切换企业微信Service上下文到，应用「corpId:{} / agentId:{}」，TempAuth模式：{}", corpId, agentId, switchoverToTempAuth);
        }
        if (switchoverToTempAuth) {
            weComTemplate.switchoverTo(corpId, agentId, true);
        }
        else {
            weComTemplate.switchoverTo(corpId, agentId);
        }
    }

    /**
     * 使用临时授权服务Api，获取企业微信应用信息
     *
     * @param corpId            企业Id
     * @param agentId           企业应用Id
     * @param agentSecret       企业应用密钥
     * @param authEffectiveTime 授权有效时间
     * @return 企业应用信息
     * @author Pengap
     * @date 2021/8/13 18:40:05
     */
    private WxCpAgent getCorpAgentByTempAuth(String corpId, Integer agentId, String agentSecret, Duration authEffectiveTime) {
        if (weComTemplate == null) {
            throw new BusinessException("企业微信未启用");
        }
        WxCpService tempAuthService = weComTemplate.addService(corpId, agentId, agentSecret, true, authEffectiveTime.toMillis());
        return this.getCorpAgentByCpService(tempAuthService);
    }

    /**
     * 根据Api服务获取企业微信应用信息
     *
     * @param wxCpService   企业微信api服务
     * @return 企业应用信息
     * @author Pengap
     * @date 2021/8/4 18:50:15
     */
    private WxCpAgent getCorpAgentByCpService(WxCpService wxCpService) {
        if (weComTemplate == null) {
            throw new BusinessException("企业微信未启用");
        }
        String corpId = wxCpService.getWxCpConfigStorage().getCorpId();
        Integer agentId = wxCpService.getWxCpConfigStorage().getAgentId();
        try {
            WxCpAgent wxAgent = wxCpService.getAgentService().get(agentId);
            if (null == wxAgent || wxAgent.getErrCode() != 0) {
                throw new BusinessException("企业微信应用配置异常，请检查配置");
            }
            else {
                return wxAgent;
            }
        }
        catch (WxErrorException e) {
            // 发生错误移除临时授权缓存
            weComTemplate.removeCpServicesByTempAuth(weComTemplate.mergeKey(corpId, agentId));
            WxError error = e.getError();
            if (null != error) {
                switch (error.getErrorCode()) {
                    case 40001:
                        throw new BusinessException(error.getErrorCode(), "不合法的secret参数");
                    case 40013:
                        throw new BusinessException(error.getErrorCode(), "不合法的CorpID");
                    case 301002:
                        throw new BusinessException(error.getErrorCode(), "无权限操作指定的应用");
                    default:
                        throw new BusinessException("企业微信应用配置异常，请检查配置");
                }
            }
            throw new RuntimeException("企业微信配证异常：", e);
        }
        finally {
            // 关闭服务
            weComTemplate.closeService();
        }
    }

    /**
     * 申请企业专属域名
     *
     * @param spaceId   空间站ID
     * @return 专属企业域名
     * @author Pengap
     * @date 2021/8/2 14:55:36
     */
    private ApplyEnpDomainResult applyEnpDomain(String spaceId) {
        SocialTenantDomainEntity tenantDomain = socialTenantDomainMapper.selectBySpaceId(spaceId);
        try {
            // 申请完整域名
            String applyFullDomainName;
            // 申请域名前缀
            String applyDomainPrefix;
            // 申请企业域名模版
            String applyEnpDomainTemplate = weComTemplate.getConfig().getOperateEnpDdns().getApplyEnpDomainTemplate();

            if (null == tenantDomain || StrUtil.isBlank(tenantDomain.getDomainName())) {
                // 历史没有授权域名，自动创建域名，并且校验域名是否重复
                String toLC = spaceId.toLowerCase();
                applyDomainPrefix = String.format(applyEnpDomainTemplate, toLC);
                int num = socialTenantDomainMapper.countTenantDomainName(toLC);
                if (num > 0) {
                    // 重复域名自动在后面增加1以作区别
                    applyDomainPrefix = String.format(applyEnpDomainTemplate, toLC.concat(String.valueOf(num)));
                }
            }
            else {
                // 历史已授权域名获取域名前缀再次校验
                applyDomainPrefix = tenantDomain.getDomainPrefix();
            }
            // 校验域名是否已存在
            CheckEnpApiResponse.Data checkResult = weComTemplate.checkEnpDomainName(applyDomainPrefix);
            if (null == checkResult) {
                // 不存在添加域名解析记录
                applyFullDomainName = weComTemplate.addEnpDomainName(applyDomainPrefix);
                // 保存企业域名关联记录
                iSocialTenantDomainService.createDomain(spaceId, applyDomainPrefix, applyFullDomainName);
            }
            else {
                // 存在解析记录直接使用
                applyFullDomainName = checkResult.getDomainName();
            }
            return new ApplyEnpDomainResult(applyDomainPrefix, applyFullDomainName);
        }
        catch (Exception e) {
            log.error("申请企业域名失败：", e);
            throw new BusinessException("申请企业域名失败");
        }
    }

    /**
     * 填充企业微信消息推送Url
     *
     * @param messageUrl    消息推送Url（不携带域名只有 path）
     * @param variable      url变量参数
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
     * 获取应用可见范围信息
     *
     * @param corpId                企业Id
     * @param agentId               企业应用Id
     * @param switchoverToTempAuth  是否切换到临时授权
     * @return 应用可见区域
     */
    private WeComAppVisibleScope getAppVisibleScopes(String corpId, Integer agentId, boolean switchoverToTempAuth) {
        WxCpAgent corpAgent = this.getCorpAgent(corpId, agentId, switchoverToTempAuth);
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("企业微信应用「%s」未启用", corpAgent.getName()));
        }
        // 判断可见区域是否都为空
        if (ObjectUtil.isAllEmpty(corpAgent.getAllowParties().getPartyIds(), corpAgent.getAllowUserInfos())) {
            throw new BusinessException(String.format("企业微信应用「%s」可见区域为空，请调整后再试", corpAgent.getName()));
        }
        return new WeComAppVisibleScope()
                .setClose(corpAgent.getClose())
                .setAllowUserInfos(corpAgent.getAllowUserInfos())
                .setAllowParties(corpAgent.getAllowParties())
                .setAllowTags(corpAgent.getAllowTags());
    }

    /**
     * 增量同步企业微信通讯录
     * 需要在前置方法切换企业微信ServiceApi上下文
     *
     * @param contactMeta   同步通讯录元数据
     * @param visibleScope  应用可见区域
     * @return 本次同步的企业微信用户Id
     * @author Pengap
     * @date 2021/8/16 12:05:11
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
            // 授权顶级可见区域 - 部门
            List<Long> partyIds = visibleScope.getAllowParties().getPartyIds();
            // 授权顶级可见区域 - 人员
            List<String> userIds = Optional.of(visibleScope.getAllowUserInfos().getUsers()).orElseGet(ArrayList::new)
                    .stream()
                    .map(User::getUserId)
                    .collect(Collectors.toList());

            /* 拉取同步历史数据 start */
            // 拉取同步过的成员openId -> CahceWeComLinkMember
            List<TenantMemberDto> memberList = iMemberService.getMemberOpenIdListBySpaceId(spaceId);
            Map<String, CahceWeComUserLinkVikaMember> memberListByOpendIdToMap = memberList.stream()
                    // 由于主管理在上面手动初始化，这里需要过滤
                    .filter(dto -> !dto.getMemberId().equals(mainAdminMemberId))
                    .collect(Collectors.toMap(TenantMemberDto::getOpenId, dto -> {
                        CahceWeComUserLinkVikaMember cahceData = CahceWeComUserLinkVikaMember.builder().openId(dto.getOpenId()).memberId(dto.getMemberId()).memberName(dto.getMemberName()).build();
                        // 查询关联组织Ids
                        cahceData.setOldUnitTeamIds(CollUtil.newHashSet(iTeamMemberRelService.getTeamByMemberId(cahceData.getMemberId())));
                        return cahceData;
                    }));
            contactMeta.weComUserToVikaMemberMap.putAll(memberListByOpendIdToMap);
            // 拉取同步过企业微信成员
            Map<String, Long> openIdToMemberIdMap = iSocialCpTenantUserService.getOpenIdsByTenantId(corpId, agentId);
            if (MapUtil.isNotEmpty(openIdToMemberIdMap)) {
                contactMeta.syncedWeComUserIdsByTenant.putAll(openIdToMemberIdMap);
            }
            // 拉取同步过的部门信息
            List<TenantDepartmentBindDTO> teamList = iSocialTenantDepartmentService.getTenantBindTeamListBySpaceId(spaceId);
            Map<String, CahceWeComTeamLinkVikaTeam> teamListByDepartmentIdToMap = teamList.stream().collect(Collectors.toMap(TenantDepartmentBindDTO::getDepartmentId, dto -> CahceWeComTeamLinkVikaTeam.builder()
                    .id(dto.getId()).departmentName(dto.getDepartmentName())
                    .departmentId(dto.getDepartmentId()).openDepartmentId(dto.getOpenDepartmentId())
                    .parentDepartmentId(dto.getParentDepartmentId()).parentOpenDepartmentId(dto.getParentOpenDepartmentId())
                    .teamId(dto.getTeamId()).parentTeamId(dto.getParentTeamId())
                    .internalSequence(dto.getInternalSequence())
                    .build()));
            contactMeta.weComTeamToVikaTeamMap.putAll(teamListByDepartmentIdToMap);
            /* 拉取同步历史数据 end */

            // 允许同步的成员状态
            Integer[] allowUserStatus = { WeComUserStatus.ACTIVE.getCode(), WeComUserStatus.NOT_ACTIVE.getCode() };
            // 拉取可见区域授权 - 通讯录
            List<WxCpDepart> wxCpDepartList = departmentService.list(null);
            // 当前拉取企业微信通讯录所有的部门Id
            List<String> currentPullWeComDepartIds = wxCpDepartList.stream().map(wxCpDepart -> wxCpDepart.getId().toString()).collect(Collectors.toList());
            List<WxCpUser> wxCpUserLisr = new ArrayList<>();
            // 拉取可见区域授权 - 成员
            for (String userId : userIds) {
                WxCpUser wxCpUser = userService.getById(userId);
                if (!ArrayUtil.contains(allowUserStatus, wxCpUser.getStatus())) {
                    // 不允许拉取直接跳过
                    continue;
                }
                Long[] cpUserRelDepartIds = wxCpUser.getDepartIds();
                // 如果人员部门不存在可见区域所授权的部门集合，直接挂钩顶级部门
                if (!CollUtil.containsAny(currentPullWeComDepartIds, Convert.toList(String.class, cpUserRelDepartIds))) {
                    // 增量创建
                    this.createMemberAndBindTeamRel(wxCpUser, rootTeamId, contactMeta);
                }
            }
            // 尝试构建通讯录树结构
            Comparator<WxCpDepart> comparing = Comparator.comparing(o -> {
                final int index = partyIds.indexOf(o.getId());
                boolean isExist = currentPullWeComDepartIds.contains(o.getParentId().toString());
                return (index == -1 || isExist) ? Integer.MAX_VALUE : index;
            });
            // 强制根据可见区域部门优先排序
            wxCpDepartList = wxCpDepartList.stream().sorted(comparing.thenComparing(Comparator.comparing(WxCpDepart::getOrder).reversed())).collect(Collectors.toList());
            List<WeComDepartTree> nodeList = CollUtil.newArrayList();
            for (WxCpDepart depart : wxCpDepartList) {
                // 添加支撑树结构数据
                nodeList.add(new WeComDepartTree(depart.getId().toString(), depart.getName(), depart.getEnName(), depart.getParentId().toString(), depart.getOrder()));
            }
            List<WeComDepartTree> tryBulidTree = TreeUtil.build(nodeList, null, new NotRelyTryTreeBuildFactory<>());
            // 创建部门 - 循环树结构，tryBulidTree表示：顶级数据
            for (WeComDepartTree departTree : tryBulidTree) {
                // treeToList表示：顶级下所有数据，顶级+子集数据
                List<WeComDepartTree> departDatas = TreeUtil.treeToList(departTree);
                // 拉取部门下用户 - 只是拉取简单的信息
                List<WxCpUser> wxCpUsers = userService.listByDepartment(Long.valueOf(departTree.getId()), true, null);
                if (CollUtil.isNotEmpty(wxCpUsers)) {
                    wxCpUserLisr.addAll(wxCpUsers);
                }
                int i = 0, multiple = 2000;
                for (WeComDepartTree depart : departDatas) {
                    if (depart.getId().equals(WeComConstants.ROOT_DEPART_ID)) {
                        // 不同步第三方根部门
                        continue;
                    }
                    String departId = depart.getId();
                    Long teamId = IdWorker.getId();

                    // 树形结构反转成集合所有数据是有序的
                    CahceWeComTeamLinkVikaTeam cahceTeam = contactMeta.getCahceTeam(departId);
                    // 父Id
                    Long teamPid = contactMeta.getCahceTeamId(depart.getParentId());
                    boolean isExist = true;
                    if (null != cahceTeam && !(isExist = currentPullWeComDepartIds.contains(cahceTeam.getParentOpenDepartmentId()))) {
                        // 父节点不存在本次可见区域，直接划分到根部门
                        teamPid = rootTeamId;
                    }
                    // 第三方root节点
                    String tenantTeamPid = rootTeamId.equals(teamPid) ? WeComConstants.ROOT_DEPART_PARENT_ID : depart.getParentId();
                    // 排序
                    int departSequence = depart.getOrder() > Integer.MAX_VALUE ? Integer.MAX_VALUE : depart.getOrder().intValue();
                    int internalSequence = (depart.getLevel() + 1) * multiple + i;
                    if (null == cahceTeam) {
                        // 创建部门结构
                        TeamEntity team = OrganizationFactory.createTeam(spaceId, teamId, teamPid, depart.getName(), internalSequence);
                        team.setTeamLevel(depart.getLevel() + 2);
                        contactMeta.teamEntities.add(team);
                        SocialTenantDepartmentEntity weComTenantDepartment = SocialFactory.createWeComTenantDepartment(spaceId, corpId, depart)
                                .setParentId(tenantTeamPid)
                                .setDepartmentOrder(departSequence);
                        contactMeta.tenantDepartmentEntities.add(weComTenantDepartment);
                        SocialTenantDepartmentBindEntity tenantDepartmentBind = SocialFactory.createTenantDepartmentBind(spaceId, team.getId(), corpId, departId);
                        contactMeta.tenantDepartmentBindEntities.add(tenantDepartmentBind);
                        // 同步关系
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
                            // 部门层级改变，或父节点移除可见范围
                            updateTenantDepartment = SocialTenantDepartmentEntity.builder()
                                    .id(cahceTeam.getId())
                                    .parentId(tenantTeamPid).parentOpenDepartmentId(depart.getParentId())
                                    .build();
                            updateTeam = TeamEntity.builder().id(cahceTeam.getTeamId()).parentId(teamPid).build();
                            // 更新缓存
                            cahceTeam.setParentDepartmentId(updateTenantDepartment.getParentId());
                            cahceTeam.setParentOpenDepartmentId(updateTenantDepartment.getParentOpenDepartmentId());
                            cahceTeam.setParentTeamId(updateTeam.getParentId());
                        }
                        if (!cahceTeam.getDepartmentName().equals(depart.getName())) {
                            // 部门名称改变
                            updateTenantDepartment = Optional.ofNullable(updateTenantDepartment)
                                    .orElse(SocialTenantDepartmentEntity.builder().id(cahceTeam.getId()).build())
                                    .setDepartmentName(depart.getName());
                            updateTeam = Optional.ofNullable(updateTeam).orElse(TeamEntity.builder().id(cahceTeam.getTeamId()).build())
                                    .setTeamName(depart.getName());
                            // 更新缓存
                            cahceTeam.setDepartmentName(updateTeam.getTeamName());
                        }
                        if (cahceTeam.getInternalSequence() != internalSequence) {
                            // 部门顺序改变
                            updateTenantDepartment = Optional.ofNullable(updateTenantDepartment)
                                    .orElse(SocialTenantDepartmentEntity.builder().id(cahceTeam.getId()).build())
                                    .setDepartmentOrder(departSequence);
                            updateTeam = Optional.ofNullable(updateTeam).orElse(TeamEntity.builder().id(cahceTeam.getTeamId()).build())
                                    .setSequence(internalSequence);
                            // 更新缓存
                            cahceTeam.setInternalSequence(updateTeam.getSequence());
                        }

                        if (!ObjectUtil.hasNull(updateTenantDepartment, updateTeam)) {
                            // 添加到修改集合
                            cahceTeam.setOp(SyncOperation.UPDATE);
                            contactMeta.updateTenantDepartmentEntities.add(updateTenantDepartment);
                            contactMeta.updateTeamEntities.add(updateTeam);
                        }
                        else {
                            // 没有修改
                            cahceTeam.setOp(SyncOperation.KEEP);
                        }
                    }
                    // 添加 wecom TO vika 对应部门
                    cahceTeam.setIsCurrentSync(true); // 标记本次同步的部门
                    contactMeta.weComTeamToVikaTeamMap.put(departId, cahceTeam);
                    i++;
                }
            }
            // 转换结构，根据部门划分成员，成员可以存在于多个部门中
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
            // 创建成员 - 成员可以存在多个部门中，但是都是同一个memberId
            for (Entry<Long, List<WxCpUser>> entry : groupCpUser.entrySet()) {
                Long departId = entry.getKey();
                List<WxCpUser> wxCpUserList = entry.getValue();
                for (WxCpUser wxCpUser : wxCpUserList) {
                    if (!ArrayUtil.contains(allowUserStatus, wxCpUser.getStatus())) {
                        // 不允许拉取直接跳过
                        continue;
                    }
                    // 增量创建
                    this.createMemberAndBindTeamRel(wxCpUser, departId, contactMeta);
                }
            }
        }
        catch (Exception e) {
            log.error("同步企业微信通讯录错误：", e);
            String errorMsg = "同步企业微信通讯录失败：%s";
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
            // 关闭服务
            weComTemplate.closeService();
        }

        // 删除部门
        contactMeta.doDeleteTeams();
        // 删除成员
        contactMeta.doDeleteMembers();
        // 删除成员关联关系
        contactMeta.doDeleteMemberRels();
        // 存储到DB
        contactMeta.doSaveOrUpdate();
        // 清理VikaUser缓存
        userSpaceService.delete(spaceId);

        return contactMeta;
    }

    /**
     * 空间站成员绑定企业微信租户成员
     *
     * @param memberId          vika memberId
     * @param userId            vika用户Id
     * @param cpTenantUserId    企业微信租户用户Id
     * @param weComUserId       企业微信成员Id
     * @author Pengap
     * @date 2021/8/18 11:47:26
     */
    private void bindSpaceMemberToSocialTenantUser(Long memberId, Long userId, Long cpTenantUserId, String weComUserId) {
        boolean isBind = iSocialCpUserBindService.isCpTenantUserIdBind(userId, cpTenantUserId);
        if (!isBind) {
            iSocialCpUserBindService.create(userId, cpTenantUserId);
        }
        // 修改Member关联的openId
        iMemberService.updateById(MemberEntity.builder().id(memberId).openId(weComUserId).build());
    }

    /**
     * 创建member并且绑定组织关联
     * 如果已创建的用户不会重复创建
     *
     * @param wxCpUser      企业微信用户
     * @param departId      企业微信部门Id
     * @param contactMeta   元数据
     */
    private void createMemberAndBindTeamRel(WxCpUser wxCpUser, Long departId, ContactMeta contactMeta) {
        String wecomUserId = wxCpUser.getUserId();
        CahceWeComUserLinkVikaMember cahceMember = contactMeta.weComUserToVikaMemberMap.get(wecomUserId);
        Long cahceCpTenantUserId = contactMeta.syncedWeComUserIdsByTenant.get(wecomUserId);
        // 判断本次操作有没有同步
        if (!contactMeta.currentSyncWeComUserIds.contains(wecomUserId)) {
            // 如果Member不存在创建一个
            if (null == cahceMember) {
                MemberEntity member = SocialFactory.createWeComMemberAndBindSpace(contactMeta.spaceId, wxCpUser);
                contactMeta.memberEntities.add(member);
                cahceMember = CahceWeComUserLinkVikaMember.builder().memberId(member.getId()).memberName(member.getMemberName()).openId(wecomUserId).isNew(true).build();
            }
            else {
                // 存在查看是否需要修改关键信息
                if (!cahceMember.getMemberName().equals(wxCpUser.getName())) {
                    MemberEntity updateMember = MemberEntity.builder().id(cahceMember.getMemberId()).memberName(wxCpUser.getName()).build();
                    contactMeta.updateMemberEntities.add(updateMember);
                }
            }
            // 标记本次同步的用户
            cahceMember.setIsCurrentSync(true);
            // 如果企业微信成员不存在创建一个
            if (null == cahceCpTenantUserId) {
                SocialCpTenantUserEntity weComTenantUser = SocialFactory.createWeComTenantUser(contactMeta.tenantId, String.valueOf(contactMeta.appId), wecomUserId);
                contactMeta.tenantCpUserEntities.add(weComTenantUser);
                // 添加企业微信成员 key:cpUserId value:cpTenantUserId
                contactMeta.syncedWeComUserIdsByTenant.put(wecomUserId, weComTenantUser.getId());
            }
        }
        // 绑定部门，如果缓存中没有对应的部门关系，直接挂钩Root部门
        Long cahceTeamId = contactMeta.getCahceTeamId(String.valueOf(departId));
        cahceMember.getNewUnitTeamIds().add(cahceTeamId);
        if (CollUtil.isEmpty(cahceMember.getOldUnitTeamIds()) || (CollUtil.isNotEmpty(cahceMember.getOldUnitTeamIds()) && !cahceMember.getOldUnitTeamIds().contains(cahceTeamId))) {
            // 成员历史不存在部门下，添加成员和部门关联记录
            contactMeta.teamMemberRelEntities.add(OrganizationFactory.createTeamMemberRel(cahceTeamId, cahceMember.getMemberId()));
        }
        // 添加操作同步企业微信用户记录
        contactMeta.currentSyncWeComUserIds.add(wecomUserId);
        // 添加 wecom TO vika 对应User
        contactMeta.weComUserToVikaMemberMap.put(wecomUserId, cahceMember);
    }

    /**
     * 创建和修改租户授权信息
     *
     * @param tenantId      企业Id
     * @param appId         企业应用Id
     * @param status        启用状态
     * @param visibleScope  企业应用可见区域信息
     * @param authInfo      企业应用授权信息
     * @return 新增的租户信息
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
                throw new RuntimeException("新增租户失败");
            }
            return tenant;
        }
        catch (Exception e) {
            throw new RuntimeException("新增租户失败");
        }
    }

    /**
     * 创建企业微信应用菜单
     *
     * @param corpId    企业Id
     * @param agentId   企业应用Id
     * @param spaceId   空间站Id
     */
    private WxMenu createWeComMenu(String corpId, Integer agentId, String spaceId) {
        WxMenu menu = new WxMenu();
        List<WxMenuButton> wxMenuButtonList = new ArrayList<>();

        String domainNameCarryHttps = iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, true);
        // 填充域名参数变量
        Dict variable = Dict.create()
                .set("corpId", corpId)
                .set("agentId", agentId)
                .set("https_enp_domain", domainNameCarryHttps);

        WeComConfig config = weComTemplate.getConfig();
        if (CollUtil.isNotEmpty(config.getInitMenus())) {
            for (InitMenu initMenu : config.getInitMenus()) {
                // 一级菜单
                WxMenuButton wxMenu = this.fillWxMenuButton(initMenu, domainNameCarryHttps, variable);

                if (CollUtil.isNotEmpty(initMenu.getSubButtons())) {
                    // 二级菜单
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
     * 填充菜单参数
     */
    private WxMenuButton fillWxMenuButton(InitMenu initMenu, String domainNameCarryHttps, Dict variable) {
        WxMenuButton wxMenu = new WxMenuButton();
        String url = initMenu.getUrl();
        if ("/".equals(url)) {
            // 主页
            String wecomCallbackPath = WeComCardFactory.getWecomCallbackPath();
            url = this.fillingSendWeComMsgUrl(wecomCallbackPath, variable);
        }
        else if (!ReUtil.contains("http://|https://", url)) {
            // 自动填充Url，域名
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
        // 空间站Id
        String spaceId;

        // 第三方企业Id
        String tenantId;

        // 第三方企业应用Id
        String appId;

        // 空间的根组织Id
        Long rootTeamId;

        // 空间站主管理员成员Id
        Long mainAdminMemberId;

        // 保存企业微信用户对应VikaMember关系 wecom（UserId） => vika（CahceWeComUserLinkVikaMember）
        Map<String, CahceWeComUserLinkVikaMember> weComUserToVikaMemberMap = new CaseInsensitiveMap<>();

        // 保存企业微信部门对应VikaTeam关系 wecom（DepartmentId） => vika（CahceWeComTeamLinkVikaTeam）
        Map<String, CahceWeComTeamLinkVikaTeam> weComTeamToVikaTeamMap = MapUtil.newHashMap(true);

        // 获取：缓存，已同步的企业微信用户，按照企业应用拉取 key:wecomUserId value:cpTenantUserId
        Map<String, Long> syncedWeComUserIdsByTenant = new CaseInsensitiveMap<>();

        // 记录当前（本次）同步的WeCom用户ID
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

        // 获取缓存TeamId，无数据默认：rootTeamId
        Long getCahceTeamId(String weComDepartId) {
            return Optional.ofNullable(this.weComTeamToVikaTeamMap.get(weComDepartId))
                    .map(CahceWeComTeamLinkVikaTeam::getTeamId)
                    .orElse(rootTeamId);
        }

        // 获取缓存Team
        CahceWeComTeamLinkVikaTeam getCahceTeam(String weComDepartId) {
            return this.weComTeamToVikaTeamMap.get(weComDepartId);
        }

        // 根据Vika成员Id获取WeComTenantUserId
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
            // 计算需要删除的小组
            List<Long> oldTeamIds = iTeamService.getTeamIdsBySpaceId(spaceId);
            Map<Long, String> newTeams = this.weComTeamToVikaTeamMap.values().stream()
                    .filter(CahceWeComTeamLinkVikaTeam::getIsCurrentSync)
                    .collect(Collectors.toMap(CahceWeComTeamLinkVikaTeam::getTeamId, CahceWeComTeamLinkVikaTeam::getDepartmentId));

            Set<Long> newTeamIds = new HashSet<>(newTeams.keySet());
            newTeamIds.add(rootTeamId);

            // 计算交集，没有变更的部门
            newTeamIds.retainAll(oldTeamIds);
            if (!newTeamIds.isEmpty()) {
                // 计算差集，需要删除的部门
                oldTeamIds.removeAll(newTeamIds);
            }

            if (CollUtil.isNotEmpty(oldTeamIds)) {
                List<Long> currentSyncMemberUsers = this.weComUserToVikaMemberMap.values().stream()
                        .filter(CahceWeComUserLinkVikaMember::getIsCurrentSync)
                        .map(CahceWeComUserLinkVikaMember::getMemberId).collect(Collectors.toList());

                Map<Long, String> teamToWecomTeamMap = this.weComTeamToVikaTeamMap.values().stream()
                        .collect(Collectors.toMap(CahceWeComTeamLinkVikaTeam::getTeamId, CahceWeComTeamLinkVikaTeam::getDepartmentId));

                for (Long deleteTeamId : oldTeamIds) {
                    // 删除Vika部门下面的Menber，出现人员存在多个部门，需要判断本次同步人员在不在列表中，如果存在就不删除人员，反之删除
                    List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(deleteTeamId);
                    memberIds.removeAll(currentSyncMemberUsers);

                    String deleteWeComTeamId = teamToWecomTeamMap.get(deleteTeamId);
                    if (StrUtil.isNotBlank(deleteWeComTeamId)) {
                        // 移除部门 - 删除第三方部门，并且删除绑定关系，并且删除Vika部门
                        iSocialTenantDepartmentService.deleteSpaceTenantDepartment(spaceId, tenantId, deleteWeComTeamId);
                    }
                    else {
                        // 表示没有绑定过，直接删除Vika部门
                        iTeamService.deleteTeam(deleteTeamId);
                    }
                    // 移除成员
                    iMemberService.batchDeleteMemberFromSpace(spaceId, memberIds, false);
                    List<Long> deleteCpTenantUserId = this.getCpTenantUserIdByMemberId(memberIds);
                    // 移除Vika成员历史绑定企业微信成员关系
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

            // 计算交集，没有变更的用户
            newMemberIds.retainAll(oldMemberIds);
            if (!newMemberIds.isEmpty()) {
                // 计算差集，需要删除的用户
                oldMemberIds.removeAll(newMemberIds);
            }

            Set<String> newWeComUserIds = this.weComUserToVikaMemberMap.values().stream()
                    .filter(CahceWeComUserLinkVikaMember::getIsNew)
                    .map(CahceWeComUserLinkVikaMember::getOpenId)
                    .collect(Collectors.toSet());
            // 重新计算本次新增的用户
            currentSyncWeComUserIds.retainAll(newWeComUserIds);

            // 移除成员
            iMemberService.batchDeleteMemberFromSpace(spaceId, oldMemberIds, false);
            List<Long> deleteCpTenantUserId = this.getCpTenantUserIdByMemberId(oldMemberIds);
            // 移除Vika成员历史绑定企业微信成员关系
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
