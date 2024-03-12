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

package com.apitable.user.controller;

import static com.apitable.core.constants.RedisConstants.ERROR_PWD_NUM_DIR;
import static com.apitable.space.enums.LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE;
import static com.apitable.space.enums.LabsFeatureEnum.ofLabsFeature;
import static com.apitable.space.enums.LabsFeatureException.SPACE_ID_NOT_EMPTY;
import static com.apitable.space.enums.SpaceException.NOT_IN_SPACE;
import static com.apitable.user.enums.UserClosingException.USER_APPLIED_FOR_CLOSING;
import static com.apitable.user.enums.UserClosingException.USER_CANCELED_CLOSING;
import static com.apitable.user.enums.UserClosingException.USER_NOT_ALLOWED_CANCEL_CLOSING;
import static com.apitable.user.enums.UserClosingException.USER_NOT_ALLOWED_TO_CLOSE;
import static com.apitable.user.enums.UserException.EMAIL_HAS_BIND;
import static com.apitable.user.enums.UserException.EMAIL_NO_EXIST;
import static com.apitable.user.enums.UserException.MOBILE_HAS_REGISTER;
import static com.apitable.user.enums.UserException.MOBILE_NO_EXIST;
import static com.apitable.user.enums.UserException.MODIFY_PASSWORD_ERROR;
import static com.apitable.user.enums.UserException.PASSWORD_HAS_SETTING;
import static com.apitable.user.enums.UserException.USER_NOT_BIND_EMAIL;
import static com.apitable.user.enums.UserException.USER_NOT_BIND_PHONE;
import static com.apitable.user.enums.UserException.USER_NOT_EXIST;
import static com.apitable.workspace.enums.PermissionException.ONLY_MAIN_ADMIN_OPERATE;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.base.enums.ValidateType;
import com.apitable.base.service.ParamVerificationService;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.interfaces.auth.model.UserAuth;
import com.apitable.interfaces.eventbus.facade.EventBusFacade;
import com.apitable.interfaces.eventbus.model.UserInfoChangeEvent;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.organization.ro.CheckUserEmailRo;
import com.apitable.organization.ro.UserLinkEmailRo;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.LoginUserCacheService;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.captcha.CodeValidateScope;
import com.apitable.shared.captcha.ValidateCodeProcessorManage;
import com.apitable.shared.captcha.ValidateCodeType;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.captcha.sms.ISmsService;
import com.apitable.shared.captcha.sms.TencentConstants;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.util.StringUtil;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.LabsApplicantTypeEnum;
import com.apitable.space.service.ILabsApplicantService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.LabsFeatureVo;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.ro.CodeValidateRo;
import com.apitable.user.ro.EmailCodeValidateRo;
import com.apitable.user.ro.EmailVerificationRo;
import com.apitable.user.ro.RetrievePwdOpRo;
import com.apitable.user.ro.SmsCodeValidateRo;
import com.apitable.user.ro.UpdatePwdOpRo;
import com.apitable.user.ro.UserLabsFeatureRo;
import com.apitable.user.ro.UserOpRo;
import com.apitable.user.service.IUserHistoryService;
import com.apitable.user.service.IUserService;
import com.apitable.user.vo.UserInfoVo;
import com.apitable.workspace.service.INodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * user interface.
 */
@Slf4j
@RestController
@Tag(name = "User")
@ApiResource(path = "/user")
public class UserController {

    /**
     * ConstProperties.
     */
    @Resource
    private ConstProperties constProperties;

    /**
     * IUserService.
     */
    @Resource
    private IUserService iUserService;

    /**
     * ISmsService.
     */
    @Resource
    private ISmsService iSmsService;

    /**
     * RedisTemplate.
     */
    @Resource
    private RedisTemplate<String, Integer> redisTemplate;

    /**
     * ParamVerificationService.
     */
    @Resource
    private ParamVerificationService verificationService;

    /**
     * ILabsApplicantService.
     */
    @Resource
    private ILabsApplicantService iLabsApplicantService;

