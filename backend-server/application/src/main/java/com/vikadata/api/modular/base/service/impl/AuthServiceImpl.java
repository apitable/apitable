package com.vikadata.api.modular.base.service.impl;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.autoconfigure.tencent.WebAppProperties;
import com.apitable.starter.wx.mp.autoconfigure.WxMpProperties;
import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.IntegralActionCodeConstants;
import com.vikadata.api.enums.exception.VCodeException;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.enums.vcode.VCodeType;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.dto.user.ThirdPartyMemberInfo;
import com.vikadata.api.model.dto.user.UserLoginResult;
import com.vikadata.api.model.dto.user.UserRegisterResult;
import com.vikadata.api.model.ro.user.LoginRo;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.finance.service.IBillingOfflineService;
import com.vikadata.api.modular.integral.enums.IntegralAlterType;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.vcode.mapper.VCodeMapper;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCodeProcessor;
import com.vikadata.api.security.ValidateCodeProcessorManage;
import com.vikadata.api.security.ValidateCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.security.afs.AfsCheckService;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.UserEntity;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.integral.IntegralRule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.NotificationConstants.ACTION_NAME;
import static com.vikadata.api.constants.NotificationConstants.COUNT;
import static com.vikadata.api.enums.exception.ActionException.CODE_EMPTY;
import static com.vikadata.api.enums.exception.UserException.AUTH_INFO_NO_VALID;
import static com.vikadata.api.enums.exception.UserException.LOGIN_OFTEN;
import static com.vikadata.api.enums.exception.UserException.MOBILE_BOUND_EMAIL_DUPLICATE;
import static com.vikadata.api.enums.exception.UserException.MOBILE_EMPTY;
import static com.vikadata.api.enums.exception.UserException.MOBILE_HAS_REGISTER;
import static com.vikadata.api.enums.exception.UserException.REGISTER_BY_INVITE_CODE_OPERATION_FREQUENTLY;
import static com.vikadata.api.enums.exception.UserException.REGISTER_EMAIL_ERROR;
import static com.vikadata.api.enums.exception.UserException.REGISTER_EMAIL_HAS_EXIST;
import static com.vikadata.api.enums.exception.UserException.USERNAME_OR_PASSWORD_ERROR;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;
import static com.vikadata.core.constants.RedisConstants.ERROR_PWD_NUM_DIR;
import static com.vikadata.core.constants.RedisConstants.GENERAL_LOCKED;
import static com.vikadata.core.constants.RedisConstants.USER_AUTH_INFO_TOKEN;

/**
 * Authorization-related service interface implementation
 */
