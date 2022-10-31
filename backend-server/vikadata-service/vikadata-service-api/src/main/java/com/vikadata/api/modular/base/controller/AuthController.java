package com.vikadata.api.modular.base.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.auth.ConnectorTemplate;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.CookieProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.LoginType;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.dto.user.UserLoginResult;
import com.vikadata.api.model.ro.user.LoginRo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.modular.base.model.LogoutVO;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.finance.service.IBlackListService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.service.ISocialTenantDomainService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.security.afs.AfsCheckService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.auth0.Auth0Template;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authorization interface
 */
@RestController
@Api(tags = "Authorization related interface")
@ApiResource(path = "/")
@Slf4j
public class AuthController {

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ConnectorTemplate connectorTemplate;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISocialTenantDomainService iSocialTenantDomainService;

    @Resource
    private IBlackListService iBlackListService;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private CookieProperties cookieProperties;

    @Resource
    private ConstProperties constProperties;

    @Autowired(required = false)
    private Auth0Template auth0Template;

    private static final String AUTH_DESC = "description:\n" +
            "verifyType，available values:\n" +
            "password\n" +
            "sms_code\n" +
            "email_code";

    @PostResource(name = "Login", path = "/signIn", requiredLogin = false)
    @ApiOperation(value = "login", notes = AUTH_DESC, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> login(@RequestBody @Valid LoginRo data, HttpServletRequest request) {
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(request, false, true);
        // Login Type Routing
        Map<LoginType, Function<LoginRo, Long>> loginActionFunc = new HashMap<>();
        // password login
        loginActionFunc.put(LoginType.PASSWORD, loginRo -> {
            // Password login requires human-machine authentication
            afsCheckService.noTraceCheck(loginRo.getData());
            // Login processing
            Long userId = iAuthService.loginUsingPassword(loginRo);
            // sensors point - password login
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "Password", origin));
            return userId;
        });
        // SMS verification code login
        loginActionFunc.put(LoginType.SMS_CODE, loginRo -> {
            UserLoginResult result = iAuthService.loginUsingSmsCode(loginRo);
            // sensors point - Login or Register
            TrackEventType type = Boolean.TRUE.equals(result.getIsSignUp()) ? TrackEventType.REGISTER : TrackEventType.LOGIN;
            TaskManager.me().execute(() -> sensorsService.track(result.getUserId(), type, "Mobile verification code", origin));
            return result.getUserId();
        });
        // Email verification code login
        loginActionFunc.put(LoginType.EMAIL_CODE, loginRo -> {
            UserLoginResult result = iAuthService.loginUsingEmailCode(loginRo);
            // sensors point - Login or Register
            TrackEventType type = Boolean.TRUE.equals(result.getIsSignUp()) ? TrackEventType.REGISTER : TrackEventType.LOGIN;
            TaskManager.me().execute(() -> sensorsService.track(result.getUserId(), type, "Email verification code", origin));
            return result.getUserId();
        });
        // SSO login (private user use)
        loginActionFunc.put(LoginType.SSO_AUTH, loginRo -> connectorTemplate.loginBySso(data.getUsername(), data.getCredential()));
        // Handling login logic
        Long userId = loginActionFunc.get(data.getType()).apply(data);
        // Banned account verification
        iBlackListService.checkBlackUser(userId);
        // save session
        SessionContext.setUserId(userId);
        return ResponseData.success();
    }

    @PostResource(name = "sign out", path = "/signOut", requiredPermission = false, method = { RequestMethod.GET, RequestMethod.POST })
    @ApiOperation(value = "sign out", notes = "log out of current user")
    public ResponseData<LogoutVO> logout(HttpServletRequest request, HttpServletResponse response) {
        SessionContext.cleanContext(request);
        SessionContext.removeCookie(response, cookieProperties.getI18nCookieName(), cookieProperties.getDomainName());
        LogoutVO logoutVO = new LogoutVO();
        if (auth0Template != null) {
            String logoutUrl = auth0Template.buildLogoutUrl(constProperties.getServerDomain());
            if (log.isDebugEnabled()) {
                log.debug("logout redirect url: {}", logoutUrl);
            }
            logoutVO.setNeedRedirect(true);
            logoutVO.setRedirectUri(logoutUrl);
        }
        return ResponseData.success(logoutVO);
    }

    @GetResource(name = "get personal information", path = "/user/me", requiredPermission = false)
    @ApiOperation(value = "get personal information", notes = "get personal information", produces =
            MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "space id", dataTypeClass = String.class, paramType = "query", example = "spc8mXUeiXyVo"),
            @ApiImplicitParam(name = "nodeId", value = "node id", dataTypeClass = String.class, paramType = "query", example = "dstS94qPZFXjC1LKns"),
            @ApiImplicitParam(name = "filter", value = "whether to filter space related information", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query", example = "true")
    })
    public ResponseData<UserInfoVo> userInfo(@RequestParam(name = "spaceId", required = false) String spaceId,
            @RequestParam(name = "nodeId", required = false) String nodeId,
            @RequestParam(name = "filter", required = false, defaultValue = "false") Boolean filter,
            HttpServletRequest request) {
        Long userId = SessionContext.getUserId();

        // try to return Space Id
        spaceId = tryReturnSpaceId(nodeId, spaceId, userId, request);

        // Get user information
        UserInfoVo userInfo = iUserService.getCurrentUserInfo(userId, spaceId, filter);

        // Returns the domain name bound to the space station
        String spaceDomain = returnSpaceDomain(spaceId, userInfo.getSpaceId());
        userInfo.setSpaceDomain(spaceDomain);
        return ResponseData.success(userInfo);
    }

    // Before getting the user information, try to return the Space Id first
    private String tryReturnSpaceId(String nodeId, String spaceId, Long userId, HttpServletRequest request) {
        if (StrUtil.isNotBlank(nodeId)) {
            // 1.Use url - NodeId to locate the space and return the bound domain name
            return iNodeService.getSpaceIdByNodeIdIncludeDeleted(nodeId);
        }
        if (StrUtil.isBlank(spaceId)) {
            // 2.The user does not actively locate the space station behavior - use the current access domain name to locate the space station
            String remoteHost = HttpContextUtil.getRemoteHost(request);
            String domainBindSpaceId = iSocialTenantDomainService.getSpaceIdByDomainName(remoteHost);
            if (StrUtil.isNotBlank(domainBindSpaceId)) {
                // Exception: The registrant uses an exclusive domain name, and then logs in with an account and password;
                // Return to the exclusive domain name space station The current registrant does not have permission to operate the space;
                // At that time, return the last active space ID of the user
                Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, domainBindSpaceId);
                if (ObjectUtil.isNull(memberId)) {
                    // No operation permission, get the last active node of active users
                    return userActiveSpaceService.getLastActiveSpace(userId);
                }
                else {
                    return domainBindSpaceId;
                }
            }
        }
        return spaceId;
    }

    // Return the space station domain name
    private String returnSpaceDomain(String spaceId, String userSpaceId) {
        // Returns the domain name information, and returns the public domain name if there is no credential acquisition or search
        if (StrUtil.isNotBlank(spaceId)) {
            // 3.If the precondition space Id is not empty, return the bound domain name directly
            return iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, false);
        }
        else {
            // 4.If there is none, operate according to the last active space
            if (StrUtil.isBlank(userSpaceId)) {
                return iSocialTenantDomainService.getSpaceDefaultDomainName();
            }
            else {
                return iSocialTenantDomainService.getDomainNameBySpaceId(userSpaceId, false);
            }
        }
    }
}
