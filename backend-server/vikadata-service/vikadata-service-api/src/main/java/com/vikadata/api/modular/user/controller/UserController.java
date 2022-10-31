package com.vikadata.api.modular.user.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.util.page.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.cache.service.UserLinkInfoService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.constants.SessionAttrConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.action.ValidateType;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.labs.LabsApplicantTypeEnum;
import com.vikadata.api.util.page.PageHelper;
import com.vikadata.api.util.page.PageInfo;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.ro.labs.UserLabsFeatureRo;
import com.vikadata.api.model.ro.organization.CheckUserEmailRo;
import com.vikadata.api.model.ro.organization.UserLinkEmailRo;
import com.vikadata.api.model.ro.user.CodeValidateRo;
import com.vikadata.api.model.ro.user.DtBindOpRo;
import com.vikadata.api.model.ro.user.EmailCodeValidateRo;
import com.vikadata.api.model.ro.user.InviteCodeRewardRo;
import com.vikadata.api.model.ro.user.RetrievePwdOpRo;
import com.vikadata.api.model.ro.user.SmsCodeValidateRo;
import com.vikadata.api.model.ro.user.UpdatePwdOpRo;
import com.vikadata.api.model.ro.user.UserLinkOpRo;
import com.vikadata.api.model.ro.user.UserOpRo;
import com.vikadata.api.model.vo.integral.IntegralRecordVO;
import com.vikadata.api.model.vo.labs.LabsFeatureVo;
import com.vikadata.api.model.vo.user.UserIntegralVo;
import com.vikadata.api.modular.base.service.ParamVerificationService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.labs.service.ILabsApplicantService;
import com.vikadata.api.modular.user.service.IUserHistoryService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCodeProcessorManage;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.security.sms.ISmsService;
import com.vikadata.api.security.sms.TencentConstants;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.api.util.StringUtil;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.entity.UserEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.PageConstants.PAGE_COMPLEX_EXAMPLE;
import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.enums.exception.LabsFeatureException.SPACE_ID_NOT_EMPTY;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.UserClosingException.USER_APPLIED_FOR_CLOSING;
import static com.vikadata.api.enums.exception.UserClosingException.USER_CANCELED_CLOSING;
import static com.vikadata.api.enums.exception.UserClosingException.USER_NOT_ALLOWED_CANCEL_CLOSING;
import static com.vikadata.api.enums.exception.UserClosingException.USER_NOT_ALLOWED_TO_CLOSE;
import static com.vikadata.api.enums.exception.UserException.EMAIL_HAS_BIND;
import static com.vikadata.api.enums.exception.UserException.EMAIL_NO_EXIST;
import static com.vikadata.api.enums.exception.UserException.MOBILE_HAS_REGISTER;
import static com.vikadata.api.enums.exception.UserException.MOBILE_NO_EXIST;
import static com.vikadata.api.enums.exception.UserException.MODIFY_PASSWORD_ERROR;
import static com.vikadata.api.enums.exception.UserException.PASSWORD_HAS_SETTING;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_BIND_EMAIL;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_BIND_PHONE;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;
import static com.vikadata.api.enums.labs.LabsApplicantTypeEnum.SPACE_LEVEL_FEATURE;
import static com.vikadata.api.enums.labs.LabsFeatureEnum.ofLabsFeature;
import static com.vikadata.define.constants.RedisConstants.ERROR_PWD_NUM_DIR;

/**
 * <p>
 * User interface
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-02
 */
@Slf4j
@RestController
@Api(tags = "Account Center Module_User Management Interface")
@ApiResource(path = "/user")
public class UserController {

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IUserService iUserService;

    @Resource
    private ISmsService iSmsService;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @Resource
    private RedisTemplate<String, Integer> redisTemplate;

    @Resource
    private ParamVerificationService verificationService;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private IIntegralService iIntegralService;

    @Resource
    private ILabsApplicantService iLabsApplicantService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private IUserHistoryService userHistoryService;

    @Resource
    private IVCodeService ivCodeService;