    /**
     * UserSpaceCacheService.
     */
    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    /**
     * UserActiveSpaceCacheService.
     */
    @Resource
    private UserActiveSpaceCacheService userActiveSpaceCacheService;

    /**
     * IUserHistoryService.
     */
    @Resource
    private IUserHistoryService userHistoryService;

    /**
     * INodeService.
     */
    @Resource
    private INodeService iNodeService;

    /**
     * SocialServiceFacade.
     */
    @Resource
    private SocialServiceFacade socialServiceFacade;

    /**
     * EventBusFacade.
     */
    @Resource
    private EventBusFacade eventBusFacade;

    /**
     * IMemberService.
     */
    @Resource
    private IMemberService iMemberService;

    @Resource
    private UserServiceFacade userServiceFacade;

    @Resource
    private LoginUserCacheService loginUserCacheService;

    @Resource
    private ISpaceService iSpaceService;

    /**
     * Get personal information.
     *
     * @param spaceId space id
     * @param nodeId  node id
     * @param filter  filter
     * @param request HttpServletRequest
     * @return Get personal information
     */
    @GetResource(path = "/me", requiredPermission = false)
    @Operation(summary = "get personal information")
    @Parameters({
        @Parameter(name = "spaceId", in = ParameterIn.QUERY, description = "space id",
            schema = @Schema(type = "string"), example = "spc8mXUeiXyVo"),
        @Parameter(name = "nodeId", in = ParameterIn.QUERY, description = "node id",
            schema = @Schema(type = "string"), example = "dstS94qPZFXjC1LKns"),
        @Parameter(name = "filter", in = ParameterIn.QUERY,
            description = "whether to filter space related information",
            schema = @Schema(type = "boolean"), example = "true")
    })
    public ResponseData<UserInfoVo> userInfo(
        @RequestParam(name = "spaceId", required = false) final String spaceId,
        @RequestParam(name = "nodeId", required = false) final String nodeId,
        @RequestParam(name = "filter", required = false,
            defaultValue = "false") final Boolean filter,
        final HttpServletRequest request) {
        Long userId = SessionContext.getUserId();

        // try to return SpaceId
        String trySpaceId = tryReturnSpaceId(nodeId, spaceId, userId, request);

        // Get user information
        UserInfoVo userInfo = iUserService.getCurrentUserInfo(userId,
            trySpaceId,
            filter);

        // Returns the domain name bound to the space station
        String spaceDomain = returnSpaceDomain(trySpaceId,
            userInfo.getSpaceId());
        userInfo.setSpaceDomain(spaceDomain);
        return ResponseData.success(userInfo);
    }

    /**
     * Get space id.
     *
     * @param nodeId  node id
     * @param spaceId space id
     * @param userId  user id
     * @param request HttpServletRequest
     * @return space id
     */
    // Before getting the user information, try to return the Space id first
    private String tryReturnSpaceId(final String nodeId, final String spaceId,
                                    final Long userId, final HttpServletRequest request) {
        if (StrUtil.isNotBlank(nodeId)) {
            // 1.Use url - NodeId to locate the space and return the bound
            // domain name
            return iNodeService.getSpaceIdByNodeIdIncludeDeleted(nodeId);
        }
        if (StrUtil.isBlank(spaceId)) {
            // 2.The user does not actively locate the space station behavior
            // - use the current access domain name to locate the space station
            String remoteHost = HttpContextUtil.getRemoteHost(request);
            String domainBindSpaceId =
                socialServiceFacade.getSpaceIdByDomainName(
                    remoteHost);
            if (StrUtil.isNotBlank(domainBindSpaceId)) {
                // Exception: The registrant uses an exclusive domain name,
                // and then logs in with an account and password;
                // Return to the exclusive domain name space station The
                // current registrant does not have permission to operate the
                // space;
                // At that time, return the last active space ID of the user
                Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(
                    userId, domainBindSpaceId);
                if (ObjectUtil.isNull(memberId)) {
                    // No operation permission, get the last active node of
                    // active users
                    return userActiveSpaceCacheService.getLastActiveSpace(
                        userId);
                } else {
                    return domainBindSpaceId;
                }
            }
        }
        return spaceId;
    }

