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
import com.vikadata.api.annotation.PageObjectParam;
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
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
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
 * 用户接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-02
 */
@Slf4j
@RestController
@Api(tags = "账户中心模块_用户管理接口")
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
    @ApiOperation(value = "查询账户积分信息")
    public ResponseData<UserIntegralVo> integrals() {
        Long userId = SessionContext.getUserId();
        int totalIntegral = iIntegralService.getTotalIntegralValueByUserId(userId);
        UserIntegralVo vo = new UserIntegralVo();
        vo.setTotalIntegral(totalIntegral);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/integral/records", requiredPermission = false)
    @ApiOperation(value = "分页查询积分收支明细")
    @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数，说明看接口描述", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_COMPLEX_EXAMPLE)
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<IntegralRecordVO>> integralRecords(@PageObjectParam Page page) {
        Long userId = SessionContext.getUserId();
        IPage<IntegralRecordVO> results = iIntegralService.getIntegralRecordPageByUserId(page, userId);
        return ResponseData.success(PageHelper.build(results));
    }

    @PostResource(name = "解除第三方账号绑定", path = "/unbind", requiredPermission = false)
    @ApiOperation(value = "解除第三方账号绑定")
    public ResponseData<Void> unbind(@RequestBody @Valid UserLinkOpRo opRo) {
        Long userId = SessionContext.getUserId();
        iUserService.unbind(userId, opRo.getType());
        // 删除缓存
        userLinkInfoService.delete(userId);
        return ResponseData.success();
    }

    @GetResource(name = "查询用户是否绑定邮箱", path = "/email/bind", requiredPermission = false)
    @ApiOperation(value = "查询用户是否绑定邮箱", notes = "查询用户是否绑定邮箱")
    public ResponseData<Boolean> validBindEmail() {
        Long userId = SessionContext.getUserId();
        Boolean exist = iUserService.checkUserHasBindEmail(userId);
        return ResponseData.success(exist);
    }

    @PostResource(name = "查询用户是否与指定邮箱一致", path = "/validate/email", requiredPermission = false)
    @ApiOperation(value = "查询用户是否与指定邮箱一致", notes = "查询用户是否与指定邮箱一致,前提条件是用户已经绑定了邮箱才能判断")
    public ResponseData<Boolean> validSameEmail(@RequestBody @Valid CheckUserEmailRo data) {
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        ExceptionUtil.isNotNull(user.getEmail(), USER_NOT_BIND_EMAIL);
        return ResponseData.success(user.getEmail().equals(data.getEmail()));
    }

    @PostResource(name = "关联受邀邮箱", path = "/link/inviteEmail", requiredPermission = false)
    @ApiOperation(value = "关联受邀邮箱", notes = "在用户没有其他邮箱的情况下，只能关联受邀邮箱", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> bindEmail(@RequestBody @Valid UserLinkEmailRo data) {
        String email = data.getEmail();
        String spaceId = data.getSpaceId();
        Long userId = SessionContext.getUserId();
        iUserService.bindMemberByEmail(userId, spaceId, email);
        return ResponseData.success();
    }

    @PostResource(name = "关联钉钉", path = "/bindDingTalk", requiredPermission = false)
    @ApiOperation(value = "关联钉钉", notes = "关联钉钉", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> bindDingTalk(@RequestBody @Valid DtBindOpRo opRo) {
        ValidateTarget target = ValidateTarget.create(opRo.getPhone(), opRo.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).verifyIsPass(target.getRealTarget());
        iUserService.bindDingTalk(opRo);
        return ResponseData.success();
    }

    @PostResource(name = "绑定邮箱", path = "/bindEmail", requiredPermission = false)
    @ApiOperation(value = "绑定邮箱", notes = "绑定邮箱、修改邮箱", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> verifyEmail(@RequestBody @Valid EmailCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getEmail());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).validate(target, param.getCode(), true, CodeValidateScope.BOUND_EMAIL);
        //判断是否存在
        boolean exist = iUserService.checkByEmail(param.getEmail());
        ExceptionUtil.isFalse(exist, EMAIL_HAS_BIND);
        Long userId = SessionContext.getUserId();
        iUserService.updateEmailByUserId(userId, param.getEmail());
        return ResponseData.success();
    }

    @PostResource(name = "解绑邮箱", path = "/unbindEmail", requiredPermission = false)
    @ApiOperation(value = "解绑邮箱", notes = "绑定邮箱、修改邮箱", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> unbindEmail(@RequestBody @Valid CodeValidateRo param) {
        LoginUserDto loginUser = LoginContext.me().getLoginUser();
        // 判断用户是否绑定邮箱
        ExceptionUtil.isNotBlank(loginUser.getEmail(), USER_NOT_BIND_EMAIL);
        ValidateTarget target = ValidateTarget.create(loginUser.getEmail());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL).validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
        iUserService.unbindEmailByUserId(loginUser.getUserId());
        return ResponseData.success();
    }

    @PostResource(name = "绑定新手机", path = "/bindPhone", requiredPermission = false)
    @ApiOperation(value = "绑定新手机", notes = "绑定新手机", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> verifyPhone(@RequestBody @Valid SmsCodeValidateRo param) {
        ValidateTarget target = ValidateTarget.create(param.getPhone(), param.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).validate(target, param.getCode(), true, CodeValidateScope.BOUND_MOBILE);
        // 判断是否存在
        boolean exist = iUserService.checkByCodeAndMobile(param.getAreaCode(), param.getPhone());
        ExceptionUtil.isFalse(exist, MOBILE_HAS_REGISTER);
        Long userId = SessionContext.getUserId();
        iUserService.updateMobileByUserId(userId, param.getAreaCode(), param.getPhone());
        return ResponseData.success();
    }

    @PostResource(name = "解绑手机", path = "/unbindPhone", requiredPermission = false)
    @ApiOperation(value = "解绑手机", notes = "解绑手机", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> unbindPhone(@RequestBody @Valid CodeValidateRo param) {
        LoginUserDto loginUser = LoginContext.me().getLoginUser();
        // 判断用户是否绑定手机号
        ExceptionUtil.isNotBlank(loginUser.getMobile(), USER_NOT_BIND_PHONE);
        ValidateTarget target = ValidateTarget.create(loginUser.getMobile(), loginUser.getAreaCode());
        ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS).validate(target, param.getCode(), true, CodeValidateScope.UN_BOUND_MOBILE);
        iUserService.unbindMobileByUserId(loginUser.getUserId());
        return ResponseData.success();
    }

    @PostResource(name = "编辑用户信息", path = "/update", requiredPermission = false)
    @ApiOperation(value = "编辑用户信息", notes = "请求参数不能全为空", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<String> update(@RequestBody @Valid UserOpRo param) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(param.getAvatar()) || StrUtil.isNotBlank(param.getNickName())
                || StrUtil.isNotBlank(param.getLocale()), ParameterException.NO_ARG);
        Long userId = SessionContext.getUserId();
        iUserService.edit(userId, param);
        if (StrUtil.isNotBlank(param.getAvatar())) {
            return ResponseData.success(StringUtil.trimSlash(constProperties.getOssBucketByAsset().getResourceUrl()) + param.getAvatar());
        }
        if (BooleanUtil.isTrue(param.getInit()) && StrUtil.isNotBlank(param.getNickName())) {
            //神策埋点 - 初始化昵称
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.SET_NICKNAME, null, origin));
        }
        return ResponseData.success(null);
    }

    @PostResource(name = "修改密码", path = "/updatePwd", requiredPermission = false)
    @ApiOperation(value = "修改密码", notes = "场景：1、个人设置修改密码；2、未设置密码的帐号登录后初始化", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> updatePwd(@RequestBody UpdatePwdOpRo param) {
        verificationService.verifyPassword(param.getPassword());
        Long userId = SessionContext.getUserId();
        if (StrUtil.isNotBlank(param.getCode())) {
            // 场景1，验证码校验
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
                // 帐号同时未绑定手机、邮箱，才允许跳过验证码校验
                ExceptionUtil.isTrue(StrUtil.isBlank(loginUserDto.getEmail())
                        && StrUtil.isBlank(loginUserDto.getMobile()), MODIFY_PASSWORD_ERROR);
            }
            // 修改密码
            iUserService.updatePwd(userId, param.getPassword());
            // 异步发送短信通知
            if (StrUtil.isNotBlank(loginUserDto.getMobile())) {
                ValidateTarget target = ValidateTarget.create(loginUserDto.getMobile(), loginUserDto.getAreaCode());
                TaskManager.me().execute(() -> iSmsService.sendMessage(target, TencentConstants.SmsTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE));
            }
            // 关闭帐号其他端登录会话
            iUserService.closeMultiSession(userId, true);
        }
        else {
            // 判断用户帐号是否设置密码，已设置密码的帐号不能使用初始化
            boolean needPwd = LoginContext.me().getLoginUser().getNeedPwd();
            ExceptionUtil.isTrue(needPwd, PASSWORD_HAS_SETTING);
            iUserService.updatePwd(userId, param.getPassword());
        }
        return ResponseData.success();
    }

    @PostResource(name = "找回密码", path = "/retrievePwd", requiredLogin = false)
    @ApiOperation(value = "找回密码", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> retrievePwd(@RequestBody @Valid RetrievePwdOpRo param) {
        // 校验密码格式
        verificationService.verifyPassword(param.getPassword());
        UserEntity user;
        if (param.getType() == ValidateType.EMAIL_CODE) {
            // 校验邮件验证码
            ValidateTarget target = ValidateTarget.create(param.getUsername());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL)
                    .validate(target, param.getCode(), true, CodeValidateScope.COMMON_VERIFICATION);
            // 判断帐号是否存在
            user = iUserService.getByEmail(param.getUsername());
            ExceptionUtil.isNotNull(user, EMAIL_NO_EXIST);
        }
        else {
            // 校验短信验证码
            ValidateTarget target = ValidateTarget.create(param.getUsername(), param.getAreaCode());
            ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS)
                    .validate(target, param.getCode(), true, CodeValidateScope.UPDATE_PWD);
            // 判断帐号是否存在
            user = iUserService.getByCodeAndMobilePhone(param.getAreaCode(), param.getUsername());
            ExceptionUtil.isNotNull(user, MOBILE_NO_EXIST);
        }
        Long id = user.getId();
        // 修改密码
        iUserService.updatePwd(id, param.getPassword());
        // 异步发送短信通知
        if (user.getMobilePhone() != null) {
            TaskManager.me().execute(() -> iSmsService.sendMessage(ValidateTarget.create(user.getMobilePhone(), user.getCode()),
                    TencentConstants.SmsTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE));
        }
        // 关闭帐号其他端登录会话
        iUserService.closeMultiSession(id, false);
        //解除密码错误频繁导致的账号锁定
        redisTemplate.delete(ERROR_PWD_NUM_DIR + id);
        return ResponseData.success();
    }

    @GetResource(name = "查询是否已登录", path = "/session", requiredLogin = false)
    @ApiOperation(value = "查询是否已登录", notes = "获取自己必要信息", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Boolean> meSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return ResponseData.success(session != null && session.getAttribute(SessionAttrConstants.LOGIN_USER_ID) != null);
    }

    @PostResource(name = "申请注销用户账号", path = "/applyForClosing", requiredPermission = false)
    @ApiOperation(value = "申请注销用户账号", notes = "已注册登录用户申请注销账号", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> applyForClosing() {
        // 获取当前登录用户
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        // 判断用户是否已经申请过账号注销
        ExceptionUtil.isFalse(user.getIsPaused(), USER_APPLIED_FOR_CLOSING);
        // 判断当前用户是否满足注销条件
        boolean allowedToBeClosed = userHistoryService.checkAccountAllowedToBeClosed(userId);
        ExceptionUtil.isTrue(allowedToBeClosed, USER_NOT_ALLOWED_TO_CLOSE);
        // 注销账号，进入冷静期
        iUserService.applyForClosingAccount(user);
        // 销毁用户cookie并维持会话
        iUserService.closeMultiSession(userId, true);
        return ResponseData.success();
    }

    @GetResource(name = "校验账号能否注销", path = "/checkForClosing", requiredPermission = false)
    @ApiOperation(value = "校验账号能否注销", notes = "未注销用户校验账号是否满足注销条件", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> checkForClosing() {
        // 获取当前登录用户
        Long userId = SessionContext.getUserId();
        // 判断当前用户是否满足账号注销条件
        boolean isAllowedToBeClosed = userHistoryService.checkAccountAllowedToBeClosed(userId);
        ExceptionUtil.isTrue(isAllowedToBeClosed, USER_NOT_ALLOWED_TO_CLOSE);
        return ResponseData.success();
    }

    @PostResource(name = "申请恢复账号", path = "/cancelClosing", requiredPermission = false)
    @ApiOperation(value = "申请恢复账号", notes = "已申请注销用户恢复账号", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> cancelClosing() {
        // 获取当前登录用户
        Long userId = SessionContext.getUserId();
        UserEntity user = iUserService.getById(userId);
        // 未提交注销账号申请，无法撤回注销
        ExceptionUtil.isTrue(user.getIsPaused(), USER_NOT_ALLOWED_CANCEL_CLOSING);
        // 账号已过冷静期，无法恢复
        ExceptionUtil.isFalse(user.getIsDeleted(), USER_CANCELED_CLOSING);
        // 撤销账号注销
        iUserService.cancelClosingAccount(user);
        return ResponseData.success();
    }

    @GetResource(name = "获取已开启的实验性功能", path = "/labs/features", requiredPermission = false)
    @ApiOperation(value = "获取已开启的实验性功能", notes = "获取已开启的实验性功能", produces = MediaType.APPLICATION_JSON_VALUE)
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
    @ApiOperation(value = "更新实验室功能的使用状态", notes = "更新实验室功能的使用状态", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> updateLabsFeatureStatus(@RequestBody @Valid UserLabsFeatureRo userLabsFeatureRo) {
        // 获取当前用户的userId
        Long userId = SessionContext.getUserId();
        // 获取待操作空间站级别功能的spaceId
        String spaceId = userLabsFeatureRo.getSpaceId();
        // 获取待操作功能的featureKey
        String featureKey = userLabsFeatureRo.getKey();
        // 操作空间站级别功能必须带上spaceId，否则不允许操作
        LabsApplicantTypeEnum applicantType = ofLabsFeature(featureKey).getApplicantType();
        ExceptionUtil.isFalse(SPACE_LEVEL_FEATURE.equals(applicantType) && StrUtil.isBlank(spaceId), SPACE_ID_NOT_EMPTY);
        // 当操作用户不属于该空间站，不允许操作
        UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
        ExceptionUtil.isNotNull(userSpace, NOT_IN_SPACE);
        String applicant = StrUtil.isNotBlank(spaceId) ? spaceId : Long.toString(userId);
        if (userLabsFeatureRo.getIsEnabled()) {
            // 启用实验性功能
            iLabsApplicantService.enableLabsFeature(applicant, applicantType, featureKey, userId);
        }
        else {
            // 停用实验性功能
            iLabsApplicantService.disableLabsFeature(applicant, featureKey);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/invite/reward", requiredPermission = false)
    @ApiOperation(value = "填写邀请码奖励", notes = "用户补写邀请码并获得奖励", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> inviteCodeReward(@RequestBody @Validated InviteCodeRewardRo body) {
        // 校验邀请码的有效性
        ivCodeService.checkInviteCode(body.getInviteCode());
        // 填写邀请码并奖励积分
        Long userId = SessionContext.getUserId();
        iUserService.useInviteCodeReward(userId, body.getInviteCode());
        return ResponseData.success();
    }

    @PostResource(path = "/delActiveSpaceCache", method = { RequestMethod.GET }, requiredPermission = false)
    @ApiOperation(value = "删除活动空间缓存")
    public ResponseData<Void> delActiveSpaceCache() {
        // 填写邀请码并奖励积分
        Long userId = SessionContext.getUserId();
        userActiveSpaceService.delete(userId);
        return ResponseData.success();
    }
}
