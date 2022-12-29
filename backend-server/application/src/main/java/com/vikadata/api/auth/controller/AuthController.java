package com.vikadata.api.auth.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.auth.dto.UserLoginDTO;
import com.vikadata.api.auth.ro.LoginRo;
import com.vikadata.api.auth.service.IAuthService;
import com.vikadata.api.auth.vo.LogoutVO;
import com.vikadata.api.auth.enums.LoginType;
import com.vikadata.api.base.enums.TrackEventType;
import com.vikadata.api.base.service.SensorsService;
import com.vikadata.api.interfaces.auth.facade.AuthServiceFacade;
import com.vikadata.api.interfaces.auth.model.AuthParam;
import com.vikadata.api.interfaces.auth.model.UserAuth;
import com.vikadata.api.interfaces.auth.model.UserLogout;
import com.vikadata.api.interfaces.security.facade.BlackListServiceFacade;
import com.vikadata.api.interfaces.security.facade.HumanVerificationServiceFacade;
import com.vikadata.api.interfaces.security.model.NonRobotMetadata;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.config.properties.CookieProperties;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.util.information.ClientOriginInfo;
import com.vikadata.api.shared.util.information.InformationUtil;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
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
    private SensorsService sensorsService;

    @Resource
    private BlackListServiceFacade blackListServiceFacade;

    @Resource
    private CookieProperties cookieProperties;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    @Resource
    private AuthServiceFacade authServiceFacade;

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
            humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(loginRo.getData()));
            // Login processing
            Long userId = iAuthService.loginUsingPassword(loginRo);
            // sensors point - password login
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "Password", origin));
            return userId;
        });
        // SMS verification code login
        loginActionFunc.put(LoginType.SMS_CODE, loginRo -> {
            UserLoginDTO result = iAuthService.loginUsingSmsCode(loginRo);
            // sensors point - Login or Register
            TrackEventType type = Boolean.TRUE.equals(result.getIsSignUp()) ? TrackEventType.REGISTER : TrackEventType.LOGIN;
            TaskManager.me().execute(() -> sensorsService.track(result.getUserId(), type, "Mobile verification code", origin));
            return result.getUserId();
        });
        // Email verification code login
        loginActionFunc.put(LoginType.EMAIL_CODE, loginRo -> {
            UserLoginDTO result = iAuthService.loginUsingEmailCode(loginRo);
            // sensors point - Login or Register
            TrackEventType type = Boolean.TRUE.equals(result.getIsSignUp()) ? TrackEventType.REGISTER : TrackEventType.LOGIN;
            TaskManager.me().execute(() -> sensorsService.track(result.getUserId(), type, "Email verification code", origin));
            return result.getUserId();
        });
        // SSO login (private user use)
        loginActionFunc.put(LoginType.SSO_AUTH, loginRo -> {
            UserAuth userAuth = authServiceFacade.ssoLogin(new AuthParam(data.getUsername(), data.getCredential()));
            return userAuth != null ? userAuth.getUserId() : null;
        });
        // Handling login logic
        Long userId = loginActionFunc.get(data.getType()).apply(data);
        // Banned account verification
        blackListServiceFacade.checkUser(userId);
        // save session
        SessionContext.setUserId(userId);
        return ResponseData.success();
    }

    @PostResource(name = "sign out", path = "/signOut", requiredPermission = false, method = { RequestMethod.GET, RequestMethod.POST })
    @ApiOperation(value = "sign out", notes = "log out of current user")
    public ResponseData<LogoutVO> logout(HttpServletRequest request, HttpServletResponse response) {
        LogoutVO logoutVO = new LogoutVO();
        UserLogout userLogout = authServiceFacade.logout(new UserAuth(SessionContext.getUserId()));
        if (userLogout != null) {
            logoutVO.setNeedRedirect(userLogout.isRedirect());
            logoutVO.setRedirectUri(userLogout.getRedirectUri());
        }
        SessionContext.cleanContext(request);
        SessionContext.removeCookie(response, cookieProperties.getI18nCookieName(), cookieProperties.getDomainName());
        return ResponseData.success(logoutVO);
    }
}