@Service
@Slf4j
public class AuthServiceImpl implements IAuthService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private IUserService iUserService;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private IVCodeService ivCodeService;

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private IAssetService iAssetService;

    @Autowired(required = false)
    private WxMpProperties wxMpProperties;

    @Autowired(required = false)
    private WebAppProperties webAppProperties;

    @Resource
    private IVCodeService iVCodeService;

    @Resource
    private IIntegralService iIntegralService;

    @Resource
    private VCodeMapper vCodeMapper;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IBillingOfflineService iBillingOfflineService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long loginByPassword(LoginRo loginRo) {
        // human-machine verification
        afsCheckService.noTraceCheck(loginRo.getData());
        UserEntity user = iUserService.getByUsername(loginRo.getAreaCode(), loginRo.getUsername());
        int errorPwdCount = 0;
        String key = ERROR_PWD_NUM_DIR + user.getId();
        // Determine whether you have entered the wrong password more than five times in a row
        if (BooleanUtil.isTrue(redisTemplate.hasKey(key))) {
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
            errorPwdCount = Integer.parseInt(Objects.requireNonNull(opts.get()).toString());
            ExceptionUtil.isTrue(errorPwdCount < 5, LOGIN_OFTEN);
        }
        // Determine the password
        PasswordEncoder passwordEncoder = SpringContextHolder.getBean(PasswordEncoder.class);
        if (passwordEncoder.matches(loginRo.getCredential(), user.getPassword())) {
            // Third-party account linking
            SocialAuthInfo authInfo = this.getAuthInfoFromCache(loginRo.getToken());
            if (authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId())) {
                // Create association
                this.createUserLink(user.getId(), authInfo, true);
                // Immediately delete authorization information from the cache
                this.removeInviteTokenFromCache(loginRo.getToken());
            }
            // Successful login, clear the number of wrong password input
            redisTemplate.delete(key);
            // Update last login time
            iUserService.updateLoginTime(user.getId());
            return user.getId();
        }
        else {
            // Record the number of wrong passwords entered, and the account will be locked for 20 minutes if the
            // wrong password is entered more than five times in a row
            redisTemplate.opsForValue().set(key, errorPwdCount + 1, 20, TimeUnit.MINUTES);
            throw new BusinessException(USERNAME_OR_PASSWORD_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long loginUsingPassword(LoginRo loginRo) {
        // Get the user according to the user name (email area code + mobile phone), if the user name cannot be queried, an exception will be thrown automatically
        UserEntity user = iUserService.getByUsername(loginRo.getAreaCode(), loginRo.getUsername());
        // Record the wrong keys of the user password, and lock them for 20 minutes each time
        String errorInputPwdCountKey = ERROR_PWD_NUM_DIR + user.getId();
        int errorPwdCount = 0;
        // Determine whether you have entered the wrong password more than five times in a row
        if (BooleanUtil.isTrue(redisTemplate.hasKey(errorInputPwdCountKey))) {
            // There is a record of the number of wrong passwords, and calculate whether it is greater than 5 times
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(errorInputPwdCountKey);
            Object value = opts.get();
            if (!Objects.isNull(value)) {
                errorPwdCount = Integer.parseInt(value.toString());
                ExceptionUtil.isTrue(errorPwdCount < 5, LOGIN_OFTEN);
            }
        }
        // Check if the passwords match
        PasswordEncoder passwordEncoder = SpringContextHolder.getBean(PasswordEncoder.class);
        if (!passwordEncoder.matches(loginRo.getCredential(), user.getPassword())) {
            // Record the number of wrong passwords entered, and the account will be locked for 20 minutes if the wrong password is entered more than five times in a row
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(errorInputPwdCountKey);
            opts.set(errorPwdCount + 1, 20, TimeUnit.MINUTES);
            throw new BusinessException(USERNAME_OR_PASSWORD_ERROR);
        }
        // Update last login time
        iUserService.updateLoginTime(user.getId());
        // Successful login, clear the number of wrong password input
        redisTemplate.delete(errorInputPwdCountKey);
        return user.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserLoginResult loginBySmsCode(LoginRo loginRo) {
        String mobile = loginRo.getUsername();
        String code = StrUtil.trim(loginRo.getCredential());
        // Check parameters
        ExceptionUtil.isNotBlank(code, CODE_EMPTY);
        // Verify verification code
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(loginRo.getUsername(), loginRo.getAreaCode());
        processor.validate(target, code, false, CodeValidateScope.LOGIN);
        UserLoginResult result = new UserLoginResult();
        Long userId = userMapper.selectIdByMobile(mobile);
        // Get user authorization information from cache
        SocialAuthInfo authInfo = this.getAuthInfoFromCache(loginRo.getToken());
        // Whether to link the account
        boolean link = authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId());
        // Whether to bind the mailbox
        boolean bindEmail = authInfo != null && StrUtil.isNotBlank(authInfo.getEmail());
        if (ObjectUtil.isNotNull(userId)) {
            // third party account linking
            if (link) {
                this.createUserLink(userId, authInfo, true);
                result.setUnionId(authInfo.getUnionId());
            }
            // Enter after the email verification code, bind the email with the Weige account
            if (bindEmail) {
                this.emailProcess(userId, authInfo.getEmail());
            }
            // Update last login time
            iUserService.updateLoginTime(userId);
            result.setUserId(userId);
        }
        else {
            // Check whether the third-party account is associated with other Weige accounts
            if (link) {
                iUserLinkService.checkThirdPartyLinkOtherUser(authInfo.getUnionId(), authInfo.getType());
            }
            else if (!bindEmail) {
                authInfo = new SocialAuthInfo();
            }
            authInfo.setAreaCode(loginRo.getAreaCode());
            authInfo.setMobile(mobile);
            result.setToken(this.saveAuthInfoToCache(authInfo));
        }
        // delete verification code
        processor.delCode(target.getRealTarget(), CodeValidateScope.LOGIN);
        // Immediately delete authorization information from the cache
        this.removeInviteTokenFromCache(loginRo.getToken());
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserLoginResult loginUsingSmsCode(LoginRo loginRo) {
        UserLoginResult result = new UserLoginResult();
        // Log in by SMS verification code, if it does not exist, it will automatically register
        String areaCode = StrUtil.trim(loginRo.getAreaCode());
        ExceptionUtil.isNotBlank(areaCode, MOBILE_EMPTY);
        String mobile = StrUtil.trim(loginRo.getUsername());
        ExceptionUtil.isNotBlank(mobile, MOBILE_EMPTY);
        String mobileValidCode = StrUtil.trim(loginRo.getCredential());
        ExceptionUtil.isNotBlank(mobileValidCode, CODE_EMPTY);
        // Verify mobile phone verification code
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(loginRo.getUsername(), loginRo.getAreaCode());
        processor.validate(target, mobileValidCode, false, CodeValidateScope.LOGIN);
        // Get user authorization information from cache
        SocialAuthInfo authInfo = getAuthInfoFromCache(loginRo.getToken());
        // Whether to bind the mobile phone number after the third-party scan code login operation
        boolean socialLogin = authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId());
        if (socialLogin) {
            iUserLinkService.checkThirdPartyLinkOtherUser(authInfo.getUnionId(), authInfo.getType());
            // Load and obtain third-party nicknames and avatars
            useThirdPartyInfo(authInfo);
        }
        Long userId = iUserService.getUserIdByMobile(mobile);
        if (ObjectUtil.isNotNull(userId)) {
            // Update last login time
            iUserService.updateLoginTime(userId);
            // Query whether there is a space member corresponding to a mobile phone number
            List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByMobile(mobile);
            iUserService.activeInvitationSpace(userId, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        }
        else {
            // registered a new user
            String nickName = socialLogin ? authInfo.getNickName() : null;
            String avatar = socialLogin ? authInfo.getAvatar() : null;
            userId = registerUserUsingMobilePhone(areaCode, mobile, nickName, avatar);
            if (StrUtil.isNotEmpty(loginRo.getSpaceId())) {
                // Cache, used to invite users to give away attachment capacity
                this.handleCache(userId, loginRo.getSpaceId());
            }
            result.setIsSignUp(true);
        }
        // If it is a third-party application that binds the account after scanning the code to log in
        if (socialLogin) {
            createUserLink(userId, authInfo, false);
        }
        // delete verification code
        processor.delCode(target.getRealTarget(), CodeValidateScope.LOGIN);
        // Immediately delete third-party authorization information from the cache
        this.removeInviteTokenFromCache(loginRo.getToken());
        result.setUserId(userId);
        return result;
    }

    @Override
    public UserLoginResult loginByEmailCode(LoginRo loginRo) {
        String email = loginRo.getUsername();
        String code = StrUtil.trim(loginRo.getCredential());
        // Check parameters
        ExceptionUtil.isTrue(Validator.isEmail(email), REGISTER_EMAIL_ERROR);
        ExceptionUtil.isNotBlank(code, CODE_EMPTY);
        // Verify verification code
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(ValidateTarget.create(email), code, false, CodeValidateScope.REGISTER_EMAIL);
        UserLoginResult result = new UserLoginResult();
        // determine whether there is
        UserEntity userEntity = userMapper.selectByEmail(email);
        if (ObjectUtil.isNotNull(userEntity)) {
            // Update last login time
            iUserService.updateLoginTime(userEntity.getId());
            result.setUserId(userEntity.getId());
        }
        else {
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setEmail(email);
            result.setToken(this.saveAuthInfoToCache(authInfo));
        }
        // delete verification code
        processor.delCode(email, CodeValidateScope.REGISTER_EMAIL);
        return result;
    }

    @Override
    public UserLoginResult loginUsingEmailCode(LoginRo loginRo) {
        UserLoginResult result = new UserLoginResult();
        String email = loginRo.getUsername();
        String emailValidCode = StrUtil.trim(loginRo.getCredential());
        // Check parameters
        ExceptionUtil.isTrue(Validator.isEmail(email), REGISTER_EMAIL_ERROR);
        ExceptionUtil.isNotBlank(emailValidCode, CODE_EMPTY);
        // Verify verification code
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(ValidateTarget.create(email), emailValidCode, false, CodeValidateScope.REGISTER_EMAIL);
        // determine whether there is
        Long userId = iUserService.getUserIdByEmail(email);
        if (userId != null) {
            // Update last login time
            iUserService.updateLoginTime(userId);
            // Query whether there is a space member corresponding to the mailbox, only new registration will have this operation
            List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(email);
            iUserService.activeInvitationSpace(userId, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        }
        else {
            // Email automatic registration users do not provide third-party scan code login binding
            userId = registerUserUsingEmail(email, loginRo.getSpaceId());
            if (StrUtil.isNotEmpty(loginRo.getSpaceId())) {
                // Cache, used to invite users to give away attachment capacity
                this.handleCache(userId, loginRo.getSpaceId());
            }
            result.setIsSignUp(true);
        }
        // delete verification code
        processor.delCode(email, CodeValidateScope.LOGIN);
        result.setUserId(userId);
        return result;
    }

    public Long registerUserUsingMobilePhone(String areaCode, String mobile, String nickName, String avatar) {
        // Create a new user based on the mobile phone number and activate the corresponding member
        UserEntity user = iUserService.createUserByMobilePhone(areaCode, mobile, nickName, avatar);
        // Query whether there is a space member corresponding to a mobile phone number
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByMobile(mobile);
        createOrActiveSpace(user, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        return user.getId();
    }

    public Long registerUserUsingEmail(String email, String spaceId) {
        // Create a new user based on the mailbox and activate the corresponding member
        UserEntity user = iUserService.createUserByEmail(email);
        // Query whether there is a space member corresponding to the mailbox, only new registration will have this operation
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(email);
        // Invite new users to join the space station to reward attachment capacity, asynchronous operation
        TaskManager.me().execute(() -> this.checkSpaceRewardCapacity(user.getId(), user.getNickName(), spaceId));
        createOrActiveSpace(user, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        return user.getId();
    }

    private void createOrActiveSpace(UserEntity user, List<Long> memberIds) {
        if (memberIds.isEmpty()) {
            iUserService.initialDefaultSpaceForUser(user);
        }
        else {
            iUserService.activeInvitationSpace(user.getId(), memberIds);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserRegisterResult signUpByInviteCode(String token, String inviteCode) {
        log.info("Invitation code to register new user: {}-{}", token, inviteCode);
        // Get user authorization information from cache
        SocialAuthInfo authInfo = this.getAuthInfoFromCache(token);
        ExceptionUtil.isTrue(authInfo != null, AUTH_INFO_NO_VALID);
        boolean isMobile = StrUtil.isNotBlank(authInfo.getMobile());
        boolean isEmail = StrUtil.isNotBlank(authInfo.getEmail());
        ExceptionUtil.isTrue(isMobile || isEmail, AUTH_INFO_NO_VALID);
        String credential = isMobile ? authInfo.getMobile() : authInfo.getEmail();
        // lock registration credentials
        this.lockRegisterCredential(credential);
        // Verify the validity of the invitation code (put it after the cache operation to reduce malicious attacks on the same registration credential and cause pressure on the database)
        if (StrUtil.isNotBlank(inviteCode)) {
            try {
                iVCodeService.checkInviteCode(inviteCode);
            }
            finally {
                // Immediately release the registration credential lock
                this.releaseLockForRegisterCredential(credential);
            }
        }
        if (isMobile) {
            // Check the phone number is not registered
            boolean exist = iUserService.checkByCodeAndMobile(authInfo.getAreaCode(), authInfo.getMobile());
            ExceptionUtil.isFalse(exist, MOBILE_HAS_REGISTER);
        }
        boolean link = StrUtil.isNotBlank(authInfo.getUnionId());
        // Check whether the third-party account is associated with other Weige accounts
        if (link) {
            iUserLinkService.checkThirdPartyLinkOtherUser(authInfo.getUnionId(), authInfo.getType());
            // get third party nicknames and avatars
            useThirdPartyInfo(authInfo);
        }
        String email = null;
        UserRegisterResult result = new UserRegisterResult();
        if (isEmail) {
            // Verify that the mailbox is not bound by other Weige accounts
            boolean exist = iUserService.checkByEmail(authInfo.getEmail());
            ExceptionUtil.isFalse(exist, REGISTER_EMAIL_HAS_EXIST);
            email = authInfo.getEmail();
            result.setEmailRegister(true);
        }
        // registered a new user
        Long registerUserId = iUserService.create(authInfo.getAreaCode(), authInfo.getMobile(),
                authInfo.getNickName(), authInfo.getAvatar(), email, authInfo.getTenantName());
        result.setUserId(registerUserId);
        // third party account association
        if (link) {
            this.createUserLink(registerUserId, authInfo, false);
            result.setType(authInfo.getType());
            result.setUnionId(authInfo.getUnionId());
        }
        // invitation reward
        this.invitedReward(registerUserId, authInfo, inviteCode);
        // Immediately delete authorization information from the cache
        this.removeInviteTokenFromCache(token);
        // Immediately release the registration credential lock
        this.releaseLockForRegisterCredential(credential);
        return result;
    }

    private void invitedReward(Long registerUserId, SocialAuthInfo authInfo, String inviteCode) {
        // skip the invitation code without reward
        if (inviteCode == null) {
            return;
        }
        // save the invitation code usage record
        ivCodeService.useInviteCode(registerUserId, authInfo.getNickName(), inviteCode);
        // No reward for email registration
        if (StrUtil.isBlank(authInfo.getMobile())) {
            return;
        }
        // Invitation code owner, non-personal invitation code does not process rewards
        Long inviteUserId = vCodeMapper.selectRefIdByCodeAndType(inviteCode, VCodeType.PERSONAL_INVITATION_CODE.getType());
        if (inviteUserId == null) {
            // ============ Official Invitation Registration Reward Points ================
            this.officialInvitedReward(registerUserId);
            return;
        }
        this.personalInvitedReward(registerUserId, authInfo.getNickName(), inviteUserId);
    }

    @Override
    public void officialInvitedReward(Long registerUserId) {
        String officialRewardActionCode = IntegralActionCodeConstants.OFFICIAL_INVITATION_REWARD;
        IntegralRule beInvitedRewardIntegralRule = SystemConfigManager.getConfig().getIntegral().getRule().get(officialRewardActionCode);
        int beInvitedRewardIntegralValue = beInvitedRewardIntegralRule.getIntegralValue();
        int beInvitorBeforeIntegralValue = iIntegralService.getTotalIntegralValueByUserId(registerUserId);
        // new user create points record
        iIntegralService.createHistory(registerUserId, officialRewardActionCode, IntegralAlterType.INCOME,
                beInvitorBeforeIntegralValue, beInvitedRewardIntegralValue, JSONUtil.createObj());
        // send notification
        if (beInvitedRewardIntegralRule.isNotify()) {
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY,
                    Collections.singletonList(registerUserId), 0L, null,
                    Dict.create().set(COUNT, beInvitedRewardIntegralRule.getIntegralValue()).set(ACTION_NAME, beInvitedRewardIntegralRule.getActionName())));
        }
    }

    @Override
    public void personalInvitedReward(Long registerUserId, String registerUserName, Long inviteUserId) {
        // To apply bonus points to the inviter, first lock the current user points changes
        Lock lock = redisLockRegistry.obtain(inviteUserId.toString());
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // ============ Invited to register reward point value ================
                    IntegralRule beInvitedRewardIntegralRule = SystemConfigManager.getConfig().getIntegral().getRule().get(IntegralActionCodeConstants.BE_INVITED_TO_REWARD);
                    int beInvitedRewardIntegralValue = beInvitedRewardIntegralRule.getIntegralValue();
                    // new user create points record
                    String invitorName = userMapper.selectUserNameById(inviteUserId);
                    int beInvitorBeforeIntegralValue = iIntegralService.getTotalIntegralValueByUserId(registerUserId);
                    iIntegralService.createHistory(registerUserId, IntegralActionCodeConstants.BE_INVITED_TO_REWARD, IntegralAlterType.INCOME,
                            beInvitorBeforeIntegralValue, beInvitedRewardIntegralValue, JSONUtil.createObj().putOnce("name", invitorName));
                    // send notification
                    if (beInvitedRewardIntegralRule.isNotify()) {
                        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY,
                                Collections.singletonList(registerUserId), 0L, null,
                                Dict.create().set(COUNT, beInvitedRewardIntegralRule.getIntegralValue()).set(ACTION_NAME, beInvitedRewardIntegralRule.getActionName())));
                    }

                    // ============ Reward code owner =============
                    IntegralRule inviteRewardIntegralRule = SystemConfigManager.getConfig().getIntegral().getRule().get(IntegralActionCodeConstants.INVITATION_REWARD);
                    // mobile phone registration to get reward multiples
                    int inviteRewardIntegralValue = inviteRewardIntegralRule.getIntegralValue();
                    int invitorBeforeIntegralValue = iIntegralService.getTotalIntegralValueByUserId(inviteUserId);
                    // create points record
                    String inviteUserName = registerUserName != null ? registerUserName : userMapper.selectUserNameById(registerUserId);
                    Long recordId = iIntegralService.createHistory(inviteUserId, IntegralActionCodeConstants.INVITATION_REWARD, IntegralAlterType.INCOME,
                            invitorBeforeIntegralValue, inviteRewardIntegralValue,
                            JSONUtil.createObj().putOnce("userId", registerUserId).putOnce("name", inviteUserName));
                    // send notification
                    if (inviteRewardIntegralRule.isNotify()) {
                        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY,
                                Collections.singletonList(inviteUserId), 0L, null,
                                Dict.create().set(COUNT, inviteRewardIntegralValue).set(ACTION_NAME, inviteRewardIntegralRule.getActionName())));
                    }
                    // Temporarily record the invited new user, and change the name across connections
                    String key = RedisConstants.getInviteHistoryKey(registerUserId.toString());
                    redisTemplate.opsForValue().set(key, recordId, 1, TimeUnit.HOURS);
                }
                catch (Exception e) {
                    // if the business fails throw an exception directly
                    log.error("Invitation code registration reward failed", e);
                    throw new BusinessException(VCodeException.INVITE_CODE_REWARD_ERROR);
                }
                finally {
                    // Unlock the points lock of the user who owns the invitation code
                    lock.unlock();
                }
            }
            else {
                // The registration operation is too frequent, please try again later
                log.error("The registration operation is too frequent, please try again later");
                throw new BusinessException(VCodeException.INVITE_CODE_FREQUENTLY);
            }
        }
        catch (InterruptedException e) {
            // Interrupted, return failure message
            log.error("Invitation code registration reward failed", e);
            throw new BusinessException(VCodeException.INVITE_CODE_REWARD_ERROR);
        }
    }

    @Override
    public void checkSpaceRewardCapacity(Long userId, String userName, String spaceId) {
        // the invited members are successfully activated, and the space station will receive a 300M accessory capacity
        if (spaceId != null) {
            iBillingOfflineService.createGiftCapacityOrder(userId, userName, spaceId);
        }
    }

    @Override
    public String saveAuthInfoToCache(SocialAuthInfo authInfo) {
        String token = RandomExtendUtil.randomString(12);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
        ops.set(JSONUtil.parseObj(authInfo).toString(), 15, TimeUnit.MINUTES);
        return token;
    }

    @Override
    public SocialAuthInfo getAuthInfoFromCache(String token) {
        if (StrUtil.isBlank(token)) {
            return null;
        }
        // get user authorization information from cache
        BoundValueOperations<String, ?> authCache = redisTemplate.boundValueOps(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
        return JSONUtil.parseObj(authCache.get()).toBean(SocialAuthInfo.class);
    }

    private void lockRegisterCredential(String credential) {
        String key = StrUtil.format(GENERAL_LOCKED, "register", credential);
        if (BooleanUtil.isTrue(redisTemplate.hasKey(key))) {
            throw new BusinessException(REGISTER_BY_INVITE_CODE_OPERATION_FREQUENTLY);
        }
        redisTemplate.opsForValue().set(key, 1, 10, TimeUnit.SECONDS);
    }

    private void releaseLockForRegisterCredential(String credential) {
        String key = StrUtil.format(GENERAL_LOCKED, "register", credential);
        redisTemplate.delete(key);
    }


    private void removeInviteTokenFromCache(String token) {
        redisTemplate.delete(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
    }

    private void createUserLink(Long userId, SocialAuthInfo authInfo, boolean check) {
        if (wxMpProperties == null) {
            return;
        }
        if (authInfo.getType().equals(LinkType.WECHAT.getType())) {
            String nickName = thirdPartyMemberMapper.selectNickNameByUnionIdAndType(wxMpProperties.getAppId(),
                    authInfo.getUnionId(), ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
            authInfo.setNickName(nickName);
        }
        iUserLinkService.createUserLink(userId, authInfo, check, authInfo.getType());
    }

    private void useThirdPartyInfo(SocialAuthInfo authInfo) {
        Integer type = null;
        String appId = null;
        switch (LinkType.toEnum(authInfo.getType())) {
            case WECHAT:
                if (wxMpProperties != null) {
                    type = ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType();
                    appId = wxMpProperties.getAppId();
                }
                break;
            case TENCENT:
                type = ThirdPartyMemberType.TENCENT.getType();
                if (webAppProperties != null) {
                    appId = webAppProperties.getAppId();
                }
                break;
            default:
                break;
        }
        if (type != null && appId != null) {
            ThirdPartyMemberInfo info = thirdPartyMemberMapper.selectInfo(appId, authInfo.getUnionId(), type);
            if (info == null) {
                return;
            }
            if (info.getNickName() != null) {
                authInfo.setNickName(info.getNickName());
            }
            if (info.getAvatar() == null) {
                return;
            }
            // upload third party avatars to cloud storage
            try {
                URL url = URLUtil.url(info.getAvatar());
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                InputStream inputStream = urlConnection.getInputStream();
                String fileName = StrUtil.subAfter(info.getAvatar(), StrUtil.SLASH, true);
                String mimeType = fileName.contains(StrUtil.DOT) ? FileUtil.extName(fileName) : urlConnection.getContentType();
                long contentLength = urlConnection.getContentLengthLong();
                // If the read request header is -1, go directly to the estimated size of the stream
                if (-1 == contentLength) {
                    contentLength = inputStream.available();
                }
                AssetUploadResult uploadResult = iAssetService.uploadFile(inputStream, contentLength, mimeType);
                authInfo.setAvatar(uploadResult.getToken());
            }
            catch (Exception e) {
                log.warn("third party avatar url cannot be read skip", e);
            }
        }
    }

    private void emailProcess(Long userId, String email) {
        // Verify the registered email address to prevent being bound by other Weige accounts during the process
        UserEntity userEntity = userMapper.selectByEmail(email);
        if (userEntity != null) {
            ExceptionUtil.isTrue(userId.equals(userEntity.getId()), REGISTER_EMAIL_HAS_EXIST);
            return;
        }
        // Determine whether the user has bound other mailboxes, the user's mailbox must be empty or registered mailbox
        UserEntity user = iUserService.getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        if (StrUtil.isNotBlank(user.getEmail())) {
            ExceptionUtil.isTrue(email.equals(user.getEmail()), MOBILE_BOUND_EMAIL_DUPLICATE);
        }
        else {
            iUserService.updateEmailByUserId(userId, email);
        }
    }

    private void handleCache(Long userId, String spaceId) {
        String key = RedisConstants.getUserInvitedJoinSpaceKey(userId, spaceId);
        redisTemplate.opsForValue().set(key, userId, 5, TimeUnit.MINUTES);
    }

}