    /**
     * Get space station domain.
     *
     * @param spaceId     space id
     * @param userSpaceId user space id
     * @return space station domain
     */
    // Return the space station domain name
    private String returnSpaceDomain(final String spaceId,
                                     final String userSpaceId) {
        // Returns the domain name information, and returns the public domain
        // name if there is no credential acquisition or search
        if (StrUtil.isNotBlank(spaceId)) {
            // 3.If the precondition space id is not empty, return the bound
            // domain name directly
            return socialServiceFacade.getDomainNameBySpaceId(spaceId, false);
        } else {
            // 4.If there is none, operate according to the last active space
            if (StrUtil.isBlank(userSpaceId)) {
                return constProperties.defaultServerDomain();
            } else {
                return socialServiceFacade.getDomainNameBySpaceId(userSpaceId,
                    false);
            }
        }
    }

    /**
     * Query whether users bind mail.
     *
     * @return {@link ResponseData}
     */
    @GetResource(path = "/email/bind", requiredPermission = false)
    @Operation(summary = "Query whether users bind mail",
        description = "Query whether users bind mail")
    public ResponseData<Boolean> validBindEmail() {
        Long userId = SessionContext.getUserId();
        Boolean exist = iUserService.checkUserHasBindEmail(userId);
        return ResponseData.success(exist);
    }

    /**
     * Query whether the user is consistent with the specified mail.
     *
     * @param data CheckUserEmailRo
     * @return {@link ResponseData}
     */
    @Deprecated(since = "v1.10.0")
    @PostResource(path = "/validate/email", requiredPermission = false)
    @Operation(summary = "Query whether the user is consistent with the "
        + "specified mail", description = "Query whether the user is consistent "
        + "with the specified mail. It can only be determined if the user has"
        + " bound the mail")
    public ResponseData<Boolean> validSameEmail(
        @RequestBody @Valid final CheckUserEmailRo data) {
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        ExceptionUtil.isNotNull(user.getEmail(), USER_NOT_BIND_EMAIL);
        return ResponseData.success(user.getEmail().equals(data.getEmail()));
    }

