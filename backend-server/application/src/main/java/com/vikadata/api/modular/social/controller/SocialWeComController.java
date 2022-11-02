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
 * Third party platform integration interface -- WeCom
 * </p>
 */
@RestController
@ApiResource(path = "/social")
@Api(tags = "Third party platform integration interface -- WeCom")
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
    @ApiOperation(value = "WeCom Application user login", notes = "Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound")
    public ResponseData<WeComUserLoginVo> weComUserLogin(@RequestBody @Valid WeComUserLoginRo body) {
        WxCpAgent corpAgent = iWeComService.getCorpAgent(body.getCorpId(), body.getAgentId());
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("WeCom application「%s」not enabled", corpAgent.getName()));
        }
        // Check whether the scanning user is in the application authorization visible area
        WxCpUser weComUser = iWeComService.getWeComUserByOAuth2Code(body.getCorpId(), body.getAgentId(), body.getCode());
        ExceptionUtil.isTrue(Objects.nonNull(weComUser) && StrUtil.isNotBlank(weComUser.getUserId()), USER_NOT_EXIST);
        log.info("WeCom application「{}」, Member:「{} - {}」Request Login", corpAgent.getName(), weComUser.getName(), weComUser.getUserId());
        // Check whether the login application is bound to the space station
        String bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(body.getCorpId(), String.valueOf(body.getAgentId()));
        log.info("WeCom application「{}」, Member:「{} - {}」, Request to land on the space:「{} - {}」", corpAgent.getName(), weComUser.getName(), weComUser.getUserId(), corpAgent.getName(), bindSpaceId);
        ExceptionUtil.isNotBlank(bindSpaceId, NODE_NOT_EXIST);
        // Check whether the login personnel have vika address book
        MemberEntity member = iMemberService.getBySpaceIdAndOpenId(bindSpaceId, weComUser.getUserId());
        ExceptionUtil.isNotNull(member, USER_NOT_EXIST_WECOM);
        // Check whether you have logged in. If not, automatically create an account and set the current user to login
        SocialUser user = SocialUser.WECOM().tenantId(body.getCorpId()).appId(String.valueOf(body.getAgentId())).openId(weComUser.getUserId())
                .nickName(weComUser.getName()).avatar(weComUser.getAvatar()).build();
        Long userId = userService.createSocialUser(user);
        ExceptionUtil.isNotNull(userId, USER_NOT_AUTH);
        // Automatic login if bound
        SessionContext.setUserId(userId);
        log.info("WeCom application「{}」, Memver:「{} - {}」Login User「{}」enter space「{}」success", corpAgent.getName(), weComUser.getName(), weComUser.getUserId(), userId, bindSpaceId);
        // Return the application binding space id
        WeComUserLoginVo result = new WeComUserLoginVo();
        result.setBindSpaceId(bindSpaceId);
        userService.updateLoginTime(userId);
        // Shence Burial Point - Login
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "WeCom Password free login", origin));
        return ResponseData.success(result);
    }

    @PostResource(path = "/wecom/check/config", requiredPermission = false)
    @ApiOperation(value = "WeCom Verification - Authorization Application Configuration", notes = "Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<WeComCheckConfigVo> weComCheckConfig(@RequestBody @Valid WeComCheckConfigRo body) {
        Long loginMemberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        // Primary administrator member ID of the space
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        ExceptionUtil.isTrue(mainAdminMemberId.equals(loginMemberId), ONLY_TENANT_ADMIN_BOUND_ERROR);
        // Check whether the space has been bound to other platform tenants
        boolean spaceBindStatus = iSocialTenantBindService.getSpaceBindStatus(spaceId);
        ExceptionUtil.isFalse(spaceBindStatus, SPACE_HAS_BOUND_TENANT);
        // Check whether the application has been bound to other space
        boolean appBindStatus = iSocialTenantBindService.getWeComTenantBindStatus(body.getCorpId(), String.valueOf(body.getAgentId()));
        ExceptionUtil.isFalse(appBindStatus, APP_HAS_BIND_SPACE);
        // Check the validity of the application configuration file
        WeComCheckConfigVo result = new WeComCheckConfigVo();
        WeComCreateTempConfigResult createResult = iWeComService.createTempAgentAuthConfig(body.getCorpId(), body.getAgentId(), body.getAgentSecret(), spaceId, true);
        result.setIsPass(StrUtil.isNotBlank(createResult.getConfigSha()));
        result.setConfigSha(createResult.getConfigSha());
        result.setDomainName(createResult.getDomainName());
        return ResponseData.success(result);
    }

    @PostResource(path = "/wecom/hotsTransformIp", requiredPermission = false)
    @ApiOperation(value = "WeCom Verification domain name conversion IP", notes = "Used to generate We Com scanning code to log in and verify whether the domain name can be accessed")
    public ResponseData<Boolean> hotsTransformIp(@RequestBody @Valid HotsTransformIpRo body, HttpServletRequest request) {
        String ipByHost = NetUtil.getIpByHost(body.getDomain());
        return ResponseData.success(Validator.isIpv4(ipByHost));
    }

    @PostResource(path = "/wecom/bind/{configSha}/config", requiredPermission = false)
    @ApiOperation(value = "WeCom Application binding space", notes = "WeCom Application binding space")
    public ResponseData<Void> weComBindConfig(@PathVariable("configSha") String configSha, @RequestBody @Valid WeComAgentBindSpaceRo body) {
        Long userId = SessionContext.getUserId();
        // Check whether the binding information is valid
        WeComAuthInfo agentConfig = iWeComService.getConfigSha(configSha);
        ExceptionUtil.isNotNull(agentConfig, TENANT_APP_BIND_INFO_NOT_EXISTS);
        // Check whether the scanning user is in the application authorization visible area
        WxCpUser weComUser = iWeComService.getWeComUserByOAuth2Code(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getCode(), true);
        ExceptionUtil.isTrue(Objects.nonNull(weComUser) && StrUtil.isNotBlank(weComUser.getUserId()), USER_NOT_EXIST);
        // Check whether the space has been bound to other platform tenants
        boolean spaceBindStatus = iSocialTenantBindService.getSpaceBindStatus(body.getSpaceId());
        ExceptionUtil.isFalse(spaceBindStatus, SPACE_HAS_BOUND_TENANT);
        // Check whether the application has been bound to other space stations
        boolean appBindStatus = iSocialTenantBindService.getWeComTenantBindStatus(agentConfig.getCorpId(), String.valueOf(agentConfig.getAgentId()));
        ExceptionUtil.isFalse(appBindStatus, APP_HAS_BIND_SPACE);
        // Verify whether the binding member vika user is the same
        // It is mainly used to verify the bound members, and cannot bind other members of the same enterprise
        String linkedWeComUserId = iSocialCpUserBindService.getOpenIdByTenantIdAndUserId(agentConfig.getCorpId(), userId);
        if (null != linkedWeComUserId) {
            ExceptionUtil.isTrue(linkedWeComUserId.equals(weComUser.getUserId()), USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM);
        }
        // After passing the check, start synchronizing the address book
        agentConfig.setOperatingBindUserId(userId)
                .setOperatingBindWeComUserId(weComUser.getUserId())
                .setOperatingBindWeComUser(weComUser);
        iWeComService.weComAppBindSpace(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getSpaceId(), agentConfig);
        // After successfully synchronizing the address book, start sending the welcome card message 「send to all」
        WxCpMessage welcomeMsg = WeComCardFactory.createWelcomeMsg(agentConfig.getAgentId());
        iWeComService.sendMessageToUserPrivate(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getSpaceId(), null, welcomeMsg);
        // create menu
        iWeComService.createFixedMenu(agentConfig.getCorpId(), agentConfig.getAgentId(), body.getSpaceId());
        return ResponseData.success();
    }

    @GetResource(path = "/wecom/refresh/contact", requiredPermission = false)
    @ApiOperation(value = "WeCom App Refresh Address Book", notes = "WeCom Apply to refresh the address book manually")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<Void> weComRefreshContact() {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        // Query whether the space station is bound to WeCom application
        WeComBindConfigVo bindConfig = iWeComService.getTenantBindWeComConfig(spaceId);
        Set<String> currentSyncWeComUserIds = iWeComService.weComRefreshContact(bindConfig.getCorpId(), bindConfig.getAgentId(), spaceId, userId);
        if (CollUtil.isNotEmpty(currentSyncWeComUserIds)) {
            // After successfully synchronizing the address book, start sending the welcome card message
            WxCpMessage welcomeMsg = WeComCardFactory.createWelcomeMsg(bindConfig.getAgentId());
            iWeComService.sendMessageToUserPrivate(bindConfig.getCorpId(), bindConfig.getAgentId(), spaceId, new ArrayList<>(currentSyncWeComUserIds), welcomeMsg);
        }
        return ResponseData.success();
    }

    @GetResource(path = "/wecom/get/config", requiredPermission = false)
    @ApiOperation(value = "Get the bound WeCom application configuration of the space station", notes = "Get the bound WeCom application configuration of the space station")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<WeComBindConfigVo> getTenantBindWeComConfig() {
        Long loginMemberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        // Primary administrator member ID of the space
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        ExceptionUtil.isTrue(mainAdminMemberId.equals(loginMemberId), ONLY_TENANT_ADMIN_BOUND_ERROR);
        WeComBindConfigVo data = iWeComService.getTenantBindWeComConfig(spaceId);
        return ResponseData.success(data);
    }

    @GetResource(path = "/wecom/agent/get/bindSpace", requiredLogin = false, requiredAccessDomain = true)
    @ApiOperation(value = "Obtain the space ID bound by the self built application of WeCom", notes = "Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false")
    public ResponseData<WeComBindSpaceVo> bindSpaceInfo(@RequestParam(value = "corpId") String corpId, @RequestParam(value = "agentId") Integer agentId) {
        WxCpAgent corpAgent = iWeComService.getCorpAgent(corpId, agentId);
        if (corpAgent.getClose() == 1) {
            throw new BusinessException(String.format("WeCom application「%s」not enabled", corpAgent.getName()));
        }
        Long userId = SessionContext.getUserId();
        // Check whether the application binds space
        String bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, String.valueOf(agentId));
        ExceptionUtil.isNotBlank(bindSpaceId, TENANT_NOT_BIND_SPACE);
        // Detect whether the user binds the space
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, bindSpaceId);
        ExceptionUtil.isNotNull(memberId, USER_NOT_BIND_WECOM);
        return ResponseData.success(WeComBindSpaceVo.builder().bindSpaceId(bindSpaceId).build());
    }

    @GetResource(path = "/tenant/env", requiredLogin = false, requiredAccessDomain = true)
    @ApiOperation(value = "Get integrated tenant environment configuration", notes = "Get integrated tenant environment configuration")
    @ApiImplicitParams({
            @ApiImplicitParam(name = X_REAL_HOST, value = "Real request address", required = true, dataTypeClass = String.class, paramType = "header", example = "spch5n5x2572s.enp.vika.ltd")
    })
    public ResponseData<SocialTenantEnvVo> socialTenantEnv(HttpServletRequest request) {
        String remoteHost = HttpContextUtil.getRemoteHost(request);
        return ResponseData.success(iWeComService.getWeComTenantEnv(remoteHost));
    }

}