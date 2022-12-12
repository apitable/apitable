package com.vikadata.api.auth.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.auth.dto.UserLoginDTO;
import com.vikadata.api.auth.ro.LoginRo;
import com.vikadata.api.auth.service.IAuthService;
import com.vikadata.api.base.enums.ActionException;
import com.vikadata.api.interfaces.billing.facade.EntitlementServiceFacade;
import com.vikadata.api.interfaces.billing.model.EntitlementRemark;
import com.vikadata.api.interfaces.user.facade.UserLinkServiceFacade;
import com.vikadata.api.interfaces.user.model.UserLinkRequest;
import com.vikadata.api.organization.dto.MemberDTO;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.shared.cache.service.SocialAuthInfoCacheService;
import com.vikadata.api.shared.captcha.CodeValidateScope;
import com.vikadata.api.shared.captcha.ValidateCodeProcessor;
import com.vikadata.api.shared.captcha.ValidateCodeProcessorManage;
import com.vikadata.api.shared.captcha.ValidateCodeType;
import com.vikadata.api.shared.captcha.ValidateTarget;
import com.vikadata.api.shared.security.PasswordService;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.user.enums.UserException.LOGIN_OFTEN;
import static com.vikadata.api.user.enums.UserException.MOBILE_EMPTY;
import static com.vikadata.api.user.enums.UserException.REGISTER_EMAIL_ERROR;
import static com.vikadata.api.user.enums.UserException.USERNAME_OR_PASSWORD_ERROR;
import static com.vikadata.core.constants.RedisConstants.ERROR_PWD_NUM_DIR;
import static com.vikadata.core.constants.RedisConstants.USER_AUTH_INFO_TOKEN;
import static com.vikadata.core.constants.RedisConstants.getUserInvitedJoinSpaceKey;

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
    private IMemberService iMemberService;

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    @Resource
    private SocialAuthInfoCacheService socialAuthInfoCacheService;

    @Resource
    private UserLinkServiceFacade userLinkServiceFacade;

    @Resource
    private PasswordService passwordService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long loginUsingPassword(LoginRo loginRo) {
        // Get the user according to the username (email area code + mobile phone), if the username cannot be queried, an exception will be thrown automatically
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
        if (!passwordService.matches(loginRo.getCredential(), user.getPassword())) {
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
    public UserLoginDTO loginUsingSmsCode(LoginRo loginRo) {
        UserLoginDTO result = new UserLoginDTO();
        // Log in by SMS verification code, if it does not exist, it will automatically register
        String areaCode = StrUtil.trim(loginRo.getAreaCode());
        ExceptionUtil.isNotBlank(areaCode, MOBILE_EMPTY);
        String mobile = StrUtil.trim(loginRo.getUsername());
        ExceptionUtil.isNotBlank(mobile, MOBILE_EMPTY);
        String mobileValidCode = StrUtil.trim(loginRo.getCredential());
        ExceptionUtil.isNotBlank(mobileValidCode, ActionException.CODE_EMPTY);
        // Verify mobile phone verification code
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        ValidateTarget target = ValidateTarget.create(loginRo.getUsername(), loginRo.getAreaCode());
        processor.validate(target, mobileValidCode, false, CodeValidateScope.LOGIN);
        // Get user authorization information from cache
        SocialAuthInfo authInfo = socialAuthInfoCacheService.getAuthInfoFromCache(loginRo.getToken());
        // Whether to bind the mobile phone number after the third-party scan code login operation
        boolean socialLogin = authInfo != null && StrUtil.isNotBlank(authInfo.getUnionId());
        if (socialLogin) {
            userLinkServiceFacade.wrapperSocialAuthInfo(authInfo);
        }
        Long userId = iUserService.getUserIdByMobile(mobile);
        if (ObjectUtil.isNotNull(userId)) {
            // Update last login time
            iUserService.updateLoginTime(userId);
            // Query whether there is a space member corresponding to a mobile phone number
            List<MemberDTO> inactiveMembers = iMemberService.getInactiveMemberDtoByMobile(mobile);
            iMemberService.activeIfExistInvitationSpace(userId, inactiveMembers.stream().map(MemberDTO::getId).collect(Collectors.toList()));
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
            userLinkServiceFacade.createUserLink(new UserLinkRequest(userId, authInfo));
        }
        // delete verification code
        processor.delCode(target.getRealTarget(), CodeValidateScope.LOGIN);
        // Immediately delete third-party authorization information from the cache
        removeInviteTokenFromCache(loginRo.getToken());
        result.setUserId(userId);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserLoginDTO loginUsingEmailCode(LoginRo loginRo) {
        UserLoginDTO result = new UserLoginDTO();
        String email = loginRo.getUsername();
        String emailValidCode = StrUtil.trim(loginRo.getCredential());
        // Check parameters
        ExceptionUtil.isTrue(Validator.isEmail(email), REGISTER_EMAIL_ERROR);
        ExceptionUtil.isNotBlank(emailValidCode, ActionException.CODE_EMPTY);
        // Verify verification code
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        processor.validate(ValidateTarget.create(email), emailValidCode, false, CodeValidateScope.REGISTER_EMAIL);
        // determine whether there is
        Long userId = iUserService.getUserIdByEmail(email);
        if (userId != null) {
            // Update last login time
            iUserService.updateLoginTime(userId);
            // Query whether there is a space member corresponding to the mailbox, only new registration will have this operation
            List<MemberDTO> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(email);
            iMemberService.activeIfExistInvitationSpace(userId, inactiveMembers.stream().map(MemberDTO::getId).collect(Collectors.toList()));
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
        List<MemberDTO> inactiveMembers = iMemberService.getInactiveMemberDtoByMobile(mobile);
        createOrActiveSpace(user, inactiveMembers.stream().map(MemberDTO::getId).collect(Collectors.toList()));
        return user.getId();
    }

    public Long registerUserUsingEmail(String email, String spaceId) {
        // Create a new user based on the mailbox and activate the corresponding member
        UserEntity user = iUserService.createUserByEmail(email);
        // Query whether there is a space member corresponding to the mailbox, only new registration will have this operation
        List<MemberDTO> inactiveMembers = iMemberService.getInactiveMemberDtoByEmail(email);
        // Invite new users to join the space station to reward attachment capacity, asynchronous operation
        this.checkSpaceRewardCapacity(user.getId(), user.getNickName(), spaceId);
        createOrActiveSpace(user, inactiveMembers.stream().map(MemberDTO::getId).collect(Collectors.toList()));
        return user.getId();
    }

    private void createOrActiveSpace(UserEntity user, List<Long> memberIds) {
        if (memberIds.isEmpty()) {
            iUserService.initialDefaultSpaceForUser(user);
        }
        else {
            iMemberService.activeIfExistInvitationSpace(user.getId(), memberIds);
        }
    }

    @Override
    public void checkSpaceRewardCapacity(Long userId, String userName, String spaceId) {
        // the invited members are successfully activated, and the space station will receive a 300M accessory capacity
        if (spaceId != null) {
            entitlementServiceFacade.addGiftCapacity(spaceId, new EntitlementRemark(userId, userName));
        }
    }

    private void removeInviteTokenFromCache(String token) {
        redisTemplate.delete(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
    }

    private void handleCache(Long userId, String spaceId) {
        String key = getUserInvitedJoinSpaceKey(userId, spaceId);
        redisTemplate.opsForValue().set(key, userId, 5, TimeUnit.MINUTES);
    }

}
