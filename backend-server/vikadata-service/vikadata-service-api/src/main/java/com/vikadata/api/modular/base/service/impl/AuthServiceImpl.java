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
import com.vikadata.api.modular.finance.service.IBillingOfflineService;
import lombok.extern.slf4j.Slf4j;

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
import com.vikadata.boot.autoconfigure.qq.WebAppProperties;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.constants.RedisConstants;
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
import static com.vikadata.define.constants.RedisConstants.ERROR_PWD_NUM_DIR;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;
import static com.vikadata.define.constants.RedisConstants.USER_AUTH_INFO_TOKEN;

/**
 * <p>
 * 授权相关服务接口实现
 * </p>
 *
 * @author Shawn Deng
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
        //人机验证
        afsCheckService.noTraceCheck(loginRo.getData());
        UserEntity user = iUserService.getByUsername(loginRo.getAreaCode(), loginRo.getUsername());
        int errorPwdCount = 0;
        String key = ERROR_PWD_NUM_DIR + user.getId();
        //判断是否连续输错超过五次密码
        if (BooleanUtil.isTrue(redisTemplate.hasKey(key))) {
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
            errorPwdCount = Integer.parseInt(Objects.requireNonNull(opts.get()).toString());
            ExceptionUtil.isTrue(errorPwdCount < 5, LOGIN_OFTEN);
        }
        //判断密码
        PasswordEncoder passwordEncoder = SpringContextHolder.getBean(PasswordEncoder.class);
        if (passwordEncoder.matches(loginRo.getCredential(), user.getPassword())) {
            // 第三方帐号关联
            SocialAuthInfo authInfo = this.getAuthInfoFromCache(loginRo.getToken());
            if (authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId())) {
                // 创建关联
                this.createUserLink(user.getId(), authInfo, true);
                // 立即从缓存里删除授权信息
                this.removeInviteTokenFromCache(loginRo.getToken());
            }
            //登陆成功，清空输入密码错误的次数
            redisTemplate.delete(key);
            //更新最后登陆时间
            iUserService.updateLoginTime(user.getId());
            return user.getId();
        }
        else {
            //记录输入密码错误的次数，连续输错密码超过五次账号锁定20分钟
            redisTemplate.opsForValue().set(key, errorPwdCount + 1, 20, TimeUnit.MINUTES);
            throw new BusinessException(USERNAME_OR_PASSWORD_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long loginUsingPassword(LoginRo loginRo) {
        // 根据用户名（邮箱/区号+手机）获取用户, 查询不到用户名会自动抛出异常
        UserEntity user = iUserService.getByUsername(loginRo.getAreaCode(), loginRo.getUsername());
        // 记录用户密码输入错误的键，每次锁住20分钟
        String errorInputPwdCountKey = ERROR_PWD_NUM_DIR + user.getId();
        int errorPwdCount = 0;
        // 判断是否连续输错超过五次密码
        if (BooleanUtil.isTrue(redisTemplate.hasKey(errorInputPwdCountKey))) {
            // 有记录输错密码次数，计算是否大于5次
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(errorInputPwdCountKey);
            Object value = opts.get();
            if (!Objects.isNull(value)) {
                errorPwdCount = Integer.parseInt(value.toString());
                ExceptionUtil.isTrue(errorPwdCount < 5, LOGIN_OFTEN);
            }
        }
        // 判断密码是否匹配
        PasswordEncoder passwordEncoder = SpringContextHolder.getBean(PasswordEncoder.class);
        if (!passwordEncoder.matches(loginRo.getCredential(), user.getPassword())) {
            // 记录输入密码错误的次数，连续输错密码超过五次账号锁定20分钟
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(errorInputPwdCountKey);
            opts.set(errorPwdCount + 1, 20, TimeUnit.MINUTES);
            throw new BusinessException(USERNAME_OR_PASSWORD_ERROR);
        }
        // 更新最后登陆时间
        iUserService.updateLoginTime(user.getId());
        // 登陆成功，清空输入密码错误的次数
        redisTemplate.delete(errorInputPwdCountKey);
        return user.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserLoginResult loginBySmsCode(LoginRo loginRo) {
        String mobile = loginRo.getUsername();
        String code = StrUtil.trim(loginRo.getCredential());
        // 校验参数
        ExceptionUtil.isNotBlank(code, CODE_EMPTY);
        // 校验验证码
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(loginRo.getUsername(), loginRo.getAreaCode());
        processor.validate(target, code, false, CodeValidateScope.LOGIN);
        UserLoginResult result = new UserLoginResult();
        Long userId = userMapper.selectIdByMobile(mobile);
        // 从缓存取出用户授权信息
        SocialAuthInfo authInfo = this.getAuthInfoFromCache(loginRo.getToken());
        // 是否关联账号
        boolean link = authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId());
        // 是否绑定邮箱
        boolean bindEmail = authInfo != null && StrUtil.isNotBlank(authInfo.getEmail());
        if (ObjectUtil.isNotNull(userId)) {
            // 第三方帐号关联
            if (link) {
                this.createUserLink(userId, authInfo, true);
                result.setUnionId(authInfo.getUnionId());
            }
            // 邮箱验证码后进入，绑定邮箱与维格帐号
            if (bindEmail) {
                this.emailProcess(userId, authInfo.getEmail());
            }
            // 更新最后登陆时间
            iUserService.updateLoginTime(userId);
            result.setUserId(userId);
        }
        else {
            // 检查第三方帐号是否关联了其他维格账号
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
        // 删除验证码
        processor.delCode(target.getRealTarget(), CodeValidateScope.LOGIN);
        // 立即从缓存里删除授权信息
        this.removeInviteTokenFromCache(loginRo.getToken());
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserLoginResult loginUsingSmsCode(LoginRo loginRo) {
        UserLoginResult result = new UserLoginResult();
        // 短信验证码方式登录，不存在则自动注册
        String areaCode = StrUtil.trim(loginRo.getAreaCode());
        ExceptionUtil.isNotBlank(areaCode, MOBILE_EMPTY);
        String mobile = StrUtil.trim(loginRo.getUsername());
        ExceptionUtil.isNotBlank(mobile, MOBILE_EMPTY);
        String mobileValidCode = StrUtil.trim(loginRo.getCredential());
        ExceptionUtil.isNotBlank(mobileValidCode, CODE_EMPTY);
        // 校验手机验证码
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(loginRo.getUsername(), loginRo.getAreaCode());
        processor.validate(target, mobileValidCode, false, CodeValidateScope.LOGIN);
        // 从缓存取出用户授权信息
        SocialAuthInfo authInfo = getAuthInfoFromCache(loginRo.getToken());
        // 是否第三方扫码登录后绑定手机号操作
        boolean socialLogin = authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId());
        if (socialLogin) {
            iUserLinkService.checkThirdPartyLinkOtherUser(authInfo.getUnionId(), authInfo.getType());
            // 加载获取第三方的昵称、头像
            useThirdPartyInfo(authInfo);
        }
        Long userId = iUserService.getUserIdByMobile(mobile);
        if (ObjectUtil.isNotNull(userId)) {
            // 更新最后登陆时间
            iUserService.updateLoginTime(userId);
            // 查询是否有手机号对应的空间成员
            List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByMobile(mobile);
            iUserService.activeInvitationSpace(userId, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        }
        else {
            // 注册用户
            String nickName = socialLogin ? authInfo.getNickName() : null;
            String avatar = socialLogin ? authInfo.getAvatar() : null;
            userId = registerUserUsingMobilePhone(areaCode, mobile, nickName, avatar);
            if(StrUtil.isNotEmpty(loginRo.getSpaceId())){
                // 缓存，用于邀请用户赠送附件容量
                this.handleCache(userId, loginRo.getSpaceId());
            }
            result.setIsSignUp(true);
        }
        // 如果是第三方应用扫码登录后绑定账号，则绑定
        if (socialLogin) {
            createUserLink(userId, authInfo, false);
        }
        // 删除验证码
        processor.delCode(target.getRealTarget(), CodeValidateScope.LOGIN);
        // 立即从缓存里删除第三方授权信息
        this.removeInviteTokenFromCache(loginRo.getToken());
        result.setUserId(userId);
        return result;
    }

    @Override
    public UserLoginResult loginByEmailCode(LoginRo loginRo) {
        String email = loginRo.getUsername();
        String code = StrUtil.trim(loginRo.getCredential());
        // 校验参数
        ExceptionUtil.isTrue(Validator.isEmail(email), REGISTER_EMAIL_ERROR);
        ExceptionUtil.isNotBlank(code, CODE_EMPTY);
        // 校验验证码
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(ValidateTarget.create(email), code, false, CodeValidateScope.REGISTER_EMAIL);
        UserLoginResult result = new UserLoginResult();
        // 判断是否存在
        UserEntity userEntity = userMapper.selectByEmail(email);
        if (ObjectUtil.isNotNull(userEntity)) {
            // 更新最后登陆时间
            iUserService.updateLoginTime(userEntity.getId());
            result.setUserId(userEntity.getId());
        }
        else {
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setEmail(email);
            result.setToken(this.saveAuthInfoToCache(authInfo));
        }
        // 删除验证码
        processor.delCode(email, CodeValidateScope.REGISTER_EMAIL);
        return result;
    }

    @Override
    public UserLoginResult loginUsingEmailCode(LoginRo loginRo) {
        UserLoginResult result = new UserLoginResult();
        String email = loginRo.getUsername();
        String emailValidCode = StrUtil.trim(loginRo.getCredential());
        // 校验参数
        ExceptionUtil.isTrue(Validator.isEmail(email), REGISTER_EMAIL_ERROR);
        ExceptionUtil.isNotBlank(emailValidCode, CODE_EMPTY);
        // 校验验证码
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(ValidateTarget.create(email), emailValidCode, false, CodeValidateScope.REGISTER_EMAIL);
        // 判断是否存在
        Long userId = iUserService.getUserIdByEmail(email);
        if (userId != null) {
            // 更新最后登陆时间
            iUserService.updateLoginTime(userId);
            // 查询是否有邮箱对应的空间成员，只有新注册才会有这个操作
            List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(email);
            iUserService.activeInvitationSpace(userId, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        }
        else {
            // 邮箱自动注册用户不提供第三方扫码登录绑定
            userId = registerUserUsingEmail(email, loginRo.getSpaceId());
            if(StrUtil.isNotEmpty(loginRo.getSpaceId())){
                // 缓存，用于邀请用户赠送附件容量
                this.handleCache(userId, loginRo.getSpaceId());
            }
            result.setIsSignUp(true);
        }
        // 删除验证码
        processor.delCode(email, CodeValidateScope.LOGIN);
        result.setUserId(userId);
        return result;
    }

    public Long registerUserUsingMobilePhone(String areaCode, String mobile, String nickName, String avatar) {
        // 根据手机号新建用户，并激活对应成员
        UserEntity user = iUserService.createUserByMobilePhone(areaCode, mobile, nickName, avatar);
        // 查询是否有手机号对应的空间成员
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByMobile(mobile);
        createOrActiveSpace(user, inactiveMembers.stream().map(MemberDto::getId).collect(Collectors.toList()));
        return user.getId();
    }

    public Long registerUserUsingEmail(String email, String spaceId) {
        // 根据邮箱新建用户，并激活对应成员
        UserEntity user = iUserService.createUserByEmail(email);
        // 查询是否有邮箱对应的空间成员，只有新注册才会有这个操作
        List<MemberDto> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(email);
        // 邀请新用户加入空间站奖励附件容量，异步操作
        TaskManager.me().execute(() -> this.checkSpaceRewardCapacity(inactiveMembers, spaceId));
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
        log.info("邀请码注册新用户:{}-{}", token, inviteCode);
        // 从缓存取出用户授权信息
        SocialAuthInfo authInfo = this.getAuthInfoFromCache(token);
        ExceptionUtil.isTrue(authInfo != null, AUTH_INFO_NO_VALID);
        boolean isMobile = StrUtil.isNotBlank(authInfo.getMobile());
        boolean isEmail = StrUtil.isNotBlank(authInfo.getEmail());
        ExceptionUtil.isTrue(isMobile || isEmail, AUTH_INFO_NO_VALID);
        String credential = isMobile ? authInfo.getMobile() : authInfo.getEmail();
        // 锁住注册凭证
        this.lockRegisterCredential(credential);
        // 校验邀请码的有效性（放在缓存操作之后，减少同一注册凭证恶意攻击，造成对数据库的压力）
        if (StrUtil.isNotBlank(inviteCode)) {
            try {
                iVCodeService.checkInviteCode(inviteCode);
            }
            finally {
                // 立即释放注册凭证锁
                this.releaseLockForRegisterCredential(credential);
            }
        }
        if (isMobile) {
            // 校验手机号未注册
            boolean exist = iUserService.checkByCodeAndMobile(authInfo.getAreaCode(), authInfo.getMobile());
            ExceptionUtil.isFalse(exist, MOBILE_HAS_REGISTER);
        }
        boolean link = StrUtil.isNotBlank(authInfo.getUnionId());
        // 检查第三方帐号是否关联了其他维格账号
        if (link) {
            iUserLinkService.checkThirdPartyLinkOtherUser(authInfo.getUnionId(), authInfo.getType());
            // 获取第三方的昵称、头像
            useThirdPartyInfo(authInfo);
        }
        String email = null;
        UserRegisterResult result = new UserRegisterResult();
        if (isEmail) {
            // 校验邮箱未被其他维格帐号绑定
            boolean exist = iUserService.checkByEmail(authInfo.getEmail());
            ExceptionUtil.isFalse(exist, REGISTER_EMAIL_HAS_EXIST);
            email = authInfo.getEmail();
            result.setEmailRegister(true);
        }
        // 注册用户
        Long registerUserId = iUserService.create(authInfo.getAreaCode(), authInfo.getMobile(),
                authInfo.getNickName(), authInfo.getAvatar(), email, authInfo.getTenantName());
        result.setUserId(registerUserId);
        // 第三方帐号帐号关联
        if (link) {
            this.createUserLink(registerUserId, authInfo, false);
            result.setType(authInfo.getType());
            result.setUnionId(authInfo.getUnionId());
        }
        // 邀请奖励
        this.invitedReward(registerUserId, authInfo, inviteCode);
        // 立即从缓存里删除授权信息
        this.removeInviteTokenFromCache(token);
        // 立即释放注册凭证锁
        this.releaseLockForRegisterCredential(credential);
        return result;
    }

    private void invitedReward(Long registerUserId, SocialAuthInfo authInfo, String inviteCode) {
        // 跳过邀请码无奖励
        if (inviteCode == null) {
            return;
        }
        // 保存邀请码使用记录
        ivCodeService.useInviteCode(registerUserId, authInfo.getNickName(), inviteCode);
        // 邮箱注册无奖励
        if (StrUtil.isBlank(authInfo.getMobile())) {
            return;
        }
        // 邀请码拥有者，非个人邀请码不处理奖励
        Long inviteUserId = vCodeMapper.selectRefIdByCodeAndType(inviteCode, VCodeType.PERSONAL_INVITATION_CODE.getType());
        if (inviteUserId == null) {
            // ============= 官方邀请注册奖励积分值 ===============
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
        // 新用户创建积分记录
        iIntegralService.createHistory(registerUserId, officialRewardActionCode, IntegralAlterType.INCOME,
                beInvitorBeforeIntegralValue, beInvitedRewardIntegralValue, JSONUtil.createObj());
        // 发送通知
        if (beInvitedRewardIntegralRule.isNotify()) {
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY,
                    Collections.singletonList(registerUserId), 0L, null,
                    Dict.create().set(COUNT, beInvitedRewardIntegralRule.getIntegralValue()).set(ACTION_NAME, beInvitedRewardIntegralRule.getActionName())));
        }
    }

    @Override
    public void personalInvitedReward(Long registerUserId, String registerUserName, Long inviteUserId) {
        // 要对邀请者实施奖励积分，先锁住当前用户积分变更
        Lock lock = redisLockRegistry.obtain(inviteUserId.toString());
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // ============= 被邀请注册奖励积分值 ===============
                    IntegralRule beInvitedRewardIntegralRule = SystemConfigManager.getConfig().getIntegral().getRule().get(IntegralActionCodeConstants.BE_INVITED_TO_REWARD);
                    int beInvitedRewardIntegralValue = beInvitedRewardIntegralRule.getIntegralValue();
                    // 新用户创建积分记录
                    String invitorName = userMapper.selectUserNameById(inviteUserId);
                    int beInvitorBeforeIntegralValue = iIntegralService.getTotalIntegralValueByUserId(registerUserId);
                    iIntegralService.createHistory(registerUserId, IntegralActionCodeConstants.BE_INVITED_TO_REWARD, IntegralAlterType.INCOME,
                            beInvitorBeforeIntegralValue, beInvitedRewardIntegralValue, JSONUtil.createObj().putOnce("name", invitorName));
                    // 发送通知
                    if (beInvitedRewardIntegralRule.isNotify()) {
                        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY,
                                Collections.singletonList(registerUserId), 0L, null,
                                Dict.create().set(COUNT, beInvitedRewardIntegralRule.getIntegralValue()).set(ACTION_NAME, beInvitedRewardIntegralRule.getActionName())));
                    }

                    // ============= 奖励邀请码拥有者 =============
                    IntegralRule inviteRewardIntegralRule = SystemConfigManager.getConfig().getIntegral().getRule().get(IntegralActionCodeConstants.INVITATION_REWARD);
                    // 手机注册获取奖励倍数
                    int inviteRewardIntegralValue = inviteRewardIntegralRule.getIntegralValue();
                    int invitorBeforeIntegralValue = iIntegralService.getTotalIntegralValueByUserId(inviteUserId);
                    // 创建积分记录
                    String inviteUserName = registerUserName != null ? registerUserName : userMapper.selectUserNameById(registerUserId);
                    Long recordId = iIntegralService.createHistory(inviteUserId, IntegralActionCodeConstants.INVITATION_REWARD, IntegralAlterType.INCOME,
                            invitorBeforeIntegralValue, inviteRewardIntegralValue,
                            JSONUtil.createObj().putOnce("userId", registerUserId).putOnce("name", inviteUserName));
                    // 发送通知
                    if (inviteRewardIntegralRule.isNotify()) {
                        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.INTEGRAL_INCOME_NOTIFY,
                                Collections.singletonList(inviteUserId), 0L, null,
                                Dict.create().set(COUNT, inviteRewardIntegralValue).set(ACTION_NAME, inviteRewardIntegralRule.getActionName())));
                    }
                    // 暂时记录下被邀请的新用户，跨连接修改名称
                    String key = RedisConstants.getInviteHistoryKey(registerUserId.toString());
                    redisTemplate.opsForValue().set(key, recordId, 1, TimeUnit.HOURS);
                }
                catch (Exception e) {
                    // 业务失败，直接抛异常
                    log.error("邀请码注册奖励失败", e);
                    throw new BusinessException(VCodeException.INVITE_CODE_REWARD_ERROR);
                }
                finally {
                    // 解锁邀请码所属用户的积分锁
                    lock.unlock();
                }
            }
            else {
                // 注册操作过于频繁，请稍后重试
                log.error("注册操作过于频繁，请稍后重试");
                throw new BusinessException(VCodeException.INVITE_CODE_FREQUENTLY);
            }
        }
        catch (InterruptedException e) {
            // 被中断，返回失败信息
            log.error("邀请码注册奖励失败", e);
            throw new BusinessException(VCodeException.INVITE_CODE_REWARD_ERROR);
        }
    }

    @Override
    public void checkSpaceRewardCapacity(List<MemberDto> inactiveMembers, String spaceId) {
        // 匹配空间站
        MemberDto memberDto = inactiveMembers.stream().filter(e -> spaceId.equals(e.getSpaceId())).findFirst().get();
        if(ObjectUtil.isNotEmpty(memberDto)){
            // 邀请的成员成功激活，空间站获赠300M附件容量
            iBillingOfflineService.createGiftCapacityOrder(memberDto.getUserId(), memberDto.getMemberName(), spaceId);
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
        // 从缓存取出用户授权信息
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
            // 上传第三方头像到云端存储
            try {
                URL url = URLUtil.url(info.getAvatar());
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                InputStream inputStream = urlConnection.getInputStream();
                String fileName = StrUtil.subAfter(info.getAvatar(), StrUtil.SLASH, true);
                String mimeType = fileName.contains(StrUtil.DOT) ? FileUtil.extName(fileName) : urlConnection.getContentType();
                long contentLength = urlConnection.getContentLengthLong();
                // 如果出现读取请求头为-1，直接过去流预估大小
                if (-1 == contentLength) {
                    contentLength = inputStream.available();
                }
                AssetUploadResult uploadResult = iAssetService.uploadFile(inputStream, contentLength, mimeType);
                authInfo.setAvatar(uploadResult.getToken());
            }
            catch (Exception e) {
                log.warn("第三方头像 URL 无法读取，跳过", e);
            }
        }
    }

    private void emailProcess(Long userId, String email) {
        // 校验注册邮箱，防止过程中被其他维格帐号绑定
        UserEntity userEntity = userMapper.selectByEmail(email);
        if (userEntity != null) {
            ExceptionUtil.isTrue(userId.equals(userEntity.getId()), REGISTER_EMAIL_HAS_EXIST);
            return;
        }
        // 判断用户是否已绑定其他邮箱、用户的邮箱须为空或是注册邮箱
        UserEntity user = iUserService.getById(userId);
        ExceptionUtil.isNotNull(user, USER_NOT_EXIST);
        if (StrUtil.isNotBlank(user.getEmail())) {
            ExceptionUtil.isTrue(email.equals(user.getEmail()), MOBILE_BOUND_EMAIL_DUPLICATE);
        }
        else {
            iUserService.updateEmailByUserId(userId, email);
        }
    }

    private void handleCache(Long userId, String spaceId){
        String key = RedisConstants.getUserInvitedJoinSpaceKey(userId, spaceId);
        redisTemplate.opsForValue().set(key, userId, 5, TimeUnit.MINUTES);
    }

}
