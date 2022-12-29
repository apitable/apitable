package com.vikadata.api.auth.service.impl;

import java.util.concurrent.atomic.AtomicReference;

import cn.hutool.core.util.IdUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.auth.enums.LoginType;
import com.vikadata.api.auth.ro.LoginRo;
import com.vikadata.api.base.enums.EmailCodeType;
import com.vikadata.api.base.enums.SmsCodeType;
import com.vikadata.api.shared.captcha.CodeValidateScope;
import com.vikadata.api.shared.captcha.ValidateCodeProcessor;
import com.vikadata.api.shared.captcha.ValidateCodeProcessorManage;
import com.vikadata.api.shared.captcha.ValidateCodeType;
import com.vikadata.api.shared.captcha.ValidateTarget;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.vo.UserInfoVo;
import com.vikadata.core.exception.BusinessException;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatNoException;

public class AuthServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private SpaceMapper spaceMapper;

    @Test
    public void testLoginUsingPasswordWithMobilePhoneNotExist() {
        // The mobile phone number does not exist, try to log in, do not automatically register
        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode("+86");
        loginRo.setUsername("13631619061");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithMobilePhoneWithoutPassword() {
        // The phone number but the password is wrong, try to log in, not automatically registered
        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode("+86");
        loginRo.setUsername("13631619061");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithMobilePhoneInputPasswordCorrect() {
        // The phone number and password are correct and try to log in
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setCode("+86");
        user.setMobilePhone("13631619061");
        user.setPassword(passwordEncoder.encode("qwer1234"));
        iUserService.save(user);

        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode("+86");
        loginRo.setUsername("13631619061");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingPassword(loginRo));
    }

    @Test
    public void testLoginUsingPasswordWithEmailNotExist() {
        // The mobile phone number does not exist, try to log in, do not automatically register
        LoginRo loginRo = new LoginRo();
        loginRo.setUsername("dengguiheng@vikadat.com");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithEmailWithoutPassword() {
        // Phone number but wrong password try to log in, no automatic registration
        LoginRo loginRo = new LoginRo();
        loginRo.setUsername("dengguiheng@vikadat.com");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatCode(() -> iAuthService.loginUsingPassword(loginRo)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoginUsingPasswordWithEmailInputPasswordCorrect() {
        // The phone number and password are correct and try to log in
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setEmail("dengguiheng@vikadat.com");
        user.setPassword(passwordEncoder.encode("qwer1234"));
        iUserService.save(user);

        LoginRo loginRo = new LoginRo();
        loginRo.setUsername("dengguiheng@vikadat.com");
        loginRo.setType(LoginType.PASSWORD);
        loginRo.setCredential("qwer1234");
        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingPassword(loginRo));
    }

    @Test
    public void testLoginUsingSmsCodeWithMobilePhoneNotExistAutoRegister() {
        String areaCode = "+86";
        String mobile = "13631619061";
        // Prepare verification code
        String validCode = sendLoginSmsCode(areaCode, mobile);

        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode(areaCode);
        loginRo.setUsername(mobile);
        loginRo.setType(LoginType.SMS_CODE);
        loginRo.setCredential(validCode);

        AtomicReference<Long> userId = new AtomicReference<>();

        assertThatNoException().isThrownBy(() -> userId.set(iAuthService.loginUsingSmsCode(loginRo).getUserId()));

        checkUserHasSpace(userId.get());
    }

    @Test
    public void testLoginUsingSmsCodeWithMobilePhoneExistAutoLogin() {
        // prepare users
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setCode("+86");
        user.setMobilePhone("13631619061");
        iUserService.save(user);

        String areaCode = "+86";
        String mobile = "13631619061";
        // Prepare verification code
        String validCode = sendLoginSmsCode(areaCode, mobile);

        LoginRo loginRo = new LoginRo();
        loginRo.setAreaCode(areaCode);
        loginRo.setUsername(mobile);
        loginRo.setType(LoginType.SMS_CODE);
        loginRo.setCredential(validCode);

        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingSmsCode(loginRo));
    }

    @Test
    public void testLoginUsingEmailCodeWithEmailNotExistAutoRegister() {
        String email = "dengguiheng@vikadata.com";
        // Prepare verification code
        String validCode = sendLoginEmailCode(email);

        LoginRo loginRo = new LoginRo();
        loginRo.setUsername(email);
        loginRo.setType(LoginType.EMAIL_CODE);
        loginRo.setCredential(validCode);

        AtomicReference<Long> userId = new AtomicReference<>();

        assertThatNoException().isThrownBy(() -> userId.set(iAuthService.loginUsingEmailCode(loginRo).getUserId()));

        checkUserHasSpace(userId.get());
    }

    @Test
    public void testLoginUsingEmailCodeWithEmailExistAutoLogin() {
        String email = "dengguiheng@vikadata.com";
        UserEntity user = new UserEntity();
        user.setUuid(IdUtil.fastSimpleUUID());
        user.setEmail(email);
        iUserService.save(user);

        String validCode = sendLoginEmailCode(email);

        LoginRo loginRo = new LoginRo();
        loginRo.setUsername(email);
        loginRo.setType(LoginType.EMAIL_CODE);
        loginRo.setCredential(validCode);

        assertThatNoException().isThrownBy(() -> iAuthService.loginUsingEmailCode(loginRo));
    }

    private String sendLoginSmsCode(String areaCode, String mobile) {
        CodeValidateScope scope = CodeValidateScope.fromName(SmsCodeType.fromName(2).name());
        ValidateTarget target = ValidateTarget.create(mobile, areaCode);
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.SMS);
        return processor.createAndSend(target, scope, false);
    }

    private String sendLoginEmailCode(String email) {
        CodeValidateScope scope = CodeValidateScope.fromName(EmailCodeType.fromName(2).name());
        ValidateTarget target = ValidateTarget.create(email);
        ValidateCodeProcessor processor = ValidateCodeProcessorManage.me().findValidateCodeProcessor(ValidateCodeType.EMAIL);
        return processor.createAndSend(target, scope, false);
    }

    private void checkUserHasSpace(Long userId) {
        int count = iMemberService.getSpaceCountByUserId(userId);
        assertThat(count).isNotEqualTo(0).isGreaterThan(0);
        SessionContext.setUserId(userId);
        checkNewUseInfo(userId);
    }

    private void checkNewUseInfo(Long userId) {
        UserInfoVo userInfoVo = iUserService.getCurrentUserInfo(userId, null, false);
        assertThat(userInfoVo).isNotNull();
        assertThat(userInfoVo.getUserId()).isNotNull();
        assertThat(userInfoVo.getUuid()).isNotNull();
        assertThat(userInfoVo.getNickName()).isNotBlank();
        assertThat(userInfoVo.getAvatar()).isNotBlank();
        assertThat(userInfoVo.getSpaceId()).isNotBlank();
        assertThat(userInfoVo.getMemberId()).isNotNull();
        assertThat(userInfoVo.getMemberName()).isNotBlank();
        assertThat(userInfoVo.getUnitId()).isNotNull();
        assertThat(userInfoVo.getIsNewComer()).isNotNull().isTrue();
        assertThat(userInfoVo.getIsNickNameModified()).isNotNull().isTrue();
        assertThat(userInfoVo.getIsMemberNameModified()).isNotNull().isTrue();
        assertThat(userInfoVo.getUsedInviteReward()).isNotNull().isFalse();
    }
}
