package com.vikadata.api.modular.social.controller;

import java.util.ArrayList;
import java.util.Objects;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.net.NetUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.bean.WxCpAgent;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.ro.social.HotsTransformIpRo;
import com.vikadata.api.model.ro.social.WeComAgentBindSpaceRo;
import com.vikadata.api.model.ro.social.WeComCheckConfigRo;
import com.vikadata.api.model.ro.social.WeComUserLoginRo;
import com.vikadata.api.model.vo.social.SocialTenantEnvVo;
import com.vikadata.api.model.vo.social.WeComBindConfigVo;
import com.vikadata.api.model.vo.social.WeComBindSpaceVo;
import com.vikadata.api.model.vo.social.WeComCheckConfigVo;
import com.vikadata.api.model.vo.social.WeComUserLoginVo;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.event.wecom.WeComCardFactory;
import com.vikadata.api.modular.social.model.WeComCreateTempConfigResult;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.IWeComService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.social.wecom.model.WeComAuthInfo;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_NOT_EXIST;
import static com.vikadata.api.enums.exception.SocialException.APP_HAS_BIND_SPACE;
import static com.vikadata.api.enums.exception.SocialException.ONLY_TENANT_ADMIN_BOUND_ERROR;
import static com.vikadata.api.enums.exception.SocialException.SPACE_HAS_BOUND_TENANT;
import static com.vikadata.api.enums.exception.SocialException.TENANT_APP_BIND_INFO_NOT_EXISTS;
import static com.vikadata.api.enums.exception.SocialException.TENANT_NOT_BIND_SPACE;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_AUTH;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_BIND_WECOM;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST_WECOM;
import static com.vikadata.api.enums.exception.UserException.USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM;
import static com.vikadata.core.util.HttpContextUtil.X_REAL_HOST;

/**
 * <p>
 * 第三方平台集成接口 -- 企业微信
 * </p>
 * @author Pengap
 * @date 2021/7/28
 */
@RestController
@ApiResource(path = "/social")
@Api(tags = "第三方平台集成接口--企业微信")
@Slf4j
public class SocialWeComController {

    @Resource
    private IWeComService iWeComService;

    @Resource
    private IUserService userService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialCpUserBindService iSocialCpUserBindService;

    @Resource
    private SensorsService sensorsService;