    /**
     * Associate the invited mail.
     *
     * @param data UserLinkEmailRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/link/inviteEmail", requiredPermission = false)
    @Operation(summary = "Associate the invited mail",
        description = "Users can only associate with invited mail when they have no other mail")
    public ResponseData<Void> linkInviteEmail(
        @RequestBody @Valid final UserLinkEmailRo data) {
        String email = data.getEmail();
        String spaceId = data.getSpaceId();
        Long userId = SessionContext.getUserId();
        iUserService.bindMemberByEmail(userId, spaceId, email);
        return ResponseData.success();
    }

    /**
     * Bind mail.
     *
     * @param param EmailCodeValidateRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/bindEmail", requiredPermission = false)
    @Operation(summary = "Bind mail", description = "Bind mail and modify mail")
    public ResponseData<Void> bindEmail(
        @RequestBody @Valid final EmailCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getEmail());
        ValidateCodeProcessorManage.me()
            .findValidateCodeProcessor(ValidateCodeType.EMAIL)
            .validate(target, param.getCode(), true,
                CodeValidateScope.BOUND_EMAIL);
        // Judge whether it exists
        boolean exist = iUserService.checkByEmail(param.getEmail());
        ExceptionUtil.isFalse(exist, EMAIL_HAS_BIND);
        Long userId = SessionContext.getUserId();
        String oldEmail = LoginContext.me().getLoginUser().getEmail();
        iUserService.updateEmailByUserId(userId, param.getEmail(), oldEmail);
        return ResponseData.success();
    }

    /**
     * Unbind mail.
     *
     * @param param CodeValidateRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/unbindEmail", requiredPermission = false)
    @Operation(summary = "Unbind mail", description = "Bind mail and modify mail")
    public ResponseData<Void> unbindEmail(
        @RequestBody @Valid final CodeValidateRo param) {
        LoginUserDto loginUser = LoginContext.me().getLoginUser();
        // Judge whether users bind mail
        ExceptionUtil.isNotBlank(loginUser.getEmail(), USER_NOT_BIND_EMAIL);
        ValidateTarget target = ValidateTarget.create(loginUser.getEmail());
        ValidateCodeProcessorManage.me()
            .findValidateCodeProcessor(ValidateCodeType.EMAIL)
            .validate(target, param.getCode(), true,
                CodeValidateScope.COMMON_VERIFICATION);
        iUserService.unbindEmailByUserId(loginUser.getUserId());
        return ResponseData.success();
    }

    /**
     * Bind a new phone.
     *
     * @param param SmsCodeValidateRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/bindPhone", requiredPermission = false)
    @Operation(summary = "Bind a new phone", description = "Bind a new phone")
    public ResponseData<Void> verifyPhone(
        @RequestBody @Valid final SmsCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getPhone(),
            param.getAreaCode());
        ValidateCodeProcessorManage.me()
            .findValidateCodeProcessor(ValidateCodeType.SMS)
            .validate(target, param.getCode(), true,
                CodeValidateScope.BOUND_MOBILE);
        // Judge whether it exists
        boolean exist = iUserService.checkByCodeAndMobile(param.getAreaCode(),
            param.getPhone());
        ExceptionUtil.isFalse(exist, MOBILE_HAS_REGISTER);
        Long userId = SessionContext.getUserId();
        iUserService.updateMobileByUserId(userId, param.getAreaCode(),
            param.getPhone());
        return ResponseData.success();
    }

    /**
     * Unbind mobile phone.
     *
     * @param param CodeValidateRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/unbindPhone", requiredPermission = false)
    @Operation(summary = "Unbind mobile phone")
    public ResponseData<Void> unbindPhone(
        @RequestBody @Valid final CodeValidateRo param) {
        LoginUserDto loginUser = LoginContext.me().getLoginUser();
        // Judge whether the user binds the mobile phone number
        ExceptionUtil.isNotBlank(loginUser.getMobile(), USER_NOT_BIND_PHONE);
        ValidateTarget target = ValidateTarget.create(loginUser.getMobile(),
            loginUser.getAreaCode());
        ValidateCodeProcessorManage.me()
            .findValidateCodeProcessor(ValidateCodeType.SMS)
            .validate(target, param.getCode(), true,
                CodeValidateScope.UN_BOUND_MOBILE);
        iUserService.unbindMobileByUserId(loginUser.getUserId());
        return ResponseData.success();
    }

    /**
     * Edit user information.
     *
     * @param param UserOpRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/update", requiredPermission = false)
    @Operation(summary = "Edit user information",
        description = "Request parameters cannot be all empty")
    public ResponseData<String> update(
        @RequestBody @Valid final UserOpRo param) {
        ExceptionUtil.isTrue(
            StrUtil.isNotBlank(param.getAvatar()) || StrUtil.isNotBlank(
                param.getNickName()) || ObjectUtil.isNotNull(
                param.getAvatarColor())
                || StrUtil.isNotBlank(param.getLocale()) || StrUtil.isNotBlank(
                param.getTimeZone()), ParameterException.NO_ARG);
        Long userId = SessionContext.getUserId();
        iUserService.edit(userId, param);
        if (StrUtil.isNotBlank(param.getAvatar())
            && param.getAvatarColor() == null) {
            return ResponseData.success(StringUtil.trimSlash(
                constProperties.getOssBucketByAsset().getResourceUrl())
                + param.getAvatar());
        }
        if (BooleanUtil.isTrue(param.getInit()) && StrUtil.isNotBlank(
            param.getNickName())) {
            // buried point - initialize nickname
            ClientOriginInfo origin =
                InformationUtil.getClientOriginInfoInCurrentHttpContext(
                    false, true);
            eventBusFacade.onEvent(new UserInfoChangeEvent(userId, origin));
        }
        return ResponseData.success(null);
    }

    /**
     * Change Password.
     *
     * @param param UpdatePwdOpRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/updatePwd", requiredPermission = false)
    @Operation(summary = "Change Password",
        description = "Scene: 1. Personal setting and password modification;"
            + " 2. Initialize after login for accounts without password")
    public ResponseData<Void> updatePwd(
        @RequestBody final UpdatePwdOpRo param) {
        verificationService.verifyPassword(param.getPassword());
        Long userId = SessionContext.getUserId();
        if (StrUtil.isNotBlank(param.getCode())) {
            // Scene 1: Verification of verification code
            LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
            if (param.getType() == ValidateType.EMAIL_CODE) {
                ValidateTarget target = ValidateTarget.create(
                    loginUserDto.getEmail());
                ValidateCodeProcessorManage.me()
                    .findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .validate(target, param.getCode(), true,
                        CodeValidateScope.COMMON_VERIFICATION);
            } else if (param.getType() == ValidateType.SMS_CODE) {
                ValidateTarget target = ValidateTarget.create(
                    loginUserDto.getMobile(), loginUserDto.getAreaCode());
                ValidateCodeProcessorManage.me()
                    .findValidateCodeProcessor(ValidateCodeType.SMS)
                    .validate(target, param.getCode(), true,
                        CodeValidateScope.UPDATE_PWD);
            } else {
                // The account is not bound to the mobile phone and email at
                // the same time, so the verification code verification can
                // be skipped
                ExceptionUtil.isTrue(StrUtil.isBlank(loginUserDto.getEmail())
                        && StrUtil.isBlank(loginUserDto.getMobile()),
                    MODIFY_PASSWORD_ERROR);
            }
            // Change Password
            iUserService.updatePwd(userId, param.getPassword());
            // Send SMS notification asynchronously
            if (StrUtil.isNotBlank(loginUserDto.getMobile())) {
                ValidateTarget target = ValidateTarget.create(
                    loginUserDto.getMobile(), loginUserDto.getAreaCode());
                TaskManager.me().execute(() -> iSmsService.sendMessage(target,
                    TencentConstants.SmsTemplate
                        .UPDATE_PASSWORD_SUCCESS_NOTICE));
            }
            // Close the login session of other end of the account
            iUserService.closeMultiSession(userId, true);
        } else {
            // Judge whether the user account is set with a password. The
            // account with a password cannot be initialized
            boolean needPwd = LoginContext.me().getLoginUser().getNeedPwd();
            ExceptionUtil.isTrue(needPwd, PASSWORD_HAS_SETTING);
            iUserService.updatePwd(userId, param.getPassword());
        }
        return ResponseData.success();
    }

    /**
     * Retrieve password.
     *
     * @param param RetrievePwdOpRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/retrievePwd", requiredLogin = false)
    @Operation(summary = "Retrieve password")
    public ResponseData<Void> retrievePwd(
        @RequestBody @Valid final RetrievePwdOpRo param) {
        // Verify password format
        verificationService.verifyPassword(param.getPassword());
        UserEntity user;
        if (param.getType() == ValidateType.EMAIL_CODE) {
            // Check the email verification code
            ValidateTarget target = ValidateTarget.create(param.getUsername());
            ValidateCodeProcessorManage.me()
                .findValidateCodeProcessor(ValidateCodeType.EMAIL)
                .validate(target, param.getCode(), true,
                    CodeValidateScope.COMMON_VERIFICATION);
            // Determine whether the account exists
            user = iUserService.getByEmail(param.getUsername());
            ExceptionUtil.isNotNull(user, EMAIL_NO_EXIST);
        } else {
            // Check SMS verification code
            ValidateTarget target = ValidateTarget.create(param.getUsername(),
                param.getAreaCode());
            ValidateCodeProcessorManage.me()
                .findValidateCodeProcessor(ValidateCodeType.SMS)
                .validate(target, param.getCode(), true,
                    CodeValidateScope.UPDATE_PWD);
            // Determine whether the account exists
            user = iUserService.getByCodeAndMobilePhone(param.getAreaCode(),
                param.getUsername());
            ExceptionUtil.isNotNull(user, MOBILE_NO_EXIST);
        }
        Long id = user.getId();
        // Change Password
        iUserService.updatePwd(id, param.getPassword());
        // Send SMS notification asynchronously
        if (user.getMobilePhone() != null) {
            TaskManager.me().execute(() -> iSmsService.sendMessage(
                ValidateTarget.create(user.getMobilePhone(), user.getCode()),
                TencentConstants.SmsTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE));
        }
        // Close the login session of other end of the account
        iUserService.closeMultiSession(id, false);
        // Unlock the account caused by frequent password errors
        redisTemplate.delete(ERROR_PWD_NUM_DIR + id);
        return ResponseData.success();
    }

    /**
     * Apply for cancellation of user account.
     *
     * @return {@link ResponseData}
     */
    @PostResource(path = "/applyForClosing", requiredPermission = false)
    @Operation(summary = "Apply for cancellation of user account",
        description = "Registered login user applies for account cancellation")
    public ResponseData<Void> applyForClosing() {
        // Get the current login user
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        // Judge whether the user has applied for account cancellation
        ExceptionUtil.isFalse(user.getIsPaused(), USER_APPLIED_FOR_CLOSING);
        // Judge whether the current user meets the logout conditions
        boolean allowedToBeClosed =
            userHistoryService.checkAccountAllowedToBeClosed(
                userId);
        ExceptionUtil.isTrue(allowedToBeClosed, USER_NOT_ALLOWED_TO_CLOSE);
        // Cancel the account and enter the calm period
        iUserService.applyForClosingAccount(user);
        // Destroy user cookies and maintain sessions
        iUserService.closeMultiSession(userId, true);
        // delete user cache
        loginUserCacheService.delete(userId);
        return ResponseData.success();
    }

