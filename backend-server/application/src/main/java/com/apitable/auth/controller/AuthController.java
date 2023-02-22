/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.auth.controller;

import com.apitable.auth.dto.UserLoginDTO;
import com.apitable.auth.enums.LoginType;
import com.apitable.auth.ro.LoginRo;
import com.apitable.auth.service.IAuthService;
import com.apitable.auth.vo.LogoutVO;
import com.apitable.core.support.ResponseData;
import com.apitable.interfaces.auth.facade.AuthServiceFacade;
import com.apitable.interfaces.auth.model.AuthParam;
import com.apitable.interfaces.auth.model.UserAuth;
import com.apitable.interfaces.auth.model.UserLogout;
import com.apitable.interfaces.eventbus.facade.EventBusFacade;
import com.apitable.interfaces.eventbus.model.UserLoginEvent;
import com.apitable.interfaces.security.facade.BlackListServiceFacade;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.model.NonRobotMetadata;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.config.properties.CookieProperties;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authorization interface.
 */
@RestController
@Api(tags = "Authorization related interface")
@ApiResource(path = "/")
@Slf4j
public class AuthController {

    private static final String AUTH_DESC =
        "description:verifyType，available values:\npassword\nsms_code\nemail_code";

    @Resource
    private IAuthService iAuthService;

    @Resource
    private BlackListServiceFacade blackListServiceFacade;

    @Resource
    private CookieProperties cookieProperties;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    @Resource
    private EventBusFacade eventBusFacade;

    @Resource
    private AuthServiceFacade authServiceFacade;

    /**
     * login router.
     *
     * @param data    login data
     * @param request request info
     * @return {@link ResponseData}
     */
    @PostResource(name = "Login", path = "/signIn", requiredLogin = false)
    @ApiOperation(value = "login",
        notes = AUTH_DESC, consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> login(@RequestBody @Valid final LoginRo data,
                                    final HttpServletRequest request) {
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(request,
            false, true);
        // Login Type Routing
        Map<LoginType, Function<LoginRo, Long>> loginActionFunc =
            new HashMap<>();
        // password login
        loginActionFunc.put(LoginType.PASSWORD, loginRo -> {
            // Password login requires human-machine authentication
            humanVerificationServiceFacade.verifyNonRobot(
                new NonRobotMetadata(loginRo.getData()));
            // Login processing
            Long userId = iAuthService.loginUsingPassword(loginRo);
            // event point - password login
            eventBusFacade.onEvent(
                new UserLoginEvent(userId, LoginType.PASSWORD, false,
                    origin));
            return userId;
        });
        // SMS verification code login
        loginActionFunc.put(LoginType.SMS_CODE, loginRo -> {
            UserLoginDTO result = iAuthService.loginUsingSmsCode(loginRo);
            // sensors point - Login or Register
            if (Boolean.TRUE.equals(result.getIsSignUp())) {
                eventBusFacade.onEvent(
                    new UserLoginEvent(result.getUserId(), LoginType.SMS_CODE,
                        true, origin));
            } else {
                eventBusFacade.onEvent(
                    new UserLoginEvent(result.getUserId(), LoginType.SMS_CODE,
                        false, origin));
            }
            return result.getUserId();
        });
        // Email verification code login
        loginActionFunc.put(LoginType.EMAIL_CODE, loginRo -> {
            UserLoginDTO result = iAuthService.loginUsingEmailCode(loginRo);
            // sensors point - Login or Register
            if (Boolean.TRUE.equals(result.getIsSignUp())) {
                eventBusFacade.onEvent(
                    new UserLoginEvent(result.getUserId(), LoginType.EMAIL_CODE,
                        true, origin));
            } else {
                eventBusFacade.onEvent(
                    new UserLoginEvent(result.getUserId(), LoginType.EMAIL_CODE,
                        false, origin));
            }
            return result.getUserId();
        });
        // SSO login (private user use)
        loginActionFunc.put(LoginType.SSO_AUTH, loginRo -> {
            UserAuth userAuth = authServiceFacade.ssoLogin(
                new AuthParam(data.getUsername(), data.getCredential()));
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

    /**
     * logout router.
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @return {@link LogoutVO}
     */
    @PostResource(name = "sign out", path = "/signOut", requiredPermission = false, method = {
        RequestMethod.GET,
        RequestMethod.POST})
    @ApiOperation(value = "sign out", notes = "log out of current user")
    public ResponseData<LogoutVO> logout(final HttpServletRequest request,
                                         final HttpServletResponse response) {
        LogoutVO logoutVO = new LogoutVO();
        UserLogout userLogout = authServiceFacade.logout(
            new UserAuth(SessionContext.getUserId()));
        if (userLogout != null) {
            logoutVO.setNeedRedirect(userLogout.isRedirect());
            logoutVO.setRedirectUri(userLogout.getRedirectUri());
        }
        SessionContext.cleanContext(request);
        SessionContext.removeCookie(response,
            cookieProperties.getI18nCookieName(),
            cookieProperties.getDomainName());
        return ResponseData.success(logoutVO);
    }


    /**
     * reset password router.
     *
     * @return {@link ResponseData}
     */
    @PostResource(path = "/resetPassword")
    @ApiOperation(value = "reset password router", hidden = true)
    public ResponseData<Void> resetPassword() {
        Long userId = SessionContext.getUserId();
        boolean result = authServiceFacade.resetPassword(new UserAuth(userId));
        if (result) {
            return ResponseData.success();
        }
        return ResponseData.error();
    }
}