    @PostResource(path = "/wecom/user/login", requiredLogin = false)
    @ApiOperation(value = "企业微信应用用户登录", notes = "使用企业微信登录用户身份授权登录, 未绑定任何用户时返回参数引导注册")
    public ResponseData<WeComUserLoginVo> weComUserLogin(@RequestBody @Valid WeComUserLoginRo body) {
        WxCpAgent corpAgent = iWeComService.getCorpAgent(body.getCorpId(), body.getAgentId());
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("企业微信应用「%s」未启用", corpAgent.getName()));
        }
        // 检查扫码用户是否在应用授权可见区域
        WxCpUser weComUser = iWeComService.getWeComUserByOAuth2Code(body.getCorpId(), body.getAgentId(), body.getCode());
        ExceptionUtil.isTrue(Objects.nonNull(weComUser) && StrUtil.isNotBlank(weComUser.getUserId()), USER_NOT_EXIST);
        log.info("企业微信应用「{}」，成员：「{} - {}」请求登陆", corpAgent.getName(), weComUser.getName(), weComUser.getUserId());
        // 检查登陆应用是否已绑定空间站
        String bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(body.getCorpId(), String.valueOf(body.getAgentId()));
        log.info("企业微信应用「{}」，成员：「{} - {}」，请求登陆空间站：「{} - {}」", corpAgent.getName(), weComUser.getName(), weComUser.getUserId(), corpAgent.getName(), bindSpaceId);
        ExceptionUtil.isNotBlank(bindSpaceId, NODE_NOT_EXIST);
        // 检查登陆人员是否存在Vika通讯录
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(bindSpaceId, weComUser.getUserId());
        ExceptionUtil.isNotNull(member, USER_NOT_EXIST_WECOM);
        // 检查是否已登陆，如果未注册，自动创建账户并设置当前用户登录
        SocialUser user = SocialUser.WECOM().tenantId(body.getCorpId()).appId(String.valueOf(body.getAgentId())).openId(weComUser.getUserId())
                .nickName(weComUser.getName()).avatar(weComUser.getAvatar()).build();
        Long userId = userService.createSocialUser(user);
        ExceptionUtil.isNotNull(userId, USER_NOT_AUTH);
        // 已绑定，自动登录
        SessionContext.setUserId(userId);
        log.info("企业微信应用「{}」，成员：「{} - {}」登陆用户「{}」到空间「{}」成功", corpAgent.getName(), weComUser.getName(), weComUser.getUserId(), userId, bindSpaceId);
        // 返回应用绑定空间Id
        WeComUserLoginVo result = new WeComUserLoginVo();
        result.setBindSpaceId(bindSpaceId);
        userService.updateLoginTime(userId);
        // 神策埋点 - 登录
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "企业微信免密登录", origin));
        return ResponseData.success(result);
    }

    @PostResource(path = "/wecom/check/config", requiredPermission = false)
    @ApiOperation(value = "企业微信校验-授权应用配置", notes = "绑定企业微信前，预先校验第三方应用配置，没有扫码验证成功配置文件都是未生效的")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<WeComCheckConfigVo> weComCheckConfig(@RequestBody @Valid WeComCheckConfigRo body) {
        Long loginMemberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        // 空间的主管理员成员ID
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        ExceptionUtil.isTrue(mainAdminMemberId.equals(loginMemberId), ONLY_TENANT_ADMIN_BOUND_ERROR);
        // 检查空间是否已经绑定其他平台租户
        boolean spaceBindStatus = iSocialTenantBindService.getSpaceBindStatus(spaceId);
        ExceptionUtil.isFalse(spaceBindStatus, SPACE_HAS_BOUND_TENANT);
        // 检查应用是否已经绑定其他空间站
        boolean appBindStatus = iSocialTenantBindService.getWeComTenantBindStatus(body.getCorpId(), String.valueOf(body.getAgentId()));
        ExceptionUtil.isFalse(appBindStatus, APP_HAS_BIND_SPACE);
        // 检查应用配置文件有效性
        WeComCheckConfigVo result = new WeComCheckConfigVo();
        WeComCreateTempConfigResult createResult = iWeComService.createTempAgentAuthConfig(body.getCorpId(), body.getAgentId(), body.getAgentSecret(), spaceId, true);
        result.setIsPass(StrUtil.isNotBlank(createResult.getConfigSha()));
        result.setConfigSha(createResult.getConfigSha());
        result.setDomainName(createResult.getDomainName());
        return ResponseData.success(result);
    }

    @PostResource(path = "/wecom/hotsTransformIp", requiredPermission = false)
    @ApiOperation(value = "企业微信校验-域名转换IP", notes = "用于生成企业微信扫码登录校验域名是否可以访问")
    public ResponseData<Boolean> hotsTransformIp(@RequestBody @Valid HotsTransformIpRo body, HttpServletRequest request) {
        String ipByHost = NetUtil.getIpByHost(body.getDomain());
        return ResponseData.success(Validator.isIpv4(ipByHost));
    }

    @PostResource(path = "/wecom/bind/{configSha}/config", requiredPermission = false)
    @ApiOperation(value = "企业微信应用绑定空间站", notes = "企业微信应用绑定空间站")
    public ResponseData<Void> weComBindConfig(@PathVariable("configSha") String configSha, @RequestBody @Valid WeComAgentBindSpaceRo body) {
        Long userId = SessionContext.getUserId();
        // 检查绑定信息是否有效
        WeComAuthInfo agentConfig = iWeComService.getConfigSha(configSha);
        ExceptionUtil.isNotNull(agentConfig, TENANT_APP_BIND_INFO_NOT_EXISTS);
        // 检查扫码用户是否在应用授权可见区域
        WxCpUser weComUser = iWeComService.getWeComUserByOAuth2Code(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getCode(), true);
        ExceptionUtil.isTrue(Objects.nonNull(weComUser) && StrUtil.isNotBlank(weComUser.getUserId()), USER_NOT_EXIST);
        // 检查空间是否已经绑定其他平台租户
        boolean spaceBindStatus = iSocialTenantBindService.getSpaceBindStatus(body.getSpaceId());
        ExceptionUtil.isFalse(spaceBindStatus, SPACE_HAS_BOUND_TENANT);
        // 检查应用是否已经绑定其他空间站
        boolean appBindStatus = iSocialTenantBindService.getWeComTenantBindStatus(agentConfig.getCorpId(), String.valueOf(agentConfig.getAgentId()));
        ExceptionUtil.isFalse(appBindStatus, APP_HAS_BIND_SPACE);
        // 兜底逻辑，校验绑定成员VikaUser是否是同一个
        // 主要是为了校验已经绑定成员，不能在绑定同一个企业下的其余成员
        String linkedWeComUserId = iSocialCpUserBindService.getOpenIdByTenantIdAndUserId(agentConfig.getCorpId(), userId);
        if (null != linkedWeComUserId) {
            ExceptionUtil.isTrue(linkedWeComUserId.equals(weComUser.getUserId()), USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM);
        }
        // 通过检查后，开始同步通讯录
        agentConfig.setOperatingBindUserId(userId)
                .setOperatingBindWeComUserId(weComUser.getUserId())
                .setOperatingBindWeComUser(weComUser);
        iWeComService.weComAppBindSpace(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getSpaceId(), agentConfig);
        // 成功同步通讯录后，开始发送欢迎使用卡片消息「全员发送」
        WxCpMessage welcomeMsg = WeComCardFactory.createWelcomeMsg(agentConfig.getAgentId());
        iWeComService.sendMessageToUserPrivate(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getSpaceId(), null, welcomeMsg);
        // 创建菜单
        iWeComService.createFixedMenu(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getSpaceId());
        return ResponseData.success();
    }

    @GetResource(path = "/wecom/refresh/contact", requiredPermission = false)
    @ApiOperation(value = "企业微信应用刷新通讯录", notes = "企业微信应用手动刷新通讯录")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<Void> weComRefreshContact() {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        // 查询空间站是否绑定企业微信应用
        WeComBindConfigVo bindConfig = iWeComService.getTenantBindWeComConfig(spaceId);
        Set<String> currentSyncWeComUserIds = iWeComService.weComRefreshContact(bindConfig.getCorpId(), bindConfig.getAgentId(), spaceId, userId);
        if (CollUtil.isNotEmpty(currentSyncWeComUserIds)) {
            // 成功同步通讯录后，开始发送欢迎使用卡片消息
            WxCpMessage welcomeMsg = WeComCardFactory.createWelcomeMsg(bindConfig.getAgentId());
            iWeComService.sendMessageToUserPrivate(bindConfig.getCorpId(), bindConfig.getAgentId(), spaceId, new ArrayList<>(currentSyncWeComUserIds), welcomeMsg);
        }
        return ResponseData.success();
    }

    @GetResource(path = "/wecom/get/config", requiredPermission = false)
    @ApiOperation(value = "获取空间站已绑定的企业微信应用配置", notes = "获取空间站已绑定的企业微信应用配置")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<WeComBindConfigVo> getTenantBindWeComConfig() {
        Long loginMemberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        // 空间的主管理员成员ID
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        ExceptionUtil.isTrue(mainAdminMemberId.equals(loginMemberId), ONLY_TENANT_ADMIN_BOUND_ERROR);
        WeComBindConfigVo data = iWeComService.getTenantBindWeComConfig(spaceId);
        return ResponseData.success(data);
    }

    @GetResource(path = "/wecom/agent/get/bindSpace", requiredLogin = false, requiredAccessDomain = true)
    @ApiOperation(value = "获取企业微信自建应用绑定的空间站ID", notes = "获取企业微信自建应用绑定的空间站ID,success=false的时候都跳转去登录页面")
    public ResponseData<WeComBindSpaceVo> bindSpaceInfo(@RequestParam(value = "corpId") String corpId, @RequestParam(value = "agentId") Integer agentId) {
        WxCpAgent corpAgent = iWeComService.getCorpAgent(corpId, agentId);
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("企业微信应用「%s」未启用", corpAgent.getName()));
        }
        Long userId = SessionContext.getUserId();
        // 检测应用是否绑定空间
        String bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, String.valueOf(agentId));
        ExceptionUtil.isNotBlank(bindSpaceId, TENANT_NOT_BIND_SPACE);
        // 检测用户是否绑定空间
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, bindSpaceId);
        ExceptionUtil.isNotNull(memberId, USER_NOT_BIND_WECOM);
        return ResponseData.success(WeComBindSpaceVo.builder().bindSpaceId(bindSpaceId).build());
    }

    @GetResource(path = "/tenant/env", requiredLogin = false, requiredAccessDomain = true)
    @ApiOperation(value = "获取集成租户环境配置", notes = "获取集成租户环境配置")
    @ApiImplicitParams({
            @ApiImplicitParam(name = X_REAL_HOST, value = "真实请求地址", required = true, dataTypeClass = String.class, paramType = "header", example = "spch5n5x2572s.enp.vika.ltd")
    })
    public ResponseData<SocialTenantEnvVo> socialTenantEnv(HttpServletRequest request) {
        String remoteHost = HttpContextUtil.getRemoteHost(request);
        return ResponseData.success(iWeComService.getWeComTenantEnv(remoteHost));
    }

}