    /**
     * Verify whether the account can be cancelled.
     *
     * @return {@link ResponseData}
     */
    @GetResource(path = "/checkForClosing", requiredPermission = false)
    @Operation(summary = "Verify whether the account can be cancelled",
        description = "Unregistered users verify whether the account meets the "
            + "cancellation conditions")
    public ResponseData<Void> checkForClosing() {
        // Get the current login user
        Long userId = SessionContext.getUserId();
        // Judge whether the current user meets the account cancellation
        // conditions
        boolean isAllowedToBeClosed =
            userHistoryService.checkAccountAllowedToBeClosed(
                userId);
        ExceptionUtil.isTrue(isAllowedToBeClosed, USER_NOT_ALLOWED_TO_CLOSE);
        return ResponseData.success();
    }

    /**
     * Apply for account restoration.
     *
     * @return {@link ResponseData}
     */
    @PostResource(path = "/cancelClosing", requiredPermission = false)
    @Operation(summary = "Apply for account restoration",
        description = "User recovery account has been applied for cancellation")
    public ResponseData<Void> cancelClosing() {
        // Get the current login user
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        // The account cancellation application has not been submitted and
        // cannot be withdrawn
        ExceptionUtil.isTrue(user.getIsPaused(),
            USER_NOT_ALLOWED_CANCEL_CLOSING);
        // The account has passed the calm period and cannot be recovered
        ExceptionUtil.isFalse(user.getIsDeleted(), USER_CANCELED_CLOSING);
        // Cancel account cancellation
        iUserService.cancelClosingAccount(user);
        return ResponseData.success();
    }