    @GetResource(path = "/integral", requiredPermission = false)
    @ApiOperation(value = "Query account integral information")
    public ResponseData<UserIntegralVo> integrals() {
        Long userId = SessionContext.getUserId();
        int totalIntegral = iIntegralService.getTotalIntegralValueByUserId(userId);
        UserIntegralVo vo = new UserIntegralVo();
        vo.setTotalIntegral(totalIntegral);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/integral/records", requiredPermission = false)
    @ApiOperation(value = "Page by page query of integral revenue and expenditure details")
    @ApiImplicitParam(name = PAGE_PARAM, value = "Page parameter", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_COMPLEX_EXAMPLE)
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<IntegralRecordVO>> integralRecords(@PageObjectParam Page page) {
        Long userId = SessionContext.getUserId();
        IPage<IntegralRecordVO> results = iIntegralService.getIntegralRecordPageByUserId(page, userId);
        return ResponseData.success(PageHelper.build(results));
    }

    @PostResource(name = "Unbind the third-party account", path = "/unbind", requiredPermission = false)
    @ApiOperation(value = "Unbind the third-party account")
    public ResponseData<Void> unbind(@RequestBody @Valid UserLinkOpRo opRo) {
        Long userId = SessionContext.getUserId();
        iUserService.unbind(userId, opRo.getType());
        // Delete Cache
        userLinkInfoService.delete(userId);
        return ResponseData.success();
    }

    @GetResource(name = "Query whether users bind mail", path = "/email/bind", requiredPermission = false)
    @ApiOperation(value = "Query whether users bind mail", notes = "Query whether users bind mail")
    public ResponseData<Boolean> validBindEmail() {
        Long userId = SessionContext.getUserId();
        Boolean exist = iUserService.checkUserHasBindEmail(userId);
        return ResponseData.success(exist);
    }

    @PostResource(name = "Query whether the user is consistent with the specified mail", path = "/validate/email", requiredPermission = false)
    @ApiOperation(value = "Query whether the user is consistent with the specified mail", notes = "Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail")
    public ResponseData<Boolean> validSameEmail(@RequestBody @Valid CheckUserEmailRo data) {
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        ExceptionUtil.isNotNull(user.getEmail(), USER_NOT_BIND_EMAIL);
        return ResponseData.success(user.getEmail().equals(data.getEmail()));
    }

    @PostResource(name = "Associate the invited mail", path = "/link/inviteEmail", requiredPermission = false)
    @ApiOperation(value = "Associate the invited mail", notes = "Users can only associate with invited mail when they have no other mail", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> bindEmail(@RequestBody @Valid UserLinkEmailRo data) {
        String email = data.getEmail();
        String spaceId = data.getSpaceId();
        Long userId = SessionContext.getUserId();
        iUserService.bindMemberByEmail(userId, spaceId, email);
        return ResponseData.success();
    }

    @PostResource(name = "Associated DingTalk", path = "/bindDingTalk", requiredPermission = false)
    @ApiOperation(value = "Associated DingTalk", notes = "Associated DingTalk", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> bindDingTalk(@RequestBody @Valid DtBindOpRo opRo) {
        ValidateTarget target = ValidateTarget.create(opRo.getPhone(), opRo.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).verifyIsPass(target.getRealTarget());
        iUserService.bindDingTalk(opRo);
        return ResponseData.success();
    }

    @PostResource(name = "Bind mail", path = "/bindEmail", requiredPermission = false)
    @ApiOperation(value = "Bind mail", notes = "Bind mail and modify mail", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> verifyEmail(@RequestBody @Valid EmailCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getEmail());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).validate(target, param.getCode(), true, CodeValidateScope.BOUND_EMAIL);
        // Judge whether it exists
        boolean exist = iUserService.checkByEmail(param.getEmail());
        ExceptionUtil.isFalse(exist, EMAIL_HAS_BIND);
        Long userId = SessionContext.getUserId();
        iUserService.updateEmailByUserId(userId, param.getEmail());
        return ResponseData.success();
    }

    @PostResource(name = "Unbind mail", path = "/unbindEmail", requiredPermission = false)
    @ApiOperation(value = "Unbind mail", notes = "Bind mail and modify mail", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> unbindEmail(@RequestBody @Valid CodeValidateRo param) {
        LoginUserDto loginUser = LoginContext.me().getLoginUser();
        // Judge whether users bind mail
        ExceptionUtil.isNotBlank(loginUser.getEmail(), USER_NOT_BIND_EMAIL);
        ValidateTarget target = ValidateTarget.create(loginUser.getEmail());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        iUserService.unbindEmailByUserId(loginUser.getUserId());
        return ResponseData.success();
    }

    @PostResource(name = "Bind a new phone", path = "/bindPhone", requiredPermission = false)
    @ApiOperation(value = "Bind a new phone", notes = "Bind a new phone", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> verifyPhone(@RequestBody @Valid SmsCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getPhone(), param.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).validate(target, param.getCode(), true, CodeValidateScope.BOUND_MOBILE);
        // Judge whether it exists
        boolean exist = iUserService.checkByCodeAndMobile(param.getAreaCode(), param.getPhone());
        ExceptionUtil.isFalse(exist, MOBILE_HAS_REGISTER);
        Long userId = SessionContext.getUserId();
        iUserService.updateMobileByUserId(userId, param.getAreaCode(), param.getPhone());
        return ResponseData.success();
    }

    @PostResource(name = "Unbind mobile phone", path = "/unbindPhone", requiredPermission = false)
    @ApiOperation(value = "Unbind mobile phone", notes = "Unbind mobile phone", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> unbindPhone(@RequestBody @Valid CodeValidateRo param) {
        LoginUserDto loginUser = LoginContext.me().getLoginUser();
        // Judge whether the user binds the mobile phone number
        ExceptionUtil.isNotBlank(loginUser.getMobile(), USER_NOT_BIND_PHONE);
        ValidateTarget target = ValidateTarget.create(loginUser.getMobile(), loginUser.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).validate(target, param.getCode(), true, CodeValidateScope.UN_BOUND_MOBILE);
        iUserService.unbindMobileByUserId(loginUser.getUserId());
        return ResponseData.success();
    }

    @PostResource(name = "Edit user information", path = "/update", requiredPermission = false)
    @ApiOperation(value = "Edit user information", notes = "Request parameters cannot be all empty", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<String> update(@RequestBody @Valid UserOpRo param) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(param.getAvatar()) || StrUtil.isNotBlank(param.getNickName())
                || StrUtil.isNotBlank(param.getLocale()), ParameterException.NO_ARG);
        Long userId = SessionContext.getUserId();
        iUserService.edit(userId, param);
        if (StrUtil.isNotBlank(param.getAvatar())) {
            return ResponseData.success(StringUtil.trimSlash(constProperties.getOssBucketByAsset().getResourceUrl()) + param.getAvatar());
        }
        if (BooleanUtil.isTrue(param.getInit()) && StrUtil.isNotBlank(param.getNickName())) {
            // Shence buried point - initialize nickname
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.SET_NICKNAME, null, origin));
        }
        return ResponseData.success(null);
    }

    @PostResource(name = "Change Password", path = "/updatePwd", requiredPermission = false)
    @ApiOperation(value = "Change Password", notes = "Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> updatePwd(@RequestBody UpdatePwdOpRo param) {
        verificationService.verifyPassword(param.getPassword());
        Long userId = SessionContext.getUserId();
        if (StrUtil.isNotBlank(param.getCode())) {
            // Scene 1: Verification of verification code
            LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
            if (param.getType() == ValidateType.EMAIL_CODE) {
                ValidateTarget target = ValidateTarget.create(loginUserDto.getEmail());
                ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                        .validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
            }
            else if (param.getType() == ValidateType.SMS_CODE) {
                ValidateTarget target = ValidateTarget.create(loginUserDto.getMobile(), loginUserDto.getAreaCode());
                ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                        .validate(target, param.getCode(), true, CodeValidateScope.UPDATE_PWD);
            }
            else {
                // The account is not bound to the mobile phone and email at the same time, so the verification code verification can be skipped
                ExceptionUtil.isTrue(StrUtil.isBlank(loginUserDto.getEmail())
                        && StrUtil.isBlank(loginUserDto.getMobile()), MODIFY_PASSWORD_ERROR);
            }
            // Change Password
            iUserService.updatePwd(userId, param.getPassword());
            // Send SMS notification asynchronously
            if (StrUtil.isNotBlank(loginUserDto.getMobile())) {
                ValidateTarget target = ValidateTarget.create(loginUserDto.getMobile(), loginUserDto.getAreaCode());
                TaskManager.me().execute(() -> iSmsService.sendMessage(target, TencentConstants.SmsTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE));
            }
            // Close the login session of other end of the account
            iUserService.closeMultiSession(userId, true);
        }
        else {
            // Judge whether the user account is set with a password. The account with a password cannot be initialized
            boolean needPwd = LoginContext.me().getLoginUser().getNeedPwd();
            ExceptionUtil.isTrue(needPwd, PASSWORD_HAS_SETTING);
            iUserService.updatePwd(userId, param.getPassword());
        }
        return ResponseData.success();
    }

    @PostResource(name = "Retrieve password", path = "/retrievePwd", requiredLogin = false)
    @ApiOperation(value = "Retrieve password", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> retrievePwd(@RequestBody @Valid RetrievePwdOpRo param) {
        // Verify password format
        verificationService.verifyPassword(param.getPassword());
        UserEntity user;
        if (param.getType() == ValidateType.EMAIL_CODE) {
            // Check the email verification code
            ValidateTarget target = ValidateTarget.create(param.getUsername());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
            // Determine whether the account exists
            user = iUserService.getByEmail(param.getUsername());
            ExceptionUtil.isNotNull(user, EMAIL_NO_EXIST);
        }
        else {
            // Check SMS verification code
            ValidateTarget target = ValidateTarget.create(param.getUsername(), param.getAreaCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                    .validate(target, param.getCode(), true, CodeValidateScope.UPDATE_PWD);
            // Determine whether the account exists
            user = iUserService.getByCodeAndMobilePhone(param.getAreaCode(), param.getUsername());
            ExceptionUtil.isNotNull(user, MOBILE_NO_EXIST);
        }
        Long id = user.getId();
        // Change Password
        iUserService.updatePwd(id, param.getPassword());
        // Send SMS notification asynchronously
        if (user.getMobilePhone() != null) {
            TaskManager.me().execute(() -> iSmsService.sendMessage(ValidateTarget.create(user.getMobilePhone(), user.getCode()),
                    TencentConstants.SmsTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE));
        }
        // Close the login session of other end of the account
        iUserService.closeMultiSession(id, false);
        // Unlock the account caused by frequent password errors
        redisTemplate.delete(ERROR_PWD_NUM_DIR + id);
        return ResponseData.success();
    }

    @GetResource(name = "Query whether have logged in", path = "/session", requiredLogin = false)
    @ApiOperation(value = "Query whether have logged in", notes = "Get necessary information", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Boolean> meSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return ResponseData.success(session != null && session.getAttribute(SessionAttrConstants.LOGIN_USER_ID) != null);
    }

    @PostResource(name = "Apply for cancellation of user account", path = "/applyForClosing", requiredPermission = false)
    @ApiOperation(value = "Apply for cancellation of user account", notes = "Registered login user applies for account cancellation", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> applyForClosing() {
        // Get the current login user
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        // Judge whether the user has applied for account cancellation
        ExceptionUtil.isFalse(user.getIsPaused(), USER_APPLIED_FOR_CLOSING);
        // Judge whether the current user meets the logout conditions
        boolean allowedToBeClosed = userHistoryService.checkAccountAllowedToBeClosed(userId);
        ExceptionUtil.isTrue(allowedToBeClosed, USER_NOT_ALLOWED_TO_CLOSE);
        // Cancel the account and enter the calm period
        iUserService.applyForClosingAccount(user);
        // Destroy user cookies and maintain sessions
        iUserService.closeMultiSession(userId, true);
        return ResponseData.success();
    }

    @GetResource(name = "Verify whether the account can be cancelled", path = "/checkForClosing", requiredPermission = false)
    @ApiOperation(value = "Verify whether the account can be cancelled", notes = "Unregistered users verify whether the account meets the cancellation conditions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> checkForClosing() {
        // Get the current login user
        Long userId = SessionContext.getUserId();
        // Judge whether the current user meets the account cancellation conditions
        boolean isAllowedToBeClosed = userHistoryService.checkAccountAllowedToBeClosed(userId);
        ExceptionUtil.isTrue(isAllowedToBeClosed, USER_NOT_ALLOWED_TO_CLOSE);
        return ResponseData.success();
    }

    @PostResource(name = "Apply for account restoration", path = "/cancelClosing", requiredPermission = false)
    @ApiOperation(value = "Apply for account restoration", notes = "User recovery account has been applied for cancellation", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> cancelClosing() {
        // Get the current login user
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        // The account cancellation application has not been submitted and cannot be withdrawn
        ExceptionUtil.isTrue(user.getIsPaused(), USER_NOT_ALLOWED_CANCEL_CLOSING);
        // The account has passed the calm period and cannot be recovered
        ExceptionUtil.isFalse(user.getIsDeleted(), USER_CANCELED_CLOSING);
        // Cancel account cancellation
        iUserService.cancelClosingAccount(user);
        return ResponseData.success();
    }

    @GetResource(name = "Get the enabled experimental functions", path = "/labs/features", requiredPermission = false)
    @ApiOperation(value = "Get the enabled experimental functions", notes = "Get the enabled experimental functions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<LabsFeatureVo> getEnabledLabFeatures(@RequestParam String spaceId) {
        Long userId = SessionContext.getUserId();
        List<String> applicants = new ArrayList<>();
        if (StrUtil.isNotBlank(spaceId)) {
            applicants.add(spaceId);
        }
        applicants.add(Long.toString(userId));
        return ResponseData.success(iLabsApplicantService.getUserCurrentFeatureApplicants(applicants));
    }

    @PostResource(path = "/labs/features", requiredPermission = false)
    @ApiOperation(value = "Update the usage status of laboratory functions", notes = "Update the usage status of laboratory functions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> updateLabsFeatureStatus(@RequestBody @Valid UserLabsFeatureRo userLabsFeatureRo) {
        // Get the user ID of the current user
        Long userId = SessionContext.getUserId();
        // Get the space ID of the space station level function to be operated
        String spaceId = userLabsFeatureRo.getSpaceId();
        // Get the feature key of the function to be operated
        String featureKey = userLabsFeatureRo.getKey();
        // The space level function must be operated with the space ID, otherwise it is not allowed to operate
        LabsApplicantTypeEnum applicantType = ofLabsFeature(featureKey).getApplicantType();
        ExceptionUtil.isFalse(SPACE_LEVEL_FEATURE.equals(applicantType) && StrUtil.isBlank(spaceId), SPACE_ID_NOT_EMPTY);
        // When the operating user does not belong to the space, operation is not allowed
        UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
        ExceptionUtil.isNotNull(userSpace, NOT_IN_SPACE);
        String applicant = StrUtil.isNotBlank(spaceId) ? spaceId : Long.toString(userId);
        if (userLabsFeatureRo.getIsEnabled()) {
            // Enable experimental features
            iLabsApplicantService.enableLabsFeature(applicant, applicantType, featureKey, userId);
        }
        else {
            // Disable experimental functions
            iLabsApplicantService.disableLabsFeature(applicant, featureKey);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/invite/reward", requiredPermission = false)
    @ApiOperation(value = "Fill in invitation code reward", notes = "Users fill in the invitation code and get rewards", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> inviteCodeReward(@RequestBody @Validated InviteCodeRewardRo body) {
        // Verify the validity of the invitation code
        ivCodeService.checkInviteCode(body.getInviteCode());
        // Fill in the invitation code and reward integral
        Long userId = SessionContext.getUserId();
        iUserService.useInviteCodeReward(userId, body.getInviteCode());
        return ResponseData.success();
    }

    @PostResource(path = "/delActiveSpaceCache", method = { RequestMethod.GET }, requiredPermission = false)
    @ApiOperation(value = "Delete Active Space Cache")
    public ResponseData<Void> delActiveSpaceCache() {
        // Fill in the invitation code and reward integral
        Long userId = SessionContext.getUserId();
        userActiveSpaceService.delete(userId);
        return ResponseData.success();
    }
}