    /**
     * Get the enabled experimental functions.
     *
     * @param spaceId space id
     * @return {@link ResponseData}
     */
    @GetResource(path = "/labs/features", requiredPermission = false)
    @Operation(summary = "Get the enabled experimental functions")
    public ResponseData<LabsFeatureVo> getEnabledLabFeatures(
        @RequestParam final String spaceId) {
        Long userId = SessionContext.getUserId();
        List<String> applicants = new ArrayList<>();
        if (StrUtil.isNotBlank(spaceId)) {
            applicants.add(spaceId);
        }
        applicants.add(Long.toString(userId));
        return ResponseData.success(
            iLabsApplicantService.getUserCurrentFeatureApplicants(applicants));
    }

    /**
     * Update the usage status of laboratory functions.
     *
     * @param userLabsFeatureRo UserLabsFeatureRo
     * @return {@link ResponseData}
     */
    @PostResource(path = "/labs/features", requiredPermission = false)
    @Operation(summary = "Update the usage status of laboratory functions",
        description = "Update the usage status of laboratory functions")
    public ResponseData<Void> updateLabsFeatureStatus(
        @RequestBody @Valid final UserLabsFeatureRo userLabsFeatureRo) {
        // Get the user ID of the current user
        Long userId = SessionContext.getUserId();
        // Get the space ID of the space station level function to be operated
        String spaceId = userLabsFeatureRo.getSpaceId();
        // Get the feature key of the function to be operated
        String featureKey = userLabsFeatureRo.getKey();
        // The space level function must be operated with the space ID,
        // otherwise it is not allowed to operate
        LabsApplicantTypeEnum applicantType = ofLabsFeature(
            featureKey).getApplicantType();
        ExceptionUtil.isFalse(
            SPACE_LEVEL_FEATURE.equals(applicantType) && StrUtil.isBlank(
                spaceId), SPACE_ID_NOT_EMPTY);
        // When the operating user does not belong to the space, operation is
        // not allowed
        UserSpaceDto userSpace = userSpaceCacheService.getUserSpace(userId,
            spaceId);
        ExceptionUtil.isNotNull(userSpace, NOT_IN_SPACE);
        // Whether member is main admin
        iSpaceService.checkMemberIsMainAdmin(spaceId, userSpace.getMemberId(),
            isMainAdmin -> ExceptionUtil.isTrue(isMainAdmin, ONLY_MAIN_ADMIN_OPERATE));
        String applicant =
            StrUtil.isNotBlank(spaceId) ? spaceId : Long.toString(userId);
        if (userLabsFeatureRo.getIsEnabled()) {
            // Enable experimental features
            iLabsApplicantService.enableLabsFeature(applicant, applicantType,
                featureKey, userId);
        } else {
            // Disable experimental functions
            iLabsApplicantService.disableLabsFeature(applicant, featureKey);
        }
        return ResponseData.success();
    }

    /**
     * Delete active space cache.
     *
     * @return {@link ResponseData}
     */
    @PostResource(path = "/delActiveSpaceCache",
        method = {RequestMethod.GET}, requiredPermission = false)
    @Operation(summary = "Delete Active Space Cache")
    public ResponseData<Void> delActiveSpaceCache() {
        // Fill in the invitation code and reward integral
        Long userId = SessionContext.getUserId();
        userActiveSpaceCacheService.delete(userId);
        return ResponseData.success();
    }

    /**
     * reset password router.
     *
     * @return {@link ResponseData}
     */
    @PostResource(path = "/resetPassword")
    @Operation(summary = "reset password router")
    public ResponseData<Void> resetPassword() {
        Long userId = SessionContext.getUserId();
        boolean result = userServiceFacade.resetPassword(new UserAuth(userId));
        if (result) {
            return ResponseData.success();
        }
        return ResponseData.error();
    }

    /**
     * reset password router.
     *
     * @return {@link ResponseData}
     */
    @PostResource(path = "/verifyEmail", requiredLogin = false)
    @Operation(summary = "verify user's email", hidden = true)
    public ResponseData<Void> verifyEmail(@RequestBody @Valid EmailVerificationRo ro) {
        boolean result = userServiceFacade.verifyEmail(ro.getEmail());
        if (result) {
            return ResponseData.success();
        }
        return ResponseData.error();
    }
}